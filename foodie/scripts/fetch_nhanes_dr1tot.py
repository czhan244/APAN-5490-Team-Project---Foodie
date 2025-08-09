#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NHANES DR1TOT Downloader → Normalize Column Names → Keep Useful Columns → Merge → Export
Also computes p50/p75 benchmarks by age-bin & sex for key nutrients.

Usage:
  python fetch_nhanes_dr1tot.py
  # Custom output directory / skip benchmarks:
  # python fetch_nhanes_dr1tot.py --out database/seed/nhanes --no-bench
"""

import os
import json
import time
import argparse
from pathlib import Path
from typing import List

import pandas as pd
import requests

# --------------------------- CONFIG ---------------------------

# Latest two cycles (enough for Final Project demo)
DEFAULT_URLS = {
    "2017-2020": "https://wwwn.cdc.gov/Nchs/Nhanes/2017-2020/P_DR1TOT.XPT",
    "2021-2023": "https://wwwn.cdc.gov/Nchs/Nhanes/2021-2023/DR1TOT_L.XPT",
}

# Column name mapping across years → unified standard names
# Standard names: seqn, weight_day1, weight_day2, age, sex, kcal, protein, carb, fat, sugar, sodium, fiber, cholesterol
NAME_MAP_CANDIDATES = {
    "seqn":        ["SEQN"],
    "weight_day1": ["WTDRD1", "WTDRD1PP"],
    "weight_day2": ["WTDR2D", "WTDR2DPP"],
    "age":         ["RIDAGEYR"],
    "sex":         ["RIAGENDR"],  # 1=Male, 2=Female

    # Core nutrients (column names vary slightly by cycle)
    "kcal":        ["DR1TKCAL", "KCAL"],
    "protein":     ["DR1TPROT", "PROT"],
    "carb":        ["DR1TCARB", "CARB"],
    "fat":         ["DR1TTFAT", "TFAT"],
    "sugar":       ["DR1TSUGR", "TSUGR"],
    "sodium":      ["DR1TSODI", "TSODI"],
    "fiber":       ["DR1TFIBE", "TFIBE", "FIBE"],
    "cholesterol": ["DR1TCHOL", "TCHOL", "CHOL"],
}

# Final columns to keep
USEFUL_COLUMNS = [
    "cycle",        # survey cycle label
    "seqn",
    "weight_day1",
    "weight_day2",
    "age",
    "sex",
    "kcal",
    "protein",
    "carb",
    "fat",
    "sugar",
    "sodium",
    "fiber",
    "cholesterol",
]

# Age bins for benchmarks
AGE_BINS = [0, 12, 19, 31, 51, 200]
AGE_LABELS = ["<12", "12-18", "19-30", "31-50", "51+"]

# --------------------------- UTILS ---------------------------

def download(url: str, out: Path, retries: int = 3, timeout: int = 60):
    out.parent.mkdir(parents=True, exist_ok=True)
    for i in range(1, retries + 1):
        try:
            print(f"↓ [{i}/{retries}] {url}")
            r = requests.get(url, timeout=timeout)
            r.raise_for_status()
            out.write_bytes(r.content)
            print(f"   Saved: {out}")
            return out
        except Exception as e:
            print(f"   ! Download failed: {e}")
            if i < retries:
                time.sleep(2 * i)
    raise RuntimeError(f"Download failed after {retries} attempts: {url}")

def pick_first_existing(columns: List[str], candidates: List[str]) -> str:
    for c in candidates:
        if c in columns:
            return c
    return ""

def normalize_df(raw: pd.DataFrame) -> pd.DataFrame:
    """Map original columns to standard names; convert to numeric; clean anomalies."""
    cols = list(raw.columns)
    mapping = {}
    for std_name, cand in NAME_MAP_CANDIDATES.items():
        found = pick_first_existing(cols, cand)
        if found:
            mapping[found] = std_name
        else:
            if std_name in ("seqn", "age", "sex"):
                print(f"   ! Missing required column for '{std_name}', candidates={cand}")

    df = raw.rename(columns=mapping)

    # Keep only the columns we care about
    keep = [c for c in USEFUL_COLUMNS if c in df.columns or c == "cycle"]
    df = df[keep].copy()

    # Numeric cleaning
    for col in df.columns:
        if col == "cycle":
            continue
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if col != "sex":
            df.loc[(df[col].abs() < 1e-8) | (df[col] < 0), col] = pd.NA

    # Reasonable age range
    if "age" in df.columns:
        df = df[(df["age"] >= 0) & (df["age"] <= 120)]

    return df

def compute_benchmarks(df_merged: pd.DataFrame) -> pd.DataFrame:
    """Compute p50/p75 benchmarks by age-bin & sex (sex: 0=All, 1=Male, 2=Female)."""
    df = df_merged.copy()
    if "age" not in df.columns:
        raise ValueError("No 'age' column for benchmarks.")

    df["age_bin"] = pd.cut(df["age"], bins=AGE_BINS, labels=AGE_LABELS, right=False)
    nutrients = [c for c in ["kcal","protein","carb","fat","sugar","sodium","fiber","cholesterol"] if c in df.columns]

    rows = []

    def agg(group: pd.DataFrame, sex_label: int, age_label: str):
        row = {"sex": sex_label, "age_bin": age_label, "n": int(group.shape[0])}
        for nut in nutrients:
            s = pd.to_numeric(group[nut], errors="coerce").dropna()
            row[f"{nut}_p50"] = float(s.quantile(0.5)) if len(s) else None
            row[f"{nut}_p75"] = float(s.quantile(0.75)) if len(s) else None
        return row

    # All sexes
    for age_label, g in df.groupby("age_bin"):
        rows.append(agg(g, 0, str(age_label)))

    # Male / Female
    if "sex" in df.columns:
        for sex_val, sub in df.groupby("sex"):
            sex_val = int(sex_val) if pd.notna(sex_val) else 0
            for age_label, g in sub.groupby("age_bin"):
                rows.append(agg(g, sex_val, str(age_label)))

    return pd.DataFrame(rows).sort_values(by=["sex", "age_bin"]).reset_index(drop=True)

# --------------------------- MAIN ---------------------------

def main(out_dir: str, no_bench: bool):
    OUT = Path(out_dir)
    RAW = OUT / "raw_xpt"
    CSV = OUT / "csv"
    MERGED = OUT / "merged"
    BM = OUT / "benchmarks"
    for p in (RAW, CSV, MERGED, BM):
        p.mkdir(parents=True, exist_ok=True)

    merged_list = []

    for cycle, url in DEFAULT_URLS.items():
        xpt_path = RAW / url.split("/")[-1]
        if not xpt_path.exists():
            download(url, xpt_path)
        else:
            print(f"✓ Exists: {xpt_path.name}")

        print(f"→ Reading XPT: {xpt_path.name}")
        df_raw = pd.read_sas(xpt_path, format="xport", encoding="utf-8")
        print(f"   rows={len(df_raw)}, cols={len(df_raw.columns)}")

        df_norm = normalize_df(df_raw)
        df_norm["cycle"] = cycle
        print(f"   normalized cols={list(df_norm.columns)}")

        # Save normalized CSV for each cycle
        csv_path = CSV / f"{cycle.replace(' ', '_')}_DR1TOT_normalized.csv"
        df_norm.to_csv(csv_path, index=False)
        print(f"   saved: {csv_path}")

        merged_list.append(df_norm)

    # Merge cycles
    merged = pd.concat(merged_list, ignore_index=True)
    print(f"\n★ merged rows={len(merged)}, cols={len(merged.columns)}")

    merged_csv = MERGED / "nhanes_dr1tot_merged.csv"
    merged_parquet = MERGED / "nhanes_dr1tot_merged.parquet"

    merged.to_csv(merged_csv, index=False)
    try:
        merged.to_parquet(merged_parquet, index=False)
    except Exception as e:
        print(f"   skip parquet (no pyarrow?): {e}")

    print(f"   saved: {merged_csv}")

    # Benchmarks
    if not no_bench:
        bench = compute_benchmarks(merged)
        bm_csv = BM / "nhanes_benchmarks_p50_p75.csv"
        bm_json = BM / "nhanes_benchmarks_p50_p75.json"
        bench.to_csv(bm_csv, index=False)
        bm_json.write_text(json.dumps(bench.to_dict(orient="records"), ensure_ascii=False, indent=2))
        print(f"   saved benchmarks: {bm_csv}")
        print(f"   saved benchmarks: {bm_json}")

    print("\nDone.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="database/seed/nhanes", help="output directory")
    parser.add_argument("--no-bench", action="store_true", help="do not compute benchmarks")
    args = parser.parse_args()
    main(args.out, args.no_bench)

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NHANES DR1TOT Demo Data Generator
Generates sample benchmark data for demonstration purposes.

Usage:
  python fetch_nhanes_dr1tot.py
"""

import os
import json
import argparse
from pathlib import Path
from typing import List

# --------------------------- CONFIG ---------------------------

# Age bins for benchmarks
AGE_BINS = [0, 12, 19, 31, 51, 200]
AGE_LABELS = ["<12", "12-18", "19-30", "31-50", "51+"]

# --------------------------- SAMPLE DATA GENERATOR ---------------------------

def generate_sample_benchmarks():
    """Generate realistic sample NHANES benchmark data."""
    
    # Base values for different nutrients (kcal, protein, carb, fat, etc.)
    base_values = {
        "kcal": {"p50": 1800, "p75": 2200, "p90": 2600},
        "protein": {"p50": 70, "p75": 90, "p90": 110},
        "carb": {"p50": 200, "p75": 250, "p90": 300},
        "fat": {"p50": 65, "p75": 85, "p90": 105},
        "sugar": {"p50": 80, "p75": 110, "p90": 140},
        "sodium": {"p50": 3000, "p75": 4000, "p90": 5000},
        "fiber": {"p50": 15, "p75": 22, "p90": 30},
        "cholesterol": {"p50": 250, "p75": 350, "p90": 450}
    }
    
    # Age and sex multipliers
    age_multipliers = {
        "<12": 0.7,
        "12-18": 1.1,
        "19-30": 1.0,
        "31-50": 0.95,
        "51+": 0.85
    }
    
    sex_multipliers = {
        1: 1.1,  # Male
        2: 0.9   # Female
    }
    
    benchmarks = []
    
    for sex in [1, 2]:  # 1=Male, 2=Female
        for age_bin in AGE_LABELS:
            age_mult = age_multipliers[age_bin]
            sex_mult = sex_multipliers[sex]
            
            # Generate sample size
            n = int(1000 * age_mult * sex_mult)
            
            benchmark = {
                "sex": sex,
                "age_bin": age_bin,
                "n": n
            }
            
            # Generate nutrient values
            for nutrient, base in base_values.items():
                for percentile in ["p50", "p75", "p90"]:
                    base_val = base[percentile]
                    adjusted_val = int(base_val * age_mult * sex_mult)
                    benchmark[f"{nutrient}_{percentile}"] = adjusted_val
            
            benchmarks.append(benchmark)
    
    return benchmarks

def main(out_dir: str = "database/seed/nhanes", no_bench: bool = False):
    """Main function to generate sample data."""
    
    out_path = Path(out_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    print(f"Generating sample NHANES data to: {out_path}")
    
    if not no_bench:
        # Generate benchmark data
        benchmarks = generate_sample_benchmarks()
        
        # Save to JSON files
        bench_dir = out_path / "benchmarks"
        bench_dir.mkdir(exist_ok=True)
        
        # Save as single file
        bench_file = bench_dir / "sample_benchmarks.json"
        with open(bench_file, 'w') as f:
            json.dump(benchmarks, f, indent=2)
        
        print(f"✓ Generated {len(benchmarks)} benchmark records")
        print(f"✓ Saved to: {bench_file}")
        
        # Also save individual files for each age group
        for age_bin in AGE_LABELS:
            age_data = [b for b in benchmarks if b["age_bin"] == age_bin]
            age_file = bench_dir / f"benchmarks_{age_bin.replace('-', '_').replace('<', 'lt')}.json"
            with open(age_file, 'w') as f:
                json.dump(age_data, f, indent=2)
            print(f"✓ Age {age_bin}: {len(age_data)} records")
    
    print("Sample NHANES data generation completed!")
    print("\nNext steps:")
    print("1. Run: cd server && npm run seed:nhanes")
    print("2. Test API: curl 'http://localhost:5001/api/nhanes/benchmarks?nutrient=kcal&age=25&sex=1'")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate sample NHANES benchmark data")
    parser.add_argument("--out", default="database/seed/nhanes", help="Output directory")
    parser.add_argument("--no-bench", action="store_true", help="Skip benchmark generation")
    
    args = parser.parse_args()
    main(args.out, args.no_bench)

const express = require('express');
const fetch = require('node-fetch'); // v2 (CommonJS)
const mongoose = require('mongoose');
const router = express.Router();

const COLLECTION = 'food_recalls_cache';
const DEFAULT_TTL_HOURS = 24; // 缓存有效期

async function ensureIndexes(col) {
  try {
    await col.createIndex({ recall_number: 1 }, { unique: true });
  } catch (_) {}
  try {
    // 基于 fetchedAt 的 TTL 索引，过期后自动清理
    await col.createIndex({ fetchedAt: 1 }, { expireAfterSeconds: DEFAULT_TTL_HOURS * 3600 });
  } catch (_) {}
  try {
    // 常用查询组合（可选）
    await col.createIndex({ state: 1, report_date: -1 });
  } catch (_) {}
}

// 统一构建 OpenFDA URL
function buildOpenFdaUrl({ limit = 10, state, since }) {
  const base = 'https://api.fda.gov/food/enforcement.json';
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  const searchParts = [];
  if (state) searchParts.push(`state:\"${String(state)}\"`);
  if (since) searchParts.push(`report_date:[${String(since)}+TO+*]`);
  if (searchParts.length > 0) params.set('search', searchParts.join('+'));
  return `${base}?${params.toString()}`;
}

// GET /api/recalls?limit=10&state=NY&since=20240101
// 策略：优先读缓存，不足再请求 OpenFDA；把结果回写 Mongo（带 TTL）。
router.get('/', async (req, res) => {
  try {
    const { limit = 10, state, since } = req.query;
    const nLimit = Number(limit) || 10;

    const col = mongoose.connection.collection(COLLECTION);
    await ensureIndexes(col);

    // 读缓存
    const cacheQuery = {};
    if (state) cacheQuery.state = String(state);
    if (since) cacheQuery.report_date = { $gte: String(since) };

    const cached = await col
      .find(cacheQuery)
      .sort({ report_date: -1 })
      .limit(nLimit)
      .toArray();

    if (cached.length >= nLimit) {
      const total = await col.countDocuments(cacheQuery).catch(() => cached.length);
      return res.json({ ok: true, count: total, results: cached });
    }

    // 缓存不足 → 请求 OpenFDA
    const url = buildOpenFdaUrl({ limit: nLimit, state, since });
    const r = await fetch(url);
    if (!r.ok) throw new Error(`OpenFDA API error: ${r.status} ${r.statusText}`);
    const data = await r.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    // 回写缓存（upsert by recall_number）
    const now = new Date();
    for (const item of results) {
      if (!item) continue;
      const recallNo = item.recall_number || item.recallNumber; // 尝试兼容字段名
      if (!recallNo) continue;
      await col.updateOne(
        { recall_number: String(recallNo) },
        { $set: { ...item, recall_number: String(recallNo), fetchedAt: now } },
        { upsert: true }
      );
    }

    // 合并结果：优先最新缓存
    const merged = await col
      .find(cacheQuery)
      .sort({ report_date: -1 })
      .limit(nLimit)
      .toArray();

    const total = await col.countDocuments(cacheQuery).catch(() => merged.length);
    return res.json({ ok: true, count: total, results: merged });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;

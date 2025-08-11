const express = require('express');
const fetch = require('node-fetch'); // v2 (CommonJS)
const mongoose = require('mongoose');
const router = express.Router();

const COLLECTION = 'food_recalls_cache';
const DEFAULT_TTL_HOURS = 24; // Cache expiration time in hours

async function ensureIndexes(col) {
  try {
    await col.createIndex({ recall_number: 1 }, { unique: true });
  } catch (_) {}
  try {
    // TTL index based on fetchedAt, auto-cleanup after expiration
    await col.createIndex({ fetchedAt: 1 }, { expireAfterSeconds: DEFAULT_TTL_HOURS * 3600 });
  } catch (_) {}
  try {
    // Common query combinations (optional)
    await col.createIndex({ state: 1, report_date: -1 });
  } catch (_) {}
}

// Build OpenFDA URL uniformly
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

// GET /api/recalls?limit=10&page=1&state=NY&since=20240101
// Strategy: Read cache first, request OpenFDA if insufficient, write results back to Mongo (with TTL).
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, state, since } = req.query;
    const nLimit = Number(limit) || 10;
    const nPage = Number(page) || 1;
    const skip = (nPage - 1) * nLimit;

    const col = mongoose.connection.collection(COLLECTION);
    await ensureIndexes(col);

    // Read from cache
    const cacheQuery = {};
    if (state) cacheQuery.state = String(state);
    if (since) cacheQuery.report_date = { $gte: String(since) };

    const total = await col.countDocuments(cacheQuery).catch(() => 0);
    
    const cached = await col
      .find(cacheQuery)
      .sort({ report_date: -1 })
      .skip(skip)
      .limit(nLimit)
      .toArray();

    // If we have enough cached data for this page, return it
    if (cached.length >= nLimit) {
      return res.json({ ok: true, count: total, results: cached, page: nPage, totalPages: Math.ceil(total / nLimit) });
    }

    // If this is page 1 and we have some data, return what we have
    if (nPage === 1 && cached.length > 0) {
      return res.json({ ok: true, count: total, results: cached, page: nPage, totalPages: Math.ceil(total / nLimit) });
    }

    // Cache insufficient → Request OpenFDA
    const url = buildOpenFdaUrl({ limit: nLimit, state, since });
    const r = await fetch(url);
    if (!r.ok) throw new Error(`OpenFDA API error: ${r.status} ${r.statusText}`);
    const data = await r.json();
    const results = Array.isArray(data?.results) ? data.results : [];

    // Write back to cache (upsert by recall_number)
    const now = new Date();
    for (const item of results) {
      if (!item) continue;
      const recallNo = item.recall_number || item.recallNumber; // Try to handle different field names
      if (!recallNo) continue;
      await col.updateOne(
        { recall_number: String(recallNo) },
        { $set: { ...item, recall_number: String(recallNo), fetchedAt: now } },
        { upsert: true }
      );
    }

    // Merge results: prioritize latest cache
    const merged = await col
      .find(cacheQuery)
      .sort({ report_date: -1 })
      .skip(skip)
      .limit(nLimit)
      .toArray();

    // Update total count after caching new data
    const updatedTotal = await col.countDocuments(cacheQuery).catch(() => total);

    return res.json({ ok: true, count: updatedTotal, results: merged, page: nPage, totalPages: Math.ceil(updatedTotal / nLimit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;

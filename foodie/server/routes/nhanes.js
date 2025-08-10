const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// If you prefer mongoose model:
// const Benchmark = require('../models/NhanesBenchmark');

router.get('/benchmarks', async (req, res) => {
  try {
    const { nutrient = 'sodium', age = '19-30', sex = '0' } = req.query;
    const col = mongoose.connection.collection('nhanes_benchmarks');
    const row = await col.findOne({ age_bin: String(age), sex: Number(sex) });
    if (!row) return res.json({ ok: true, data: null });

    return res.json({
      ok: true,
      data: {
        age_bin: row.age_bin,
        sex: row.sex,
        p50: row[`${nutrient}_p50`],
        p75: row[`${nutrient}_p75`],
        n: row.n,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, message: 'Server error' });
  }
});

module.exports = router;

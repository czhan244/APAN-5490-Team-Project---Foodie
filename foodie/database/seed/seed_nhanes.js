// Seed NHANES benchmarks into MongoDB
// Input JSON files expected under database/seed/nhanes/benchmarks/**/ *.json

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../../server/.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodie';

async function collectFiles(dir) {
  const files = [];
  function walk(p) {
    const entries = fs.readdirSync(p, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(p, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith('.json')) files.push(full);
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return files;
}

async function run() {
  console.log('NHANES seed → connecting Mongo:', MONGO_URI);
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const col = mongoose.connection.collection('nhanes_benchmarks');

  const baseDir = path.join(__dirname, 'nhanes', 'benchmarks');
  const files = await collectFiles(baseDir);
  if (files.length === 0) {
    console.log('No benchmark JSON files found under', baseDir);
    await mongoose.disconnect();
    return;
  }

  let inserted = 0;
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    const json = JSON.parse(raw);
    // json can be array or single object
    const docs = Array.isArray(json) ? json : [json];
    // Upsert by compound keys (sex + age_bin)
    for (const d of docs) {
      await col.updateOne(
        { sex: Number(d.sex), age_bin: String(d.age_bin) },
        { $set: d },
        { upsert: true }
      );
      inserted++;
    }
  }

  console.log(`NHANES seed finished. Upserted ${inserted} docs into nhanes_benchmarks.`);
  await mongoose.disconnect();
}

run().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});

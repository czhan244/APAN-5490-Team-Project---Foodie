const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  sex: Number,
  age_bin: String,
  n: Number,
  kcal_p50: Number, kcal_p75: Number,
  protein_p50: Number, protein_p75: Number,
  carb_p50: Number, carb_p75: Number,
  fat_p50: Number, fat_p75: Number,
  sugar_p50: Number, sugar_p75: Number,
  sodium_p50: Number, sodium_p75: Number,
  fiber_p50: Number, fiber_p75: Number,
  cholesterol_p50: Number, cholesterol_p75: Number
}, { collection: 'nhanes_benchmarks' });

module.exports = mongoose.model('NHANESBenchmark', schema);

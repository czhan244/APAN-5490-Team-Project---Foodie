const express = require('express');
const router = express.Router();
const {
  calculateDailyCalories,
  calculateRecipeNutrition
} = require('../controllers/nutritionCalculatorController');

// Public routes
router.post('/calories', calculateDailyCalories);
router.post('/recipe', calculateRecipeNutrition);

module.exports = router;

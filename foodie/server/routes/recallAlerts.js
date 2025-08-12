const express = require('express');
const router = express.Router();
const {
  getRecipeRecallAlerts,
  getAllRecipesWithAlerts
} = require('../controllers/recallAlertController');

// Public routes
router.get('/recipe/:recipeId', getRecipeRecallAlerts);
router.get('/recipes', getAllRecipesWithAlerts);

module.exports = router;

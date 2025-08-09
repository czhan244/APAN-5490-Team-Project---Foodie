const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// Get all recipes
router.get('/', getRecipes);

// Get one recipe
router.get('/:id', getRecipeById);

// Create recipe (auth required)
router.post('/', protect, createRecipe);

// Update recipe (auth required)
router.put('/:id', protect, updateRecipe);

// Delete recipe (auth required)
router.delete('/:id', protect, deleteRecipe);

// Like/Unlike recipe (auth required)
router.post('/:id/like', protect, likeRecipe);

module.exports = router; 
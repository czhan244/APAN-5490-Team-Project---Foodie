const Recipe = require('../models/Recipe');
const fetch = require('node-fetch');

// @desc    Check for food recalls related to recipe ingredients
// @route   GET /api/recall-alerts/recipe/:recipeId
// @access  Public
const getRecipeRecallAlerts = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Extract ingredient names from recipe
    const ingredientNames = recipe.ingredients.map(ingredient => 
      ingredient.name.toLowerCase().trim()
    );

    // Get recent food recalls from FDA API
    const recallsResponse = await fetch('https://api.fda.gov/food/enforcement.json?limit=100&sort=recall_initiation_date:desc');
    const recallsData = await recallsResponse.json();

    if (!recallsData.results) {
      return res.json({ alerts: [], recipe: recipe.title });
    }

    // Check for matches between ingredients and recalled products
    const alerts = [];
    const checkedIngredients = new Set();

    recallsData.results.forEach(recall => {
      const recallProduct = recall.product_description?.toLowerCase() || '';
      const recallReason = recall.reason_for_recall?.toLowerCase() || '';

      ingredientNames.forEach(ingredientName => {
        if (checkedIngredients.has(ingredientName)) return;

        // Check if ingredient matches recalled product
        if (recallProduct.includes(ingredientName) || 
            ingredientName.includes(recallProduct) ||
            recallReason.includes(ingredientName)) {
          
          alerts.push({
            ingredient: ingredientName,
            recallProduct: recall.product_description,
            reason: recall.reason_for_recall,
            recallDate: recall.recall_initiation_date,
            recallNumber: recall.recall_number,
            company: recall.recalling_firm,
            classification: recall.classification
          });
          
          checkedIngredients.add(ingredientName);
        }
      });
    });

    res.json({
      alerts,
      recipe: recipe.title,
      totalAlerts: alerts.length
    });

  } catch (error) {
    console.error('Recall alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all recipes with potential recall alerts
// @route   GET /api/recall-alerts/recipes
// @access  Public
const getAllRecipesWithAlerts = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).populate('author', 'username');
    
    // Get recent recalls
    const recallsResponse = await fetch('https://api.fda.gov/food/enforcement.json?limit=50&sort=recall_initiation_date:desc');
    const recallsData = await recallsResponse.json();

    if (!recallsData.results) {
      return res.json({ recipes: [] });
    }

    const recipesWithAlerts = [];

    for (const recipe of recipes) {
      const ingredientNames = recipe.ingredients.map(ingredient => 
        ingredient.name.toLowerCase().trim()
      );

      const alerts = [];
      const checkedIngredients = new Set();

      recallsData.results.forEach(recall => {
        const recallProduct = recall.product_description?.toLowerCase() || '';
        const recallReason = recall.reason_for_recall?.toLowerCase() || '';

        ingredientNames.forEach(ingredientName => {
          if (checkedIngredients.has(ingredientName)) return;

          if (recallProduct.includes(ingredientName) || 
              ingredientName.includes(recallProduct) ||
              recallReason.includes(ingredientName)) {
            
            alerts.push({
              ingredient: ingredientName,
              recallProduct: recall.product_description,
              reason: recall.reason_for_recall,
              recallDate: recall.recall_initiation_date,
              recallNumber: recall.recall_number,
              company: recall.recalling_firm,
              classification: recall.classification
            });
            
            checkedIngredients.add(ingredientName);
          }
        });
      });

      if (alerts.length > 0) {
        recipesWithAlerts.push({
          recipe: {
            _id: recipe._id,
            title: recipe.title,
            author: recipe.author,
            cuisine: recipe.cuisine,
            rating: recipe.rating,
            reviewCount: recipe.reviewCount
          },
          alerts,
          alertCount: alerts.length
        });
      }
    }

    res.json({ recipes: recipesWithAlerts });

  } catch (error) {
    console.error('All recipes recall alert error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRecipeRecallAlerts,
  getAllRecipesWithAlerts
};

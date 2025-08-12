// @desc    Calculate daily calorie needs based on user profile
// @route   POST /api/nutrition-calculator/calories
// @access  Public
const calculateDailyCalories = async (req, res) => {
  try {
    const { age, gender, weight, height, activityLevel, goal } = req.body;

    // Validate input
    if (!age || !gender || !weight || !height || !activityLevel) {
      return res.status(400).json({ 
        message: 'Please provide age, gender, weight, height, and activity level' 
      });
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      lightly: 1.375,      // Light exercise 1-3 days/week
      moderately: 1.55,    // Moderate exercise 3-5 days/week
      very: 1.725,         // Hard exercise 6-7 days/week
      extremely: 1.9       // Very hard exercise, physical job
    };

    const tdee = bmr * activityMultipliers[activityLevel] || activityMultipliers.sedentary;

    // Goal adjustments
    let dailyCalories = tdee;
    let goalDescription = 'Maintain weight';

    if (goal === 'lose') {
      dailyCalories = tdee - 500; // 500 calorie deficit for ~1lb/week loss
      goalDescription = 'Lose weight (0.5-1 lb/week)';
    } else if (goal === 'gain') {
      dailyCalories = tdee + 300; // 300 calorie surplus for ~0.5lb/week gain
      goalDescription = 'Gain weight (0.5 lb/week)';
    }

    // Calculate macronutrient breakdown
    const macros = {
      protein: Math.round((dailyCalories * 0.25) / 4), // 25% of calories, 4 cal/g
      carbs: Math.round((dailyCalories * 0.45) / 4),   // 45% of calories, 4 cal/g
      fat: Math.round((dailyCalories * 0.30) / 9)      // 30% of calories, 9 cal/g
    };

    res.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      dailyCalories: Math.round(dailyCalories),
      goalDescription,
      macros,
      breakdown: {
        protein: {
          grams: macros.protein,
          calories: macros.protein * 4,
          percentage: 25
        },
        carbs: {
          grams: macros.carbs,
          calories: macros.carbs * 4,
          percentage: 45
        },
        fat: {
          grams: macros.fat,
          calories: macros.fat * 9,
          percentage: 30
        }
      }
    });

  } catch (error) {
    console.error('Calorie calculation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate recipe nutrition based on ingredients
// @route   POST /api/nutrition-calculator/recipe
// @access  Public
const calculateRecipeNutrition = async (req, res) => {
  try {
    const { ingredients, servings } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || !servings) {
      return res.status(400).json({ 
        message: 'Please provide ingredients array and servings count' 
      });
    }

    // Simple nutrition database (in real app, this would be a comprehensive database)
    const nutritionDB = {
      'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
      'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 72 },
      'salmon': { calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 59 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
      'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.8, sodium: 6 },
      'tomato': { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
      'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7, sugar: 4.7, sodium: 4 },
      'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1, sugar: 1, sodium: 17 },
      'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0, sugar: 0, sodium: 2 },
      'butter': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0, sugar: 0.1, sodium: 643 },
      'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
      'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5, sodium: 44 },
      'cheese': { calories: 402, protein: 25, carbs: 1.3, fat: 33, fiber: 0, sugar: 0.5, sodium: 621 },
      'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491 },
      'lettuce': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.1, fiber: 1.3, sugar: 0.8, sodium: 28 },
      'cucumber': { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2 },
      'carrot': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
      'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6 },
      'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33 },
      'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 }
    };

    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    ingredients.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
      const amount = ingredient.amount;
      
      // Find matching ingredient in database
      let matchedIngredient = null;
      for (const [key, nutrition] of Object.entries(nutritionDB)) {
        if (name.includes(key) || key.includes(name)) {
          matchedIngredient = nutrition;
          break;
        }
      }

      if (matchedIngredient) {
        // Simple estimation: assume 100g per ingredient (in real app, parse amounts properly)
        const multiplier = 1; // This would be calculated based on actual amount
        
        totalNutrition.calories += matchedIngredient.calories * multiplier;
        totalNutrition.protein += matchedIngredient.protein * multiplier;
        totalNutrition.carbs += matchedIngredient.carbs * multiplier;
        totalNutrition.fat += matchedIngredient.fat * multiplier;
        totalNutrition.fiber += matchedIngredient.fiber * multiplier;
        totalNutrition.sugar += matchedIngredient.sugar * multiplier;
        totalNutrition.sodium += matchedIngredient.sodium * multiplier;
      }
    });

    // Calculate per serving
    const perServing = {
      calories: Math.round(totalNutrition.calories / servings),
      protein: Math.round(totalNutrition.protein / servings * 10) / 10,
      carbs: Math.round(totalNutrition.carbs / servings * 10) / 10,
      fat: Math.round(totalNutrition.fat / servings * 10) / 10,
      fiber: Math.round(totalNutrition.fiber / servings * 10) / 10,
      sugar: Math.round(totalNutrition.sugar / servings * 10) / 10,
      sodium: Math.round(totalNutrition.sodium / servings)
    };

    res.json({
      total: totalNutrition,
      perServing,
      servings
    });

  } catch (error) {
    console.error('Recipe nutrition calculation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  calculateDailyCalories,
  calculateRecipeNutrition
};

// MongoDB Sample Data
// Sample data for initializing the database

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@foodie.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    bio: 'Administrator account',
    isAdmin: true
  },
  {
    username: 'user1',
    email: 'user1@foodie.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    bio: 'Regular user account',
    isAdmin: false
  },
  {
    username: 'user2',
    email: 'user2@foodie.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    bio: 'Test user account',
    isAdmin: false
  },
  {
    username: 'user3',
    email: 'user3@foodie.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    bio: 'Food enthusiast and recipe creator',
    isAdmin: false
  }
];

const sampleRecipes = [
  {
    title: 'Classic Beef Burger',
    description: 'A juicy and flavorful beef burger with fresh vegetables and melted cheese',
    ingredients: [
      { name: 'Ground beef', amount: '1 lb' },
      { name: 'Burger buns', amount: '4' },
      { name: 'Lettuce', amount: '1 head' },
      { name: 'Tomato', amount: '2' },
      { name: 'Onion', amount: '1' },
      { name: 'Cheese slices', amount: '4' },
      { name: 'Salt and pepper', amount: 'to taste' }
    ],
    instructions: [
      'Form ground beef into 4 equal patties',
      'Season both sides with salt and pepper',
      'Heat grill or pan over medium-high heat',
      'Cook patties for 4-5 minutes per side',
      'Add cheese during the last minute of cooking',
      'Toast burger buns lightly',
      'Assemble burger with lettuce, tomato, and onion'
    ],
    cookingTime: 20,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'American',
    tags: ['burger', 'beef', 'grill', 'quick'],
    author: 'sample-user-id-1', // Will be replaced with actual user ID
    likes: [],
    rating: 4.5,
    reviewCount: 10
  },
  {
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
    ingredients: [
      { name: 'Spaghetti', amount: '1 lb' },
      { name: 'Pancetta', amount: '8 oz' },
      { name: 'Eggs', amount: '4' },
      { name: 'Parmesan cheese', amount: '1 cup' },
      { name: 'Black pepper', amount: 'to taste' },
      { name: 'Salt', amount: 'to taste' }
    ],
    instructions: [
      'Bring a large pot of salted water to boil',
      'Cook spaghetti according to package directions',
      'Meanwhile, cook pancetta in a large skillet until crispy',
      'In a bowl, whisk together eggs, cheese, and pepper',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to skillet with pancetta',
      'Remove from heat and quickly stir in egg mixture',
      'Add pasta water if needed for creaminess'
    ],
    cookingTime: 25,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    tags: ['pasta', 'italian', 'carbonara', 'eggs'],
    author: 'sample-user-id-2', // Will be replaced with actual user ID
    likes: [],
    rating: 4.2,
    reviewCount: 8
  },
  {
    title: 'Chicken Tacos',
    description: 'Delicious Mexican tacos with seasoned chicken and fresh toppings',
    ingredients: [
      { name: 'Chicken breast', amount: '1 lb' },
      { name: 'Tortillas', amount: '8' },
      { name: 'Onion', amount: '1' },
      { name: 'Bell peppers', amount: '2' },
      { name: 'Lime', amount: '2' },
      { name: 'Cilantro', amount: '1/2 cup' },
      { name: 'Taco seasoning', amount: '1 packet' }
    ],
    instructions: [
      'Cut chicken into small pieces',
      'Season chicken with taco seasoning',
      'Cook chicken in a skillet until fully cooked',
      'Dice onion and bell peppers',
      'Warm tortillas in a dry skillet',
      'Assemble tacos with chicken, vegetables, and cilantro',
      'Serve with lime wedges'
    ],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    tags: ['tacos', 'chicken', 'mexican', 'quick'],
    author: 'sample-user-id-1', // Will be replaced with actual user ID
    likes: [],
    rating: 4.0,
    reviewCount: 5
  },

  // Chinese
  {
    title: 'Kung Pao Chicken',
    description: 'Spicy stir-fry with chicken, peanuts, chilies, and bell peppers',
    ingredients: [
      { name: 'Chicken breast', amount: '1 lb' },
      { name: 'Peanuts', amount: '1/2 cup' },
      { name: 'Bell peppers', amount: '2' },
      { name: 'Dried red chilies', amount: '6-8' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Cornstarch', amount: '1 tbsp' }
    ],
    instructions: [
      'Marinate chicken with soy sauce and cornstarch',
      'Toast peanuts and set aside',
      'Stir-fry aromatics and vegetables',
      'Add chicken and cook through',
      'Return peanuts and toss'
    ],
    cookingTime: 25,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Chinese',
    tags: ['chinese', 'stir-fry', 'spicy'],
    author: 'sample-user-id-2', // Will be replaced with actual user ID
    likes: [],
    rating: 4.6,
    reviewCount: 7
  },

  // Indian
  {
    title: 'Butter Chicken',
    description: 'Creamy tomato-based Indian curry with tender chicken',
    ingredients: [
      { name: 'Chicken thigh', amount: '1 lb' },
      { name: 'Butter', amount: '4 tbsp' },
      { name: 'Tomato puree', amount: '1 cup' },
      { name: 'Cream', amount: '1/2 cup' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Garam masala', amount: '2 tsp' },
      { name: 'Salt', amount: 'to taste' }
    ],
    instructions: [
      'Brown chicken with spices and butter',
      'Add tomato puree and simmer',
      'Finish with cream; adjust seasoning'
    ],
    cookingTime: 40,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Indian',
    tags: ['indian', 'curry', 'butter-chicken'],
    author: 'sample-user-id-1', // Will be replaced with actual user ID
    likes: [],
    rating: 4.7,
    reviewCount: 12
  },

  // French
  {
    title: 'Coq au Vin',
    description: 'Classic French chicken braised with red wine, mushrooms, and bacon',
    ingredients: [
      { name: 'Chicken pieces', amount: '2 lb' },
      { name: 'Bacon', amount: '4 slices' },
      { name: 'Red wine', amount: '2 cups' },
      { name: 'Mushrooms', amount: '8 oz' },
      { name: 'Onion', amount: '1' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Carrots', amount: '2' }
    ],
    instructions: [
      'Cook bacon; brown chicken in drippings',
      'Add vegetables; sauté until soft',
      'Pour in wine; braise until tender'
    ],
    cookingTime: 90,
    servings: 6,
    difficulty: 'Hard',
    cuisine: 'French',
    tags: ['french', 'stew', 'wine'],
    author: 'sample-user-id-3', // Will be replaced with actual user ID
    likes: [],
    rating: 4.8,
    reviewCount: 20
  },

  // Japanese
  {
    title: 'Sushi Rolls',
    description: 'Japanese maki rolls with seasoned rice, nori, and fresh fillings',
    ingredients: [
      { name: 'Sushi rice', amount: '2 cups' },
      { name: 'Nori sheets', amount: '4' },
      { name: 'Fresh fish', amount: '6 oz' },
      { name: 'Cucumber', amount: '1' },
      { name: 'Avocado', amount: '1' },
      { name: 'Soy sauce', amount: 'for dipping' }
    ],
    instructions: [
      'Cook and season sushi rice',
      'Lay nori on rolling mat',
      'Spread rice; add fillings',
      'Roll tightly and slice'
    ],
    cookingTime: 50,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Japanese',
    tags: ['japanese', 'sushi', 'rice'],
    author: 'sample-user-id-2', // Will be replaced with actual user ID
    likes: [],
    rating: 4.9,
    reviewCount: 15
  },

  // Thai
  {
    title: 'Pad Thai',
    description: 'Thai stir-fried rice noodles with shrimp, egg, tamarind and peanuts',
    ingredients: [
      { name: 'Rice noodles', amount: '8 oz' },
      { name: 'Shrimp', amount: '8 oz' },
      { name: 'Eggs', amount: '2' },
      { name: 'Bean sprouts', amount: '2 cups' },
      { name: 'Peanuts', amount: '1/4 cup' },
      { name: 'Tamarind paste', amount: '2 tbsp' },
      { name: 'Fish sauce', amount: '2 tbsp' }
    ],
    instructions: [
      'Soak noodles until pliable',
      'Stir-fry shrimp; add eggs and scramble',
      'Add noodles and sauces; toss',
      'Finish with sprouts and peanuts'
    ],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Thai',
    tags: ['thai', 'noodles', 'stir-fry'],
    author: 'sample-user-id-3', // Will be replaced with actual user ID
    likes: [],
    rating: 4.7,
    reviewCount: 10
  },

  // Greek
  {
    title: 'Greek Salad',
    description: 'Refreshing salad with tomatoes, cucumber, olives, feta and oregano',
    ingredients: [
      { name: 'Tomatoes', amount: '3' },
      { name: 'Cucumber', amount: '1' },
      { name: 'Red onion', amount: '1/2' },
      { name: 'Kalamata olives', amount: '1/2 cup' },
      { name: 'Feta cheese', amount: '3 oz' },
      { name: 'Olive oil', amount: '3 tbsp' },
      { name: 'Dried oregano', amount: '1 tsp' }
    ],
    instructions: [
      'Chop vegetables and combine',
      'Add olives and feta',
      'Dress with olive oil and oregano; season'
    ],
    cookingTime: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Greek',
    tags: ['greek', 'salad', 'vegetarian'],
    author: 'sample-user-id-1', // Will be replaced with actual user ID
    likes: [],
    rating: 4.3,
    reviewCount: 6
  },

  // Japanese (second example)
  {
    title: 'Tonkotsu Ramen',
    description: 'Rich Japanese pork-bone broth ramen with noodles and toppings',
    ingredients: [
      { name: 'Ramen noodles', amount: '4 portions' },
      { name: 'Pork belly (chashu)', amount: '12 oz' },
      { name: 'Soft-boiled eggs', amount: '4' },
      { name: 'Green onions', amount: '2' },
      { name: 'Ramen broth', amount: '6 cups' }
    ],
    instructions: [
      'Heat broth to a simmer',
      'Cook noodles to package directions',
      'Assemble bowls with noodles, broth and toppings'
    ],
    cookingTime: 35,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Japanese',
    tags: ['japanese', 'ramen', 'noodles'],
    author: 'sample-user-id-2', // Will be replaced with actual user ID
    likes: [],
    rating: 4.6,
    reviewCount: 9
  }
];

const sampleComments = [
  {
    content: 'Amazing recipe! Followed the steps exactly and it turned out perfect.',
    rating: 5,
    author: 'sample-user-id-2',
    recipe: 'sample-recipe-id-1',
    likes: []
  },
  {
    content: 'Great recipe, will definitely make it again!',
    rating: 4,
    author: 'sample-user-id-1',
    recipe: 'sample-recipe-id-2',
    likes: []
  },
  {
    content: 'The Kung Pao Chicken was absolutely delicious! Perfect balance of spicy and savory.',
    rating: 5,
    author: 'sample-user-id-1',
    recipe: 'sample-recipe-id-4',
    likes: []
  },
  {
    content: 'Butter Chicken is now my favorite Indian dish. So creamy and flavorful!',
    rating: 5,
    author: 'sample-user-id-3',
    recipe: 'sample-recipe-id-5',
    likes: []
  },
  {
    content: 'Coq au Vin was a bit challenging but totally worth it. The wine flavor is incredible!',
    rating: 4,
    author: 'sample-user-id-2',
    recipe: 'sample-recipe-id-6',
    likes: []
  },
  {
    content: 'Sushi making was fun! The rolls turned out beautiful and tasted amazing.',
    rating: 5,
    author: 'sample-user-id-1',
    recipe: 'sample-recipe-id-7',
    likes: []
  },
  {
    content: 'Pad Thai was perfect! Authentic Thai flavors and easy to follow instructions.',
    rating: 4,
    author: 'sample-user-id-3',
    recipe: 'sample-recipe-id-8',
    likes: []
  },
  {
    content: 'Greek Salad is so refreshing! Perfect for summer days.',
    rating: 4,
    author: 'sample-user-id-2',
    recipe: 'sample-recipe-id-9',
    likes: []
  },
  {
    content: 'Tonkotsu Ramen was incredible! The broth was rich and flavorful.',
    rating: 5,
    author: 'sample-user-id-1',
    recipe: 'sample-recipe-id-10',
    likes: []
  }
];

module.exports = {
  sampleUsers,
  sampleRecipes,
  sampleComments
}; 
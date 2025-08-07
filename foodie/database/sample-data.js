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
  }
];

module.exports = {
  sampleUsers,
  sampleRecipes,
  sampleComments
}; 
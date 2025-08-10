const path = require('path');
const mongoose = require(path.join(__dirname, '../server/node_modules/mongoose'));
const bcrypt = require(path.join(__dirname, '../server/node_modules/bcryptjs'));
const User = require('../server/models/User');
const Recipe = require('../server/models/Recipe');
const Comment = require('../server/models/Comment');
const { sampleUsers, sampleRecipes, sampleComments } = require('./sample-data');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/foodie', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Clear database
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️  Database cleared');
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
  }
};

// Create users
const createUsers = async () => {
  try {
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Failed to create users:', error.message);
    return [];
  }
};

// Create recipes
const createRecipes = async (users) => {
  try {
    const recipesWithAuthors = sampleRecipes.map((recipe, index) => ({
      ...recipe,
      author: users[index % users.length]._id
    }));
    
    const recipes = await Recipe.insertMany(recipesWithAuthors);
    console.log(`✅ Created ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    console.error('❌ Failed to create recipes:', error.message);
    return [];
  }
};

// Create comments
const createComments = async (users, recipes) => {
  try {
    // Create mapping for user IDs
    const userMap = {};
    users.forEach((user, index) => {
      userMap[`sample-user-id-${index + 1}`] = user._id;
    });
    // Add admin user
    userMap['sample-user-id-1'] = users[0]._id; // admin
    userMap['sample-user-id-2'] = users[1]._id; // user1
    userMap['sample-user-id-3'] = users[2]._id; // user2
    userMap['sample-user-id-4'] = users[3]._id; // user3

    // Create mapping for recipe IDs
    const recipeMap = {};
    recipes.forEach((recipe, index) => {
      recipeMap[`sample-recipe-id-${index + 1}`] = recipe._id;
    });

    const commentsWithReferences = sampleComments.map((comment) => ({
      content: comment.content,
      rating: comment.rating,
      author: userMap[comment.author],
      recipe: recipeMap[comment.recipe],
      likes: comment.likes
    }));
    
    const comments = await Comment.insertMany(commentsWithReferences);
    console.log(`✅ Created ${comments.length} comments`);
    return comments;
  } catch (error) {
    console.error('❌ Failed to create comments:', error.message);
    return [];
  }
};

// Main function
const initDatabase = async () => {
  console.log('🚀 Starting database initialization...');
  
  await connectDB();
  await clearDatabase();
  
  const users = await createUsers();
  const recipes = await createRecipes(users);
  await createComments(users, recipes);
  
  console.log('\n📋 Database initialization completed!');
  console.log('\n👥 Available accounts:');
  console.log('  Admin: admin@foodie.com / password');
  console.log('  User1: user1@foodie.com / password');
  console.log('  User2: user2@foodie.com / password');
  console.log('  User3: user3@foodie.com / password');
  console.log('\n🍽️  Sample recipes:');
  console.log('  - Classic Beef Burger');
  console.log('  - Spaghetti Carbonara');
  console.log('  - Chicken Tacos');
  console.log('  - Kung Pao Chicken');
  console.log('  - Butter Chicken');
  console.log('  - Coq au Vin');
  console.log('  - Sushi Rolls');
  console.log('  - Pad Thai');
  console.log('  - Greek Salad');
  console.log('  - Tonkotsu Ramen');
  
  process.exit(0);
};

// Run initialization
initDatabase().catch(console.error);

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

// 获取所有菜谱
router.get('/', getRecipes);

// 获取单个菜谱
router.get('/:id', getRecipeById);

// 创建菜谱 (需要登录)
router.post('/', protect, createRecipe);

// 更新菜谱 (需要登录)
router.put('/:id', protect, updateRecipe);

// 删除菜谱 (需要登录)
router.delete('/:id', protect, deleteRecipe);

// 点赞/取消点赞菜谱 (需要登录)
router.post('/:id/like', protect, likeRecipe);

module.exports = router; 
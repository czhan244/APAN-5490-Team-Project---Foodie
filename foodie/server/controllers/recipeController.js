const Recipe = require('../models/Recipe');

// @desc    获取所有菜谱
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, cuisine, difficulty, search } = req.query;
    
    let query = {};
    
    // 搜索功能
    if (search) {
      query.$text = { $search: search };
    }
    
    // 筛选功能
    if (cuisine) {
      query.cuisine = cuisine;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    const recipes = await Recipe.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Recipe.countDocuments(query);
    
    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('获取菜谱错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    获取单个菜谱
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username');
    
    if (!recipe) {
      return res.status(404).json({ message: '菜谱不存在' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('获取菜谱详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    创建菜谱
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user.id
    });
    
    const savedRecipe = await recipe.save();
    await savedRecipe.populate('author', 'username avatar');
    
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('创建菜谱错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    更新菜谱
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: '菜谱不存在' });
    }
    
    // 检查权限
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({ message: '无权限修改此菜谱' });
    }
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'username avatar');
    
    res.json(updatedRecipe);
  } catch (error) {
    console.error('更新菜谱错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    删除菜谱
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: '菜谱不存在' });
    }
    
    // 检查权限
    if (recipe.author.toString() !== req.user.id) {
      return res.status(401).json({ message: '无权限删除此菜谱' });
    }
    
    await recipe.remove();
    res.json({ message: '菜谱已删除' });
  } catch (error) {
    console.error('删除菜谱错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// @desc    点赞/取消点赞菜谱
// @route   POST /api/recipes/:id/like
// @access  Private
const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: '菜谱不存在' });
    }
    
    const likeIndex = recipe.likes.indexOf(req.user.id);
    
    if (likeIndex > -1) {
      // 取消点赞
      recipe.likes.splice(likeIndex, 1);
    } else {
      // 点赞
      recipe.likes.push(req.user.id);
    }
    
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
}; 
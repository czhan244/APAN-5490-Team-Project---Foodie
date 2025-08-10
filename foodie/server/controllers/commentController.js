const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// @desc    Get comments for a recipe
// @route   GET /api/comments/recipe/:recipeId
// @access  Public
const getCommentsByRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a comment to a recipe
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { recipeId, content, rating } = req.body;

    // Validate input
    if (!content || !rating || !recipeId) {
      return res.status(400).json({ message: 'Please provide content, rating, and recipeId' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Create comment
    const comment = new Comment({
      content,
      rating,
      author: req.user.id,
      recipe: recipeId
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    // Update recipe rating
    const recipeComments = await Comment.find({ recipe: recipeId });
    const avgRating = recipeComments.reduce((sum, c) => sum + c.rating, 0) / recipeComments.length;
    
    await Recipe.findByIdAndUpdate(recipeId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: recipeComments.length
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();

    // Update recipe rating
    const recipeComments = await Comment.find({ recipe: comment.recipe });
    const avgRating = recipeComments.length > 0 
      ? recipeComments.reduce((sum, c) => sum + c.rating, 0) / recipeComments.length 
      : 0;
    
    await Recipe.findByIdAndUpdate(comment.recipe, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: recipeComments.length
    });

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/Unlike a comment
// @route   POST /api/comments/:id/like
// @access  Private
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const likeIndex = comment.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user.id);
    }

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json(comment);
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCommentsByRecipe,
  addComment,
  deleteComment,
  likeComment
};

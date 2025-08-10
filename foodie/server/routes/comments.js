const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCommentsByRecipe,
  addComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');

// Public routes
router.get('/recipe/:recipeId', getCommentsByRecipe);

// Protected routes
router.post('/', protect, addComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

module.exports = router;

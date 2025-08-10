import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState({ content: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const fetchRecipe = useCallback(async () => {
    try {
      const [recipeResponse, commentsResponse] = await Promise.all([
        axios.get(`/api/recipes/${id}`),
        axios.get(`/api/comments/recipe/${id}`)
      ]);
      
      setRecipe(recipeResponse.data);
      setComments(commentsResponse.data);
      
      // Check if current user has liked
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        setIsLiked(recipeResponse.data.likes.includes(user._id));
      }
    } catch (error) {
      setError('The recipe does not exist or has been deleted');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/recipes/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipe(response.data);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like recipe:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!newComment.content.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('/api/comments', {
        recipeId: id,
        content: newComment.content,
        rating: newComment.rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments([response.data, ...comments]);
      setNewComment({ content: '', rating: 5 });
      
      // Refresh recipe to get updated rating
      const recipeResponse = await axios.get(`/api/recipes/${id}`);
      setRecipe(recipeResponse.data);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(comments.filter(comment => comment._id !== commentId));
      
      // Refresh recipe to get updated rating
      const recipeResponse = await axios.get(`/api/recipes/${id}`);
      setRecipe(recipeResponse.data);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`/api/comments/${commentId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="text-center">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-header">
        <div className="recipe-image">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} />
          ) : (
            <div className="placeholder-image">🍽️</div>
          )}
        </div>
        <div className="recipe-info">
          <h1>{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>
          <div className="recipe-meta">
            <span>⏱️ {recipe.cookingTime} min</span>
            <span>👥 {recipe.servings} servings</span>
            <span>📊 {recipe.difficulty}</span>
            <span>🍽️ {recipe.cuisine}</span>
          </div>
          <div className="recipe-author">
            <span>By: {recipe.author?.username || 'Unknown'}</span>
            <span>Published: {new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="recipe-actions">
            <button 
              onClick={handleLike} 
              className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
            >
              {isLiked ? '❤️ Liked' : '🤍 Like'} ({recipe.likes.length})
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="ingredient-name">{ingredient.name}</span>
                <span className="ingredient-amount">{ingredient.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h2>Instructions</h2>
          <ol className="instructions-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="tags-section">
            <h3>Tags</h3>
            <div className="tags">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Reviews & Comments ({comments.length})</h2>
        
        {/* Add Comment Form */}
        <div className="add-comment-form">
          <h3>Add a Review</h3>
          <form onSubmit={handleSubmitComment}>
            <div className="form-group">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={newComment.rating}
                onChange={(e) => setNewComment({...newComment, rating: parseInt(e.target.value)})}
                required
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="content">Comment:</label>
              <textarea
                id="content"
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                placeholder="Share your thoughts about this recipe..."
                required
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No reviews yet. Be the first to review this recipe!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-author">
                    <span className="author-name">{comment.author?.username || 'Unknown'}</span>
                    <span className="comment-rating">
                      {'⭐'.repeat(comment.rating)}
                    </span>
                  </div>
                  <div className="comment-meta">
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {comment.author?._id === JSON.parse(localStorage.getItem('user') || '{}')._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="btn-delete"
                        title="Delete comment"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
                <div className="comment-actions">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className={`btn-like ${comment.likes.includes(JSON.parse(localStorage.getItem('user') || '{}')._id) ? 'liked' : ''}`}
                  >
                    {comment.likes.includes(JSON.parse(localStorage.getItem('user') || '{}')._id) ? '❤️' : '🤍'} 
                    {comment.likes.length}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail; 
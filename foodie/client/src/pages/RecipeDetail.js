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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [recallAlerts, setRecallAlerts] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [showNutrition, setShowNutrition] = useState(false);

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

      // Fetch recall alerts
      try {
        const alertsResponse = await axios.get(`/api/recall-alerts/recipe/${id}`);
        setRecallAlerts(alertsResponse.data.alerts || []);
      } catch (error) {
        console.error('Failed to fetch recall alerts:', error);
      }

      // Calculate nutrition info
      try {
        const nutritionResponse = await axios.post('/api/nutrition-calculator/recipe', {
          ingredients: recipeResponse.data.ingredients,
          servings: recipeResponse.data.servings
        });
        setNutritionInfo(nutritionResponse.data);
      } catch (error) {
        console.error('Failed to calculate nutrition:', error);
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

  const handleDeleteRecipe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Redirect to home page after successful deletion
      navigate('/', { state: { message: 'Recipe deleted successfully' } });
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      setError('Failed to delete recipe. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
    return <div className="loading">Loading recipe...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
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
            <span className="meta-item">⏱️ {recipe.cookingTime} min</span>
            <span className="meta-item">👥 {recipe.servings} servings</span>
            <span className="meta-item">📊 {recipe.difficulty}</span>
            <span className="meta-item">🌍 {recipe.cuisine}</span>
          </div>

          <div className="recipe-rating">
            <span className="stars">{'⭐'.repeat(Math.round(recipe.rating))}</span>
            <span className="rating-text">{recipe.rating} ({recipe.reviewCount} reviews)</span>
          </div>

          <div className="recipe-author">
            By {recipe.author?.username || 'Unknown'}
          </div>

          <div className="recipe-actions">
            <button 
              onClick={handleLike} 
              className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
            >
              {isLiked ? '❤️ Liked' : '🤍 Like'} ({recipe.likes.length})
            </button>
            
            {/* Delete button - only show for recipe author */}
            {recipe.author?._id === JSON.parse(localStorage.getItem('user') || '{}')._id && (
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="btn btn-danger"
                style={{ marginLeft: '10px' }}
              >
                🗑️ Delete Recipe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recall Alerts Section */}
      {recallAlerts.length > 0 && (
        <div className="recall-alerts-section">
          <h2>⚠️ Food Safety Alert</h2>
          <div className="alerts-container">
            {recallAlerts.map((alert, index) => (
              <div key={index} className="alert-card">
                <div className="alert-header">
                  <span className="alert-icon">🚨</span>
                  <span className="alert-ingredient">{alert.ingredient}</span>
                </div>
                <div className="alert-details">
                  <p><strong>Product:</strong> {alert.recallProduct}</p>
                  <p><strong>Reason:</strong> {alert.reason}</p>
                  <p><strong>Company:</strong> {alert.company}</p>
                  <p><strong>Date:</strong> {new Date(alert.recallDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Information */}
      {nutritionInfo && (
        <div className="nutrition-section">
          <h2>Nutrition Information</h2>
          <button 
            onClick={() => setShowNutrition(!showNutrition)}
            className="btn btn-secondary"
          >
            {showNutrition ? 'Hide' : 'Show'} Nutrition Details
          </button>
          
          {showNutrition && (
            <div className="nutrition-details">
              <div className="nutrition-summary">
                <div className="nutrition-item">
                  <span className="nutrition-label">Calories per serving:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.calories} cal</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbohydrates:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.carbs}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.fat}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fiber:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.fiber}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Sugar:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.sugar}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Sodium:</span>
                  <span className="nutrition-value">{nutritionInfo.perServing.sodium}mg</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Recipe</h3>
            <p>Are you sure you want to delete "{recipe.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRecipe} 
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Recipe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail; 
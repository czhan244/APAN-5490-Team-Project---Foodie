import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const fetchRecipe = useCallback(async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
      
      // 检查当前用户是否已点赞
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        setIsLiked(response.data.likes.includes(user._id));
      }
    } catch (error) {
      setError('菜谱不存在或已被删除');
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
      console.error('点赞失败:', error);
    }
  };

  if (loading) {
    return <div className="text-center">加载中...</div>;
  }

  if (error) {
    return <div className="text-center error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="text-center">菜谱不存在</div>;
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
            <span>⏱️ {recipe.cookingTime}分钟</span>
            <span>👥 {recipe.servings}人份</span>
            <span>📊 {recipe.difficulty}</span>
            <span>🍽️ {recipe.cuisine}</span>
          </div>
          <div className="recipe-author">
            <span>作者: {recipe.author?.username || '未知'}</span>
            <span>发布时间: {new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="recipe-actions">
            <button 
              onClick={handleLike} 
              className={`btn ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
            >
              {isLiked ? '❤️ 已点赞' : '🤍 点赞'} ({recipe.likes.length})
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2>食材</h2>
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
          <h2>制作步骤</h2>
          <ol className="instructions-list">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="tags-section">
            <h3>标签</h3>
            <div className="tags">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail; 
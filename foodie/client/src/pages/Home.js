import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const hasLoaded = useRef(false);
  const fetchRecipes = async (search = searchTerm, cuisineFilter = cuisine, difficultyFilter = difficulty) => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (cuisineFilter) params.cuisine = cuisineFilter;
      if (difficultyFilter) params.difficulty = difficultyFilter;

      const response = await axios.get('/api/recipes', { params });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoaded.current) {
      fetchRecipes();
      hasLoaded.current = true;
    }
    
    // Check for success message from navigation state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(searchTerm, cuisine, difficulty);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="home">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="hero">
        <h1>Discover Delicious Recipes</h1>
        <p>Explore amazing recipes from around the world</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
                      <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cuisines</option>
              <option value="American">American</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Indian">Indian</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Greek">Greek</option>
              <option value="Spanish">Spanish</option>
              <option value="Korean">Korean</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="African">African</option>
              <option value="Caribbean">Caribbean</option>
              <option value="Latin American">Latin American</option>
              <option value="Fusion">Fusion</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe-card">
            <div className="recipe-image">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} />
              ) : (
                <div className="placeholder-image">🍽️</div>
              )}
            </div>
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              
              {/* Rating Display */}
              <div className="recipe-rating">
                <div className="stars">
                  {recipe.rating > 0 ? (
                    <>
                      <span className="star-filled">{'⭐'.repeat(Math.floor(recipe.rating))}</span>
                      {recipe.rating % 1 !== 0 && <span className="star-half">⭐</span>}
                      <span className="star-empty">{'⭐'.repeat(5 - Math.ceil(recipe.rating))}</span>
                    </>
                  ) : (
                    <span className="no-rating">No ratings yet</span>
                  )}
                </div>
                <div className="rating-info">
                  {recipe.rating > 0 ? (
                    <>
                      <span className="rating-score">{recipe.rating.toFixed(1)}</span>
                      <span className="rating-count">({recipe.reviewCount} reviews)</span>
                    </>
                  ) : (
                    <span className="rating-count">Be the first to rate!</span>
                  )}
                </div>
              </div>
              
              <div className="recipe-meta">
                <span>⏱️ {recipe.cookingTime} min</span>
                <span>👥 {recipe.servings} servings</span>
                <span>📊 {recipe.difficulty}</span>
              </div>
              <div className="recipe-author">
                By: {recipe.author?.username || 'Unknown'}
              </div>
              <Link to={`/recipe/${recipe._id}`} className="btn btn-primary">
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && !loading && (
        <div className="text-center">
          <p>No recipes found</p>
        </div>
      )}
    </div>
  );
};

export default Home; 
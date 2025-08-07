import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const fetchRecipes = useCallback(async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (cuisine) params.cuisine = cuisine;
      if (difficulty) params.difficulty = difficulty;

      const response = await axios.get('/api/recipes', { params });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, cuisine, difficulty]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="home">
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
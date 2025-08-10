import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';
import FoodRecalls from './pages/FoodRecalls';
import NutritionBenchmarks from './pages/NutritionBenchmarks';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/food-recalls" element={<FoodRecalls />} />
            <Route path="/nutrition-benchmarks" element={<NutritionBenchmarks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
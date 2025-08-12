import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NutritionBenchmarks.css';

const NutritionBenchmarks = () => {
  const [activeTab, setActiveTab] = useState('benchmarks'); // 'benchmarks' or 'calculator'
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    nutrient: 'kcal',
    age: '19-30',
    sex: '1'
  });

  // Calculator state
  const [calculatorForm, setCalculatorForm] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [calculatorLoading, setCalculatorLoading] = useState(false);
  const [calculatorError, setCalculatorError] = useState('');

  const nutrients = [
    { value: 'kcal', label: 'Calories (kcal)', unit: 'kcal' },
    { value: 'protein', label: 'Protein', unit: 'g' },
    { value: 'carb', label: 'Carbohydrates', unit: 'g' },
    { value: 'fat', label: 'Total Fat', unit: 'g' },
    { value: 'sugar', label: 'Sugar', unit: 'g' },
    { value: 'sodium', label: 'Sodium', unit: 'mg' },
    { value: 'fiber', label: 'Fiber', unit: 'g' },
    { value: 'cholesterol', label: 'Cholesterol', unit: 'mg' }
  ];

  const ageGroups = [
    { value: '<12', label: 'Under 12 years' },
    { value: '12-18', label: '12-18 years' },
    { value: '19-30', label: '19-30 years' },
    { value: '31-50', label: '31-50 years' },
    { value: '51+', label: '51+ years' }
  ];

  const sexes = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' }
  ];

  const fetchBenchmark = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        nutrient: filters.nutrient,
        age: filters.age,
        sex: filters.sex
      });

      const response = await axios.get(`/api/nhanes/benchmarks?${params.toString()}`);
      setBenchmark(response.data.data);
    } catch (err) {
      setError('Failed to fetch nutrition benchmark data');
      console.error('Error fetching benchmark:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'benchmarks') {
      fetchBenchmark();
    }
  }, [fetchBenchmark, activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculatorSubmit = async (e) => {
    e.preventDefault();
    setCalculatorLoading(true);
    setCalculatorError('');
    setCalculatorResult(null);

    try {
      const response = await axios.post('/api/nutrition-calculator/calories', calculatorForm);
      setCalculatorResult(response.data);
    } catch (error) {
      setCalculatorError(error.response?.data?.message || 'Failed to calculate calories');
    } finally {
      setCalculatorLoading(false);
    }
  };

  const getCurrentNutrient = () => {
    return nutrients.find(n => n.value === filters.nutrient);
  };

  const getNutrientColor = (nutrient) => {
    const colors = {
      kcal: '#ff6b6b',
      protein: '#4ecdc4',
      carb: '#45b7d1',
      fat: '#96ceb4',
      sugar: '#feca57',
      sodium: '#ff9ff3',
      fiber: '#54a0ff',
      cholesterol: '#5f27cd'
    };
    return colors[nutrient] || '#6c757d';
  };

  return (
    <div className="nutrition-benchmarks">
      <div className="benchmarks-header">
        <h1>Nutrition & Health</h1>
        <p>NHANES benchmarks and personalized nutrition calculator</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'benchmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmarks')}
        >
          📊 Nutrition Benchmarks
        </button>
        <button 
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          🧮 Calorie Calculator
        </button>
      </div>

      {/* Benchmarks Tab */}
      {activeTab === 'benchmarks' && (
        <div className="tab-content">
          <div className="benchmarks-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Nutrient:</label>
                <select name="nutrient" value={filters.nutrient} onChange={handleFilterChange}>
                  {nutrients.map(nutrient => (
                    <option key={nutrient.value} value={nutrient.value}>
                      {nutrient.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Age Group:</label>
                <select name="age" value={filters.age} onChange={handleFilterChange}>
                  {ageGroups.map(age => (
                    <option key={age.value} value={age.value}>
                      {age.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Gender:</label>
                <select name="sex" value={filters.sex} onChange={handleFilterChange}>
                  {sexes.map(sex => (
                    <option key={sex.value} value={sex.value}>
                      {sex.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="benchmark-display">
            {loading ? (
              <div className="loading">Loading nutrition data...</div>
            ) : benchmark ? (
              <div className="benchmark-card">
                <div className="benchmark-header">
                  <h2>
                    {getCurrentNutrient()?.label} - {sexes.find(s => s.value === filters.sex)?.label}, {ageGroups.find(a => a.value === filters.age)?.label}
                  </h2>
                  <div 
                    className="nutrient-icon"
                    style={{ backgroundColor: getNutrientColor(filters.nutrient) }}
                  >
                    {filters.nutrient.toUpperCase()}
                  </div>
                </div>

                <div className="benchmark-stats">
                  <div className="stat-item">
                    <div className="stat-value">{benchmark.p50}</div>
                    <div className="stat-label">50th Percentile</div>
                    <div className="stat-unit">{getCurrentNutrient()?.unit}</div>
                  </div>
                  
                  <div className="stat-item">
                    <div className="stat-value">{benchmark.p75}</div>
                    <div className="stat-label">75th Percentile</div>
                    <div className="stat-unit">{getCurrentNutrient()?.unit}</div>
                  </div>
                </div>

                <div className="benchmark-info">
                  <div className="info-item">
                    <strong>Sample Size:</strong> {benchmark.n.toLocaleString()} participants
                  </div>
                  <div className="info-item">
                    <strong>Age Group:</strong> {benchmark.age_bin}
                  </div>
                  <div className="info-item">
                    <strong>Gender:</strong> {sexes.find(s => s.value === benchmark.sex.toString())?.label}
                  </div>
                </div>

                <div className="benchmark-description">
                  <h3>What this means:</h3>
                  <p>
                    The {getCurrentNutrient()?.label.toLowerCase()} data shows the typical intake levels for {ageGroups.find(a => a.value === benchmark.age_bin)?.label.toLowerCase()} {sexes.find(s => s.value === benchmark.sex.toString())?.label.toLowerCase()}. 
                    The 50th percentile represents the median intake, while the 75th percentile shows the intake level that 75% of people in this group consume less than.
                  </p>
                </div>
              </div>
            ) : (
              <div className="no-data">
                <p>No benchmark data available for the selected criteria.</p>
              </div>
            )}
          </div>

          <div className="benchmarks-info">
            <h3>About NHANES Data</h3>
            <p>
              The National Health and Nutrition Examination Survey (NHANES) provides nationally representative 
              data on dietary intake patterns. These benchmarks help understand typical nutrient consumption 
              across different demographic groups and can guide nutrition planning and health recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="tab-content">
          <div className="calculator-grid">
            <div className="calculator-form-container">
              <h2>Personalized Calorie Calculator</h2>
              <p className="calculator-description">
                Calculate your daily calorie needs and macronutrient breakdown based on your personal information.
              </p>
              
              <form className="calculator-form" onSubmit={handleCalculatorSubmit}>
                <div className="form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={calculatorForm.age}
                    onChange={handleCalculatorChange}
                    required
                    min="13"
                    max="120"
                    placeholder="Enter your age"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={calculatorForm.gender}
                    onChange={handleCalculatorChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg) *</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={calculatorForm.weight}
                    onChange={handleCalculatorChange}
                    required
                    min="30"
                    max="300"
                    step="0.1"
                    placeholder="Enter your weight in kg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Height (cm) *</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={calculatorForm.height}
                    onChange={handleCalculatorChange}
                    required
                    min="100"
                    max="250"
                    placeholder="Enter your height in cm"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="activityLevel">Activity Level *</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={calculatorForm.activityLevel}
                    onChange={handleCalculatorChange}
                    required
                  >
                    <option value="sedentary">Sedentary (Little or no exercise)</option>
                    <option value="lightly">Lightly Active (Light exercise 1-3 days/week)</option>
                    <option value="moderately">Moderately Active (Moderate exercise 3-5 days/week)</option>
                    <option value="very">Very Active (Hard exercise 6-7 days/week)</option>
                    <option value="extremely">Extremely Active (Very hard exercise, physical job)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="goal">Goal *</label>
                  <select
                    id="goal"
                    name="goal"
                    value={calculatorForm.goal}
                    onChange={handleCalculatorChange}
                    required
                  >
                    <option value="maintain">Maintain Weight</option>
                    <option value="lose">Lose Weight</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>

                {calculatorError && <div className="error-message">{calculatorError}</div>}

                <button 
                  type="submit" 
                  className="calculate-btn" 
                  disabled={calculatorLoading}
                >
                  {calculatorLoading ? 'Calculating...' : 'Calculate Daily Calories'}
                </button>
              </form>
            </div>

            {calculatorResult && (
              <div className="results-container">
                <h2>Your Daily Nutrition Plan</h2>
                
                <div className="result-summary">
                  <div className="result-item">
                    <span className="result-label">Daily Calories:</span>
                    <span className="result-value">{calculatorResult.dailyCalories} cal</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Goal:</span>
                    <span className="result-value">{calculatorResult.goalDescription}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">BMR:</span>
                    <span className="result-value">{calculatorResult.bmr} cal</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">TDEE:</span>
                    <span className="result-value">{calculatorResult.tdee} cal</span>
                  </div>
                </div>

                <div className="macros-breakdown">
                  <h3>Macronutrient Breakdown</h3>
                  <div className="macros-grid">
                    <div className="macro-card protein">
                      <div className="macro-header">
                        <span className="macro-icon">🥩</span>
                        <span className="macro-name">Protein</span>
                      </div>
                      <div className="macro-amount">{calculatorResult.macros.protein}g</div>
                      <div className="macro-calories">{calculatorResult.breakdown.protein.calories} cal</div>
                      <div className="macro-percentage">{calculatorResult.breakdown.protein.percentage}%</div>
                    </div>

                    <div className="macro-card carbs">
                      <div className="macro-header">
                        <span className="macro-icon">🍞</span>
                        <span className="macro-name">Carbohydrates</span>
                      </div>
                      <div className="macro-amount">{calculatorResult.macros.carbs}g</div>
                      <div className="macro-calories">{calculatorResult.breakdown.carbs.calories} cal</div>
                      <div className="macro-percentage">{calculatorResult.breakdown.carbs.percentage}%</div>
                    </div>

                    <div className="macro-card fat">
                      <div className="macro-header">
                        <span className="macro-icon">🥑</span>
                        <span className="macro-name">Fat</span>
                      </div>
                      <div className="macro-amount">{calculatorResult.macros.fat}g</div>
                      <div className="macro-calories">{calculatorResult.breakdown.fat.calories} cal</div>
                      <div className="macro-percentage">{calculatorResult.breakdown.fat.percentage}%</div>
                    </div>
                  </div>
                </div>

                <div className="nutrition-tips">
                  <h3>💡 Tips for Success</h3>
                  <ul>
                    <li>Track your food intake to stay within your calorie goal</li>
                    <li>Prioritize protein to support muscle maintenance</li>
                    <li>Include a variety of whole foods in your diet</li>
                    <li>Stay hydrated by drinking plenty of water</li>
                    <li>Be consistent with your eating habits</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="calculator-info">
            <h2>How It Works</h2>
            <div className="info-grid">
              <div className="info-card">
                <h3>BMR Calculation</h3>
                <p>We use the Mifflin-St Jeor Equation to calculate your Basal Metabolic Rate (BMR), which represents the calories your body needs at rest.</p>
              </div>
              <div className="info-card">
                <h3>Activity Multiplier</h3>
                <p>Your BMR is multiplied by an activity factor based on your daily physical activity level to determine your Total Daily Energy Expenditure (TDEE).</p>
              </div>
              <div className="info-card">
                <h3>Goal Adjustment</h3>
                <p>We adjust your daily calories based on your goal: maintain weight (no change), lose weight (calorie deficit), or gain weight (calorie surplus).</p>
              </div>
              <div className="info-card">
                <h3>Macronutrient Split</h3>
                <p>We recommend a balanced macronutrient distribution: 25% protein, 45% carbohydrates, and 30% fat for optimal health and performance.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionBenchmarks;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NutritionBenchmarks.css';

const NutritionBenchmarks = () => {
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    nutrient: 'kcal',
    age: '19-30',
    sex: '1'
  });

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
    fetchBenchmark();
  }, [fetchBenchmark]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
        <h1>Nutrition Benchmarks</h1>
        <p>NHANES dietary intake reference data by age and gender</p>
      </div>

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
  );
};

export default NutritionBenchmarks;

import React, { useState, useEffect } from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Search: React.FC = () => {
  const { recipes, searchRecipes } = useRecipes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Categories for filtering
  const categories = ['All', 'Asian', 'Italian', 'Mexican', 'Vegetarian', 'Desserts', 'Quick Meals', 'Healthy', 'Breakfast'];
  
  // Difficulty levels for filtering
  const difficultyLevels = ['All', 'Easy', 'Medium', 'Hard'];
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  // Time ranges for filtering
  const timeRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Under 15 min', min: 0, max: 15 },
    { label: '15-30 min', min: 15, max: 30 },
    { label: '30-60 min', min: 30, max: 60 },
    { label: 'Over 60 min', min: 60, max: Infinity }
  ];
  const [selectedTimeRange, setSelectedTimeRange] = useState('All');

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams();
  };

  // Update search parameters in URL
  const updateSearchParams = () => {
    const params: Record<string, string> = {};
    
    if (searchQuery) params.q = searchQuery;
    if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedDifficulty && selectedDifficulty !== 'All') params.difficulty = selectedDifficulty;
    if (selectedTimeRange && selectedTimeRange !== 'All') params.time = selectedTimeRange;
    
    setSearchParams(params);
  };

  // Filter recipes based on search query and filters
  useEffect(() => {
    let results = searchQuery ? searchRecipes(searchQuery) : recipes;
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter(recipe => recipe.cuisine === selectedCategory);
    }
    
    // Apply difficulty filter
    if (selectedDifficulty && selectedDifficulty !== 'All') {
      results = results.filter(recipe => recipe.difficulty === selectedDifficulty);
    }
    
    // Apply time filter
    if (selectedTimeRange && selectedTimeRange !== 'All') {
      const timeRange = timeRanges.find(range => range.label === selectedTimeRange);
      if (timeRange) {
        results = results.filter(recipe => 
          recipe.time >= timeRange.min && recipe.time <= timeRange.max
        );
      }
    }
    
    setFilteredRecipes(results);
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedTimeRange, recipes, searchRecipes]);

  // Initialize filters from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const categoryParam = searchParams.get('category');
    const difficultyParam = searchParams.get('difficulty');
    const timeParam = searchParams.get('time');
    
    if (queryParam) setSearchQuery(queryParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (difficultyParam) setSelectedDifficulty(difficultyParam);
    if (timeParam) setSelectedTimeRange(timeParam);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Find Recipes</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Search
        </button>
      </form>
      
      {/* Filters */}
      {isFilterOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      updateSearchParams();
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedDifficulty(level);
                      updateSearchParams();
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedDifficulty === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Filter */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Time</h3>
              <div className="flex flex-wrap gap-2">
                {timeRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedTimeRange(range.label);
                      updateSearchParams();
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTimeRange === range.label
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Recipe' : 'Recipes'} Found
          </h2>
        </div>
        
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

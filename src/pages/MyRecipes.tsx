import React, { useState } from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, X } from 'lucide-react';

const MyRecipes: React.FC = () => {
  const { userRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  
  // Get unique cuisines from user recipes
  const cuisines = ['All', ...Array.from(new Set(userRecipes.map(recipe => recipe.cuisine)))];
  
  // Difficulty levels for filtering
  const difficultyLevels = ['All', 'Easy', 'Medium', 'Hard'];
  
  // Filter recipes based on search query and filters
  const filteredRecipes = userRecipes.filter(recipe => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    
    // Cuisine filter
    const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine;
    
    return matchesSearch && matchesDifficulty && matchesCuisine;
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCuisine('All');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
        <Link 
          to="/create" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Recipe
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your recipes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="text-gray-400 w-5 h-5" />
            
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
            >
              <option value="" disabled>Difficulty</option>
              {difficultyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            
            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-sm"
            >
              <option value="" disabled>Cuisine</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            
            {/* Clear Filters */}
            {(searchQuery || selectedDifficulty !== 'All' || selectedCuisine !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Recipe List */}
      <div>
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            {userRecipes.length > 0 ? (
              <>
                <p className="text-gray-500 text-lg mb-2">No recipes match your filters</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg mb-4">You haven't created any recipes yet</p>
                <Link 
                  to="/create" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create Your First Recipe
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;

import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';
import { ChefHat, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { recipes } = useRecipes();
  
  // Get featured recipes (just a subset of all recipes for the homepage)
  const featuredRecipes = recipes.slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <ChefHat className="w-16 h-16 mx-auto text-white/90" />
          <h1 className="text-4xl font-bold">Smart Recipe Builder</h1>
          <p className="text-xl text-white/90">
            Discover, create, and share amazing recipes with our smart recipe builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              to="/search" 
              className="flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Search className="w-5 h-5" />
              Find Recipes
            </Link>
            <Link 
              to="/create" 
              className="flex items-center justify-center gap-2 bg-blue-600 text-white border border-white/20 px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Create Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Recipes</h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Asian', 'Italian', 'Mexican', 'Vegetarian', 'Desserts', 'Quick Meals', 'Healthy', 'Breakfast'].map((category) => (
            <Link 
              key={category}
              to={`/search?category=${category}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-800">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

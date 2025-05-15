import React, { useState } from 'react';
import { Clock, Users, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { useRecipes } from '../contexts/RecipeContext';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toggleFavorite } = useRecipes();

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the expand button
    setIsExpanded(!isExpanded);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
    >
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full ${recipe.isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'} hover:bg-red-500 hover:text-white transition-colors`}
        >
          <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-white' : ''}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex space-x-2">
            {recipe.tags && recipe.tags.length > 0 && recipe.tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title}</h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {recipe.cuisine}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Clock className="w-4 h-4 mr-1" />
          <span>{recipe.time} mins</span>
          <span className="mx-2">•</span>
          <Users className="w-4 h-4 mr-1" />
          <span>Serves {recipe.servings}</span>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-2">Ingredients</h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              {recipe.ingredients.slice(0, 4).map((ingredient) => (
                <li key={ingredient.id} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {ingredient.amount} {ingredient.unit && ingredient.unit + ' of'} {ingredient.name}
                </li>
              ))}
              {recipe.ingredients.length > 4 && (
                <li className="text-blue-600 font-medium">+ {recipe.ingredients.length - 4} more</li>
              )}
            </ul>

            <h4 className="font-medium text-gray-800 mb-2">Steps</h4>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside mb-2">
              {recipe.steps.slice(0, 2).map((step) => (
                <li key={step.id} className="pl-1">
                  {step.description}
                </li>
              ))}
              {recipe.steps.length > 2 && (
                <li className="text-blue-600 font-medium">+ {recipe.steps.length - 2} more steps</li>
              )}
            </ol>

            <Link to={`/recipe/${recipe.id}`} className="block w-full text-center text-blue-600 font-medium mt-3">
              View Full Recipe
            </Link>
          </div>
        </div>

        <button
          className="flex items-center justify-center w-full text-blue-600 mt-3"
          onClick={toggleExpand}
          type="button"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-5 h-5 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5 mr-1" /> Show More
            </>
          )}
        </button>
      </div>
    </Link>
  );
};

export default RecipeCard;
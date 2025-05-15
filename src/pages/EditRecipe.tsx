import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import { Clock, Users, ChefHat, Save, Trash, Plus, Minus, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    recipes,
    currentRecipe,
    setCurrentRecipe,
    updateServings,
    saveRecipeToJSON,
    updateIngredient,
    addIngredient,
    removeIngredient,
    addStep,
    updateStep,
    removeStep,
    updateRecipeField,
    updateTags,
    saveRecipe
  } = useRecipes();

  const [fileInputRef] = useState<React.RefObject<HTMLInputElement>>(React.createRef());

  // Load the recipe when the component mounts or the ID changes
  useEffect(() => {
    if (id) {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        setCurrentRecipe(recipe);
      } else {
        navigate('/');
        toast.error('Recipe not found');
      }
    }

    // Clean up when component unmounts
    return () => {
      setCurrentRecipe(null);
    };
  }, [id, recipes, setCurrentRecipe, navigate]);

  if (!currentRecipe) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleServingsChange = (change: number) => {
    const newServings = Math.max(1, currentRecipe.currentServings + change);
    updateServings(newServings);
  };

  const handleIngredientChange = (id: string, field: 'name' | 'amount' | 'unit', value: string) => {
    updateIngredient(id, { [field]: value });
  };

  const handleStepChange = (id: string, value: string) => {
    updateStep(id, value);
  };

  // Debug function to log the current recipe state
  const logRecipeState = () => {
    console.log("Current Recipe State:", currentRecipe);
    console.log("Recipes in Context:", recipes);
    console.log("Recipe in Recipes Array:", recipes.find(r => r.id === id));
  };

  const handleSave = () => {
    // Save the recipe
    const success = saveRecipe();

    if (success) {
      // Show success message
      toast.success('Recipe updated successfully!', {
        id: 'recipe-save-toast',
        duration: 2000
      });

      // Navigate back to My Recipes
      navigate('/my-recipes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button and save button */}
      <div className="flex justify-between items-center mb-6">
        <Link to={`/recipe/${id}`} className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Recipe
        </Link>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>

      {/* Recipe Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Title
        </label>
        <input
          id="title"
          type="text"
          value={currentRecipe.title}
          onChange={(e) => updateRecipeField('title', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-xl font-bold"
          placeholder="Recipe Title"
        />
      </div>

      {/* Recipe Image */}
      <div className="relative rounded-xl overflow-hidden mb-6 h-64">
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-4">
          <input
            type="text"
            value={currentRecipe.image}
            onChange={(e) => updateRecipeField('image', e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-200"
            placeholder="Image URL"
          />
        </div>
        <img
          src={currentRecipe.image}
          alt={currentRecipe.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
            Cooking Time (minutes)
          </label>
          <input
            id="time"
            type="number"
            value={currentRecipe.time}
            onChange={(e) => updateRecipeField('time', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200"
            min="1"
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={currentRecipe.difficulty}
            onChange={(e) => updateRecipeField('difficulty', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
            Cuisine
          </label>
          <input
            id="cuisine"
            type="text"
            value={currentRecipe.cuisine}
            onChange={(e) => updateRecipeField('cuisine', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200"
            placeholder="e.g. Italian, Mexican, Asian"
          />
        </div>
      </div>

      {/* Recipe Description */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={currentRecipe.description}
          onChange={(e) => updateRecipeField('description', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200"
          rows={4}
          placeholder="Recipe description"
        />
      </div>

      {/* Servings Control */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-700 font-medium">Servings</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleServingsChange(-1)}
              disabled={currentRecipe.currentServings <= 1}
              className="p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="text-gray-800 font-medium w-8 text-center">
              {currentRecipe.currentServings}
            </span>

            <button
              onClick={() => handleServingsChange(1)}
              className="p-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Ingredients</h2>
          <button
            onClick={() => {
              addIngredient();
              // Force re-render to show the new ingredient
              setTimeout(() => {
                logRecipeState();
              }, 100);
            }}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Ingredient
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ul className="space-y-2">
            {currentRecipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="flex items-center justify-between">
                <div className="flex-grow grid grid-cols-3 gap-2">
                  <input
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'amount', e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded"
                    placeholder="Amount"
                  />
                  <input
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'unit', e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded"
                    placeholder="Unit"
                  />
                  <input
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded"
                    placeholder="Ingredient"
                  />
                </div>

                <button
                  onClick={() => {
                    removeIngredient(ingredient.id);
                    // Force re-render to update the UI
                    setTimeout(() => {
                      logRecipeState();
                    }, 100);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          {currentRecipe.ingredients.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No ingredients added yet. Click "Add Ingredient" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Instructions</h2>
          <button
            onClick={() => {
              addStep();
              // Force re-render to show the new step
              setTimeout(() => {
                logRecipeState();
              }, 100);
            }}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Step
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ol className="space-y-4">
            {currentRecipe.steps.map((step, index) => (
              <li key={step.id} className="flex">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3">
                  {index + 1}
                </div>

                <div className="flex-grow flex items-start">
                  <textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-200 rounded"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      removeStep(step.id);
                      // Force re-render to update the UI
                      setTimeout(() => {
                        logRecipeState();
                      }, 100);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {currentRecipe.steps.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No steps added yet. Click "Add Step" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
        <div>
          <input
            type="text"
            placeholder="Enter tags separated by commas (e.g. Vegetarian, Healthy, Quick)"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-2"
            defaultValue={currentRecipe.tags ? currentRecipe.tags.join(', ') : ''}
            onBlur={(e) => {
              const tagsArray = e.target.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');
              updateTags(tagsArray);
            }}
          />
          <p className="text-sm text-gray-500">Press Tab or click outside after entering tags</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditRecipe;

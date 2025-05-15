import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRecipes } from '../contexts/RecipeContext';
import { Clock, Users, ChefHat, Heart, Edit, Download, Upload, Trash, Plus, Minus, Save } from 'lucide-react';
import { toast } from 'sonner';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    recipes,
    currentRecipe,
    setCurrentRecipe,
    toggleFavorite,
    updateServings,
    saveRecipeToJSON,
    loadRecipeFromJSON,
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

  const [isEditing, setIsEditing] = useState(false);
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
      // Just clear the current recipe without auto-saving
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

  const handleToggleFavorite = () => {
    toggleFavorite(currentRecipe.id);
    toast.success(currentRecipe.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleSaveToJSON = () => {
    saveRecipeToJSON();
    toast.success('Recipe saved to JSON file');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        loadRecipeFromJSON(jsonData);
        toast.success('Recipe loaded successfully');
      } catch (error) {
        toast.error('Failed to load recipe. Invalid format.');
      }
    };
    reader.readAsText(file);

    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Recipe Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        {isEditing ? (
          <input
            type="text"
            value={currentRecipe.title}
            onChange={(e) => updateRecipeField('title', e.target.value)}
            className="text-3xl font-bold text-gray-800 mb-2 md:mb-0 px-2 py-1 border border-gray-200 rounded w-full md:w-auto"
            placeholder="Recipe Title"
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">{currentRecipe.title}</h1>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full ${
              currentRecipe.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'
            } hover:bg-red-500 hover:text-white transition-colors`}
            title={currentRecipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${currentRecipe.isFavorite ? 'fill-white' : ''}`} />
          </button>

          <Link
            to={`/edit/${id}`}
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Edit recipe"
          >
            <Edit className="w-5 h-5" />
          </Link>

          <button
            onClick={handleSaveToJSON}
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Save recipe to JSON"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Load recipe from JSON"
          >
            <Upload className="w-5 h-5" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </button>
        </div>
      </div>

      {/* Recipe Image */}
      <div className="relative rounded-xl overflow-hidden mb-6 h-64 md:h-96">
        {isEditing && (
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-4">
            <input
              type="text"
              value={currentRecipe.image}
              onChange={(e) => updateRecipeField('image', e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-200"
              placeholder="Image URL"
            />
          </div>
        )}
        <img
          src={currentRecipe.image}
          alt={currentRecipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center text-white space-x-4">
            {isEditing ? (
              <>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <input
                    type="number"
                    value={currentRecipe.time}
                    onChange={(e) => updateRecipeField('time', parseInt(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded text-black"
                    min="1"
                  />
                  <span className="ml-1">min</span>
                </div>
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-1" />
                  <select
                    value={currentRecipe.difficulty}
                    onChange={(e) => updateRecipeField('difficulty', e.target.value)}
                    className="px-2 py-1 rounded text-black"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={currentRecipe.cuisine}
                    onChange={(e) => updateRecipeField('cuisine', e.target.value)}
                    className="px-2 py-1 rounded text-black"
                    placeholder="Cuisine"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  <span>{currentRecipe.time} min</span>
                </div>
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-1" />
                  <span>{currentRecipe.difficulty}</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {currentRecipe.cuisine}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Description */}
      {isEditing ? (
        <textarea
          value={currentRecipe.description}
          onChange={(e) => updateRecipeField('description', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-8"
          rows={4}
          placeholder="Recipe description"
        />
      ) : (
        <p className="text-gray-700 mb-8">{currentRecipe.description}</p>
      )}

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
          {isEditing && (
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
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ul className="space-y-2">
            {currentRecipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="flex items-center justify-between">
                {isEditing ? (
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
                ) : (
                  <span className="text-gray-700">
                    <span className="font-medium">{ingredient.amount} {ingredient.unit}</span> {ingredient.name}
                  </span>
                )}

                {isEditing && (
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
                )}
              </li>
            ))}
          </ul>

          {isEditing && currentRecipe.ingredients.length === 0 && (
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
          {isEditing && (
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
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <ol className="space-y-4">
            {currentRecipe.steps.map((step, index) => (
              <li key={step.id} className="flex">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3">
                  {index + 1}
                </div>

                {isEditing ? (
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
                ) : (
                  <p className="text-gray-700">{step.description}</p>
                )}
              </li>
            ))}
          </ol>

          {isEditing && currentRecipe.steps.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No steps added yet. Click "Add Step" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
        {isEditing ? (
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
        ) : (
          currentRecipe.tags && currentRecipe.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentRecipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tags added yet</p>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;

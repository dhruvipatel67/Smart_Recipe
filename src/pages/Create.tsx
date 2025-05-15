import React, { useState } from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Minus, Clock, Users, ChefHat, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRecipeFormData {
  title: string;
  description: string;
  image: string;
  time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  ingredients: {
    name: string;
    amount: string;
    unit: string;
  }[];
  steps: {
    description: string;
  }[];
}

const Create: React.FC = () => {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateRecipeFormData>({
    defaultValues: {
      title: '',
      description: '',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      time: 30,
      servings: 4,
      difficulty: 'Medium',
      cuisine: '',
      tags: [],
      ingredients: [{ name: '', amount: '', unit: '' }],
      steps: [{ description: '' }]
    }
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } =
    useFieldArray({ control, name: 'ingredients' });

  const { fields: stepFields, append: appendStep, remove: removeStep } =
    useFieldArray({ control, name: 'steps' });

  const onSubmit = async (data: CreateRecipeFormData) => {
    setIsSubmitting(true);

    try {
      // Process the ingredients and steps to add IDs
      const processedIngredients = data.ingredients.map((ingredient, index) => ({
        ...ingredient,
        id: `ingredient-${index + 1}`
      }));

      const processedSteps = data.steps.map((step, index) => ({
        ...step,
        id: `step-${index + 1}`
      }));

      // Add the recipe
      addRecipe({
        ...data,
        ingredients: processedIngredients,
        steps: processedSteps,
        isFavorite: false
      });

      toast.success('Recipe created successfully!');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Recipe</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Title*
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Homemade Chocolate Chip Cookies"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe your recipe..."
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  {...register('image')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to use a default image
              </p>
            </div>
          </div>

          {/* Recipe Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Recipe Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cooking Time */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Cooking Time (minutes)*
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="time"
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register('time', {
                      required: 'Cooking time is required',
                      min: {
                        value: 1,
                        message: 'Time must be at least 1 minute'
                      }
                    })}
                  />
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>

              {/* Servings */}
              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                  Servings*
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="servings"
                    type="number"
                    min="1"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register('servings', {
                      required: 'Number of servings is required',
                      min: {
                        value: 1,
                        message: 'Servings must be at least 1'
                      }
                    })}
                  />
                </div>
                {errors.servings && (
                  <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty*
                </label>
                <select
                  id="difficulty"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  {...register('difficulty', { required: 'Difficulty is required' })}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                )}
              </div>

              {/* Cuisine */}
              <div>
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                  Cuisine*
                </label>
                <input
                  id="cuisine"
                  type="text"
                  placeholder="e.g. Italian, Mexican, Asian"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.cuisine ? 'border-red-500' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
                  {...register('cuisine', { required: 'Cuisine is required' })}
                />
                {errors.cuisine && (
                  <p className="mt-1 text-sm text-red-600">{errors.cuisine.message}</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                placeholder="e.g. Vegetarian, Healthy, Quick Meals"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                onChange={(e) => {
                  const tagsArray = e.target.value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag !== '');

                  // Update the form value
                  control._formValues.tags = tagsArray;
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Add relevant tags to help others find your recipe
              </p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Ingredients</h2>
              <button
                type="button"
                onClick={() => appendIngredient({ name: '', amount: '', unit: '' })}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Ingredient
              </button>
            </div>

            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2">
                <div className="flex-grow grid grid-cols-3 gap-2">
                  <input
                    placeholder="Amount"
                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register(`ingredients.${index}.amount` as const, { required: true })}
                  />
                  <input
                    placeholder="Unit (e.g. cups, tbsp)"
                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register(`ingredients.${index}.unit` as const)}
                  />
                  <input
                    placeholder="Ingredient name"
                    className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register(`ingredients.${index}.name` as const, { required: true })}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Steps</h2>
              <button
                type="button"
                onClick={() => appendStep({ description: '' })}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </button>
            </div>

            {stepFields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2">
                <div className="flex-shrink-0 bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <textarea
                    rows={2}
                    placeholder={`Step ${index + 1} description...`}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    {...register(`steps.${index}.description` as const, { required: true })}
                  />
                </div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                  Creating Recipe...
                </>
              ) : (
                'Create Recipe'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;

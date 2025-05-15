import { createContext, useContext, useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { mockRecipes } from '../data/mockData';
import { toast } from 'sonner';

// Interface for the current recipe being edited
interface CurrentRecipe extends Recipe {
  originalServings: number;
  currentServings: number;
}

interface RecipeContextType {
  recipes: Recipe[];
  userRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  currentRecipe: CurrentRecipe | null;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'userId'>) => void;
  toggleFavorite: (recipeId: string) => void;
  searchRecipes: (query: string) => Recipe[];
  setCurrentRecipe: (recipe: Recipe | null) => void;
  updateServings: (servings: number) => void;
  updateRecipeField: (field: keyof Recipe, value: any) => void;
  updateIngredient: (ingredientId: string, updates: Partial<{name: string, amount: string, unit: string}>) => void;
  addIngredient: () => void;
  removeIngredient: (ingredientId: string) => void;
  addStep: () => void;
  updateStep: (stepId: string, description: string) => void;
  removeStep: (stepId: string) => void;
  updateTags: (tags: string[]) => void;
  saveRecipeToJSON: () => void;
  loadRecipeFromJSON: (jsonData: string) => void;
  saveRecipe: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  // Load recipes from localStorage or use mock data
  const loadRecipesFromStorage = (): Recipe[] => {
    const storedRecipes = localStorage.getItem('recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : mockRecipes;
  };

  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipesFromStorage());
  const [currentRecipe, setCurrentRecipeState] = useState<CurrentRecipe | null>(null);
  const userId = 'user1'; // Mock user ID

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  // Save current recipe to localStorage
  useEffect(() => {
    if (currentRecipe) {
      localStorage.setItem('currentRecipe', JSON.stringify(currentRecipe));
    }
  }, [currentRecipe]);

  // Load current recipe from localStorage on initial load
  useEffect(() => {
    const storedCurrentRecipe = localStorage.getItem('currentRecipe');
    if (storedCurrentRecipe) {
      setCurrentRecipeState(JSON.parse(storedCurrentRecipe));
    }
  }, []);

  const userRecipes = recipes.filter(recipe => recipe.userId === userId);
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  // Set the current recipe being viewed/edited
  const setCurrentRecipe = (recipe: Recipe | null) => {
    if (recipe) {
      setCurrentRecipeState({
        ...recipe,
        originalServings: recipe.servings,
        currentServings: recipe.servings
      });
    } else {
      setCurrentRecipeState(null);
      localStorage.removeItem('currentRecipe');
    }
  };

  // Update servings and recalculate ingredient amounts
  const updateServings = (servings: number) => {
    if (!currentRecipe) return;

    const ratio = servings / currentRecipe.originalServings;

    // Update ingredient amounts based on the ratio
    const updatedIngredients = currentRecipe.ingredients.map(ingredient => {
      // Only update numeric amounts
      const originalAmount = parseFloat(ingredient.amount);
      if (!isNaN(originalAmount)) {
        // Calculate new amount and round to 2 decimal places for readability
        const newAmount = (originalAmount * ratio).toFixed(2);
        // Remove trailing zeros and decimal point if it's a whole number
        const formattedAmount = newAmount.replace(/\.00$/, '').replace(/\.0$/, '');
        return { ...ingredient, amount: formattedAmount };
      }
      return ingredient;
    });

    setCurrentRecipeState({
      ...currentRecipe,
      currentServings: servings,
      ingredients: updatedIngredients
    });
  };

  // Update an ingredient in the current recipe
  const updateIngredient = (ingredientId: string, updates: Partial<{name: string, amount: string, unit: string}>) => {
    if (!currentRecipe) return;

    console.log("Updating ingredient:", ingredientId, updates);

    const updatedIngredients = currentRecipe.ingredients.map(ingredient =>
      ingredient.id === ingredientId ? { ...ingredient, ...updates } : ingredient
    );

    console.log("Updated ingredients:", updatedIngredients);

    // Create a new recipe object with updated ingredients
    const updatedRecipe = {
      ...currentRecipe,
      ingredients: updatedIngredients
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Add a new ingredient to the current recipe
  const addIngredient = () => {
    if (!currentRecipe) return;

    const newIngredient = {
      id: `ingredient-${Date.now()}`,
      name: '',
      amount: '',
      unit: ''
    };

    console.log("Adding ingredient:", newIngredient);

    const updatedIngredients = [...currentRecipe.ingredients, newIngredient];

    console.log("Updated ingredients after add:", updatedIngredients);

    // Create a new recipe object with updated ingredients
    const updatedRecipe = {
      ...currentRecipe,
      ingredients: updatedIngredients
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Remove an ingredient from the current recipe
  const removeIngredient = (ingredientId: string) => {
    if (!currentRecipe) return;

    console.log("Removing ingredient:", ingredientId);

    const updatedIngredients = currentRecipe.ingredients.filter(ingredient =>
      ingredient.id !== ingredientId
    );

    console.log("Updated ingredients after remove:", updatedIngredients);

    // Create a new recipe object with updated ingredients
    const updatedRecipe = {
      ...currentRecipe,
      ingredients: updatedIngredients
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Add a new step to the current recipe
  const addStep = () => {
    if (!currentRecipe) return;

    const newStep = {
      id: `step-${Date.now()}`,
      description: ''
    };

    console.log("Adding step:", newStep);

    const updatedSteps = [...currentRecipe.steps, newStep];

    console.log("Updated steps after add:", updatedSteps);

    // Create a new recipe object with updated steps
    const updatedRecipe = {
      ...currentRecipe,
      steps: updatedSteps
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Update a step in the current recipe
  const updateStep = (stepId: string, description: string) => {
    if (!currentRecipe) return;

    console.log("Updating step:", stepId, description);

    const updatedSteps = currentRecipe.steps.map(step =>
      step.id === stepId ? { ...step, description } : step
    );

    console.log("Updated steps:", updatedSteps);

    // Create a new recipe object with updated steps
    const updatedRecipe = {
      ...currentRecipe,
      steps: updatedSteps
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Remove a step from the current recipe
  const removeStep = (stepId: string) => {
    if (!currentRecipe) return;

    console.log("Removing step:", stepId);

    const updatedSteps = currentRecipe.steps.filter(step =>
      step.id !== stepId
    );

    console.log("Updated steps after remove:", updatedSteps);

    // Create a new recipe object with updated steps
    const updatedRecipe = {
      ...currentRecipe,
      steps: updatedSteps
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Save the current recipe to a JSON file
  const saveRecipeToJSON = () => {
    if (!currentRecipe) return;

    // Create a blob with the recipe data
    const recipeData = JSON.stringify(currentRecipe, null, 2);
    const blob = new Blob([recipeData], { type: 'application/json' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRecipe.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  // Load a recipe from a JSON file
  const loadRecipeFromJSON = (jsonData: string) => {
    try {
      const parsedRecipe = JSON.parse(jsonData) as Recipe;

      // Validate that it's a recipe object
      if (!parsedRecipe.title || !Array.isArray(parsedRecipe.ingredients) || !Array.isArray(parsedRecipe.steps)) {
        throw new Error('Invalid recipe format');
      }

      // Set as current recipe
      setCurrentRecipe(parsedRecipe);

      // Add to recipes if it doesn't exist
      const recipeExists = recipes.some(r => r.id === parsedRecipe.id);
      if (!recipeExists) {
        const newRecipe: Recipe = {
          ...parsedRecipe,
          id: parsedRecipe.id || Date.now().toString(),
          userId: userId,
          isFavorite: parsedRecipe.isFavorite || false
        };

        setRecipes(prev => [...prev, newRecipe]);
      }
    } catch (error) {
      console.error('Error loading recipe from JSON:', error);
      throw new Error('Failed to load recipe. Invalid format.');
    }
  };

  // Add a new recipe
  const addRecipe = (newRecipe: Omit<Recipe, 'id' | 'userId'>) => {
    const recipe: Recipe = {
      ...newRecipe,
      id: Date.now().toString(),
      userId,
      isFavorite: false
    };

    setRecipes(prev => [...prev, recipe]);
    return recipe;
  };

  // Toggle favorite status of a recipe
  const toggleFavorite = (recipeId: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );

    // Also update current recipe if it's the one being toggled
    if (currentRecipe && currentRecipe.id === recipeId) {
      setCurrentRecipeState({
        ...currentRecipe,
        isFavorite: !currentRecipe.isFavorite
      });
    }
  };

  // Search recipes by query
  const searchRecipes = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.cuisine.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Update a field in the current recipe
  const updateRecipeField = (field: keyof Recipe, value: any) => {
    if (!currentRecipe) return;

    console.log(`Updating field ${field}:`, value);

    // Create a new recipe object with the updated field
    const updatedRecipe = {
      ...currentRecipe,
      [field]: value
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Update tags in the current recipe
  const updateTags = (tags: string[]) => {
    if (!currentRecipe) return;

    console.log("Updating tags:", tags);

    // Create a new recipe object with updated tags
    const updatedRecipe = {
      ...currentRecipe,
      tags
    };

    // Update the current recipe state
    setCurrentRecipeState(updatedRecipe);

    // Also update localStorage to persist changes immediately
    localStorage.setItem('currentRecipe', JSON.stringify(updatedRecipe));
  };

  // Save the current recipe back to the recipes array
  const saveRecipe = () => {
    if (!currentRecipe) return false;

    console.log("Saving recipe:", currentRecipe);

    // Create a recipe object without the currentServings and originalServings properties
    const { currentServings, originalServings, ...recipeToSave } = currentRecipe;

    // Update the servings to the current value
    const updatedRecipe: Recipe = {
      ...recipeToSave,
      servings: currentServings
    };

    // Log the recipe before saving
    console.log("Updated recipe to save:", updatedRecipe);

    // Update the recipe in the recipes array
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === updatedRecipe.id ? updatedRecipe : recipe
    );

    // Save to localStorage immediately
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));

    // Update state
    setRecipes(updatedRecipes);

    toast.success('Recipe updated successfully!', {
      id: 'recipe-save-toast', // Use a consistent ID to prevent duplicate toasts
      duration: 2000 // Show for 2 seconds
    });

    return true;
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      userRecipes,
      favoriteRecipes,
      currentRecipe,
      addRecipe,
      toggleFavorite,
      searchRecipes,
      setCurrentRecipe,
      updateServings,
      updateRecipeField,
      updateIngredient,
      addIngredient,
      removeIngredient,
      addStep,
      updateStep,
      removeStep,
      updateTags,
      saveRecipeToJSON,
      loadRecipeFromJSON,
      saveRecipe
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
import React from 'react';
import RecipeCard from './RecipeCard';
import { Recipe } from '../types/recipe';

const RecipeList: React.FC = () => {
  // Mock data for demonstration
  const recipes: Recipe[] = [
    {
      id: '1',
      title: 'Vegetable Stir Fry',
      image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: 30,
      difficulty: 'Medium',
      servings: 4,
      cuisine: 'Asian',
      tags: ['Vegetarian', 'Healthy'],
      ingredients: [
        { id: '1', name: 'Broccoli', amount: '2 cups', unit: 'chopped' },
        { id: '2', name: 'Carrots', amount: '1 cup', unit: 'sliced' },
        { id: '3', name: 'Bell Peppers', amount: '1', unit: 'sliced' },
        { id: '4', name: 'Soy Sauce', amount: '2 tbsp', unit: '' },
      ],
      steps: [
        { id: '1', description: 'Heat oil in a wok or large frying pan.' },
        { id: '2', description: 'Add vegetables and stir-fry for 5-7 minutes.' },
        { id: '3', description: 'Add sauce and cook for another 2 minutes.' },
      ]
    },
    {
      id: '2',
      title: 'Mediterranean Grilled Chicken',
      image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: 45,
      difficulty: 'Easy',
      servings: 2,
      cuisine: 'Mediterranean',
      tags: ['High-Protein', 'Gluten-Free'],
      ingredients: [
        { id: '1', name: 'Chicken Breast', amount: '2', unit: 'pieces' },
        { id: '2', name: 'Olive Oil', amount: '2 tbsp', unit: '' },
        { id: '3', name: 'Lemon', amount: '1', unit: 'juiced' },
        { id: '4', name: 'Garlic', amount: '3 cloves', unit: 'minced' },
      ],
      steps: [
        { id: '1', description: 'Marinate chicken with oil, lemon juice, and garlic for 30 minutes.' },
        { id: '2', description: 'Preheat grill to medium-high heat.' },
        { id: '3', description: 'Grill chicken for 6-7 minutes on each side.' },
      ]
    },
    {
      id: '3',
      title: 'Chocolate Chip Cookies',
      image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: 35,
      difficulty: 'Easy',
      servings: 24,
      cuisine: 'American',
      tags: ['Dessert', 'Baking'],
      ingredients: [
        { id: '1', name: 'Flour', amount: '2 1/4 cups', unit: '' },
        { id: '2', name: 'Butter', amount: '1 cup', unit: 'softened' },
        { id: '3', name: 'Chocolate Chips', amount: '2 cups', unit: '' },
        { id: '4', name: 'Sugar', amount: '3/4 cup', unit: '' },
      ],
      steps: [
        { id: '1', description: 'Preheat oven to 375°F.' },
        { id: '2', description: 'Mix butter and sugar until creamy.' },
        { id: '3', description: 'Add flour and chocolate chips. Drop spoonfuls onto baking sheet.' },
        { id: '4', description: 'Bake for 9-11 minutes until golden brown.' },
      ]
    },
    {
      id: '4',
      title: 'Fresh Salsa',
      image: 'https://images.pexels.com/photos/8280098/pexels-photo-8280098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      time: 15,
      difficulty: 'Easy',
      servings: 6,
      cuisine: 'Mexican',
      tags: ['Appetizer', 'Vegan'],
      ingredients: [
        { id: '1', name: 'Tomatoes', amount: '4', unit: 'diced' },
        { id: '2', name: 'Onion', amount: '1/2', unit: 'finely chopped' },
        { id: '3', name: 'Jalapeño', amount: '1', unit: 'minced' },
        { id: '4', name: 'Cilantro', amount: '1/4 cup', unit: 'chopped' },
      ],
      steps: [
        { id: '1', description: 'Combine all ingredients in a bowl.' },
        { id: '2', description: 'Add lime juice and salt to taste.' },
        { id: '3', description: 'Refrigerate for at least 30 minutes before serving.' },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList;
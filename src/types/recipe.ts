export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[];
  ingredients: {
    id: string;
    name: string;
    amount: string;
    unit: string;
  }[];
  steps: {
    id: string;
    description: string;
  }[];
  userId: string;
  isFavorite: boolean;
}

export interface User {
  id: string;
  email: string;
}
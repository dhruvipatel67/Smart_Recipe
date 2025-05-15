import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RecipeProvider } from './contexts/RecipeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Create from './pages/Create';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';

function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/create" element={<Create />} />
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/edit/:id" element={<EditRecipe />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-center" />
        </Router>
      </RecipeProvider>
    </AuthProvider>
  );
}

export default App;
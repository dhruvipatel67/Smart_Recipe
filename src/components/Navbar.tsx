import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Search, PlusCircle, Heart, BookOpen, Home, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <ChefHat className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-800">Smart Recipe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/search" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5 mr-1" />
              <span>Search</span>
            </Link>
            <Link to="/create" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <PlusCircle className="w-5 h-5 mr-1" />
              <span>Create</span>
            </Link>
            <Link to="/favorites" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Heart className="w-5 h-5 mr-1" />
              <span>Favorites</span>
            </Link>
            <Link to="/my-recipes" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <BookOpen className="w-5 h-5 mr-1" />
              <span>My Recipes</span>
            </Link>
          </nav>

          {/* Login/Signup removed */}

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 space-y-3">
            <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
              <Home className="w-5 h-5 mr-3" />
              <span>Home</span>
            </Link>
            <Link to="/search" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
              <Search className="w-5 h-5 mr-3" />
              <span>Search</span>
            </Link>

            <Link to="/create" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
              <PlusCircle className="w-5 h-5 mr-3" />
              <span>Create</span>
            </Link>
            <Link to="/favorites" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
              <Heart className="w-5 h-5 mr-3" />
              <span>Favorites</span>
            </Link>
            <Link to="/my-recipes" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors py-2">
              <BookOpen className="w-5 h-5 mr-3" />
              <span>My Recipes</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
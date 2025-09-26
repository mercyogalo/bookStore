import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookList } from '../components/BookList';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../Utils/axiosInstance';
import { Navbar } from '../components/Navbar';
import api from '../Utils/Api';

export const Favorites = ({ onBookClick, onLike, onFavorite }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/';
    } else {
      fetchFavorites();
    }
  }, []);

  // Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`/book/favorites`);
      setFavorites(response.data);
      setFilteredFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const deleteFavorite = async (bookId) => {
    try {
      await axiosInstance.delete(`${api}/book/favorites/${bookId}`);
      setFavorites((prevFavorites) => prevFavorites.filter((book) => book.id !== bookId));
      setFilteredFavorites((prevFiltered) => prevFiltered.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Sign In to View Favorites</h2>
        <p className="text-muted-foreground">
          Create an account to save your favorite books and access them anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <span>My Favorites</span>
        </h1>
        <p className="text-muted-foreground">
          Books you've saved and loved
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring books and add them to your favorites!
            </p>
            <Button onClick={() => window.location.href = '#home'}>
              Discover Books
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BookList
          books={favorites}
          onBookClick={onBookClick}
          onLike={onLike}
          onFavorite={onFavorite}
          onDelete={deleteFavorite} // Pass delete functionality
        />
      )}
    </div>
  );
};

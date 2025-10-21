import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookList } from '../components/BookList';
import axiosInstance from '../Utils/axiosInstance';
import { Navbar } from '../components/Navbar';


export const Favorites = ({ onBookClick, onLike, onFavorite }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);


 
  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`/book/fv/favorites`);
      setFavorites(response.data);
      console.log(response.data);
      setFilteredFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const deleteFavorite = async (bookId) => {
    try {
      await axiosInstance.delete(`/book/favorites/${bookId}`);
      setFavorites((prevFavorites) => prevFavorites.filter((book) => book.id !== bookId));
      setFilteredFavorites((prevFiltered) => prevFiltered.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };


  return (
    <div className="space-y-6">
      <Navbar />
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
          onDelete={deleteFavorite} 
        />
      )}
    </div>
  );
};

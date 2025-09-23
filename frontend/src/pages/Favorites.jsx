import { useState, useEffect } from 'react';
import { Heart, Filter, SortAsc, Trash } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('recently-added');
  const [filterBy, setFilterBy] = useState('all');
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

  useEffect(() => {
    let filtered = [...favorites];

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(
        (book) => book.category?.toLowerCase() === filterBy.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'recently-added':
      default:
        filtered.sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
    }

    setFilteredFavorites(filtered);
  }, [favorites, sortBy, filterBy]);

  const categories = ['all', ...new Set(favorites.map((book) => book.category?.toLowerCase()))];

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
        <>
          {/* Filters and Sorting */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filter:</span>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="text-sm border rounded-md px-3 py-1 bg-background"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === 'all'
                            ? 'All Categories'
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4" />
                  <span className="text-sm font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded-md px-3 py-1 bg-background"
                  >
                    <option value="recently-added">Recently Added</option>
                    <option value="title">Title A-Z</option>
                    <option value="author">Author A-Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredFavorites.length} of {favorites.length} favorite books
            </p>
          </div>

          {/* Favorites Grid */}
          {filteredFavorites.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No books found with the current filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <BookList
              books={filteredFavorites}
              onBookClick={onBookClick}
              onLike={onLike}
              onFavorite={onFavorite}
              onDelete={deleteFavorite} // Pass delete functionality
            />
          )}
        </>
      )}
    </div>
  );
};

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { BookList } from "../components/BookList";
import axiosInstance from "../Utils/axiosInstance";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

export const Favorites = ({ onBookClick }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const fetchFavorites = async () => {
    try {
      const response = await axiosInstance.get(`/book/fv/favorites`);
      const favoriteBooks = response.data.map((book) => ({
        ...book,
        isFavorited: true,
      }));
      setFavorites(favoriteBooks);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const handleFavoriteChange = async (bookId, newState) => {
    if (!newState) {
      try {
        await axiosInstance.delete(`/book/unfavorite/${bookId}`);
        setFavorites((prev) => prev.filter((book) => book._id !== bookId));
      } catch (error) {
        console.error("Failed to delete favorite:", error);
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-muted-foreground">
        <Heart className="animate-pulse h-8 w-8 mb-3 text-red-500" />
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Navbar />
      <div className="text-center space-y-2 mt-4">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <span>My Favorites</span>
        </h1>
        <p className="text-muted-foreground">
          Books you've saved and loved 
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="max-w-xl mx-auto mt-6">
          <CardContent className="py-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start exploring books and add them to your favorites!
            </p>
            <Link
              to="/reviewer-dashboard"
              className="text-blue-600 hover:underline font-medium"
            >
              Discover Books
            </Link>
          </CardContent>
        </Card>
      ) : (
        <BookList
          books={favorites}
          onBookClick={onBookClick}
          onFavoriteChange={handleFavoriteChange}
        />
      )}
    </div>
  );
};

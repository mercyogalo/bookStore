import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FavoriteButton } from "./FavoriteButton";
import { LikeButton } from "./LikeButton";
import { MessageCircle, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import api from "../Utils/Api";
import { useAuth } from "../context/AuthContext";

export function BookList() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();




  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/book/fv/favorites`, {
        params: { userId: user?.id },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorite books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchFavorites();
  }, [user?.id]);


  const handleFavoriteChange = (bookId, newState) => {
    if (!newState) {
      setTimeout(() => {
        setFavorites((prev) => prev.filter((b) => b._id !== bookId));
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Heart className="w-8 h-8 mb-3 animate-pulse text-red-500" />
        <p>Loading your favorite books...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Heart className="w-8 h-8 mb-3" />
        <p>You haven’t added any favorite books yet.</p>
        <Link
          to="/reviewer-dashboard"
          className="mt-4 text-primary hover:underline"
        >
          Discover Books
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="
        grid 
        gap-6 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-6
        p-4
      "
    >
      <AnimatePresence>
        {favorites.map((book) => (
          <motion.div
            key={book._id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform">
            
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={
                  `${api}${book.coverImage}`
                  }
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <Link to={`/bookPage/${book._id}`}>
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-1 text-foreground" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Book Info */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <Link to={`/bookPage/${book._id}`}>
                      <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {book.author}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {book.description}
                </p>

              
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <LikeButton
                      bookId={book._id}
                      isLiked={book.isLiked || false}
                      onClick={() => {}}
                    />

                    <FavoriteButton
                      bookId={book._id}
                      isFavorited={true}
                      onChange={(newState) =>
                        handleFavoriteChange(book._id, newState)
                      }
                    />

                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{book.reviewCount || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

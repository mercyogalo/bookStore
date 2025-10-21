import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import axiosInstance from '../Utils/axiosInstance';
import { useAuth } from '../context/AuthContext'; 
import { useToast } from "../hooks/use-toast";

export const FavoriteButton = ({ bookId, isFavorited = false }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFavorite = async () => {

    setIsAnimating(true);
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);

    try {
      if (newFavoritedState) {
        const res = await axiosInstance.post(`/book/fv/favorite/${bookId}`, { userId: user.id });
        toast({
          description: res.data?.message || "Book added to your favorites.",
        });
      } else {
        const res = await axiosInstance.delete(`/book/fv/unfavorite/${bookId}`, { data: { userId: user.id },  });
        toast({
          description: res.data?.message || "Book removed from your favorites.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong, please try again.";
      toast({
        description: message,
        variant: "destructive",
      });
      setFavorited(!newFavoritedState);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleFavorite}
      className={cn(
        "flex items-center space-x-1 transition-all duration-200",
        favorited
          ? "text-blue-500 hover:text-blue-600"
          : "text-gray-500 hover:text-gray-600",
        isAnimating && "scale-110"
      )}
    >
      <Bookmark
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorited && "fill-current",
          isAnimating && "animate-pulse"
        )}
      />
      <span className="text-sm font-medium">
        {favorited ? 'Saved' : 'Favorite'}
      </span>
    </Button>
  );
};

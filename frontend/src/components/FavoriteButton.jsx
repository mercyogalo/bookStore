import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import axiosInstance from '../Utils/axiosInstance';
import { useToast } from "../hooks/use-toast";

export function LikeButton({ bookId, initialCount = 0, isLiked: initialLiked = false }) {
  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const handleLike = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(`/book/lk/likeBook/${bookId}/like`);
      const newLikedState = res.data.liked;

      setIsLiked(newLikedState);
      setCount(prev => newLikedState ? prev + 1 : prev - 1);

      if (newLikedState) {
        e.stopPropagation();
        setIsAnimating(true);
        toast({
          description: res.data?.message || "Liked",
        });
      } else {
        setTimeout(() => setIsAnimating(false), 200);
        toast({
          description: res.data?.message || "Unliked",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className="flex items-center space-x-1 px-2 py-1 h-auto"
    >
      <Heart 
        className={`h-3 w-3 transition-all duration-200 ${
          isLiked 
            ? 'fill-red-500 text-red-500' 
            : 'text-muted-foreground hover:text-red-500'
        } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      />
      <span className="text-xs">{count}</span>
    </Button>
  );
}

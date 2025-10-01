import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';

export const ReviewForm = ({ onSubmit, isSubmitting = false }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({ content: content.trim(), rating });
    setContent('');
    setRating(5);
    
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setRating(i + 1)}
        className="focus:outline-none transition-colors"
      >
        <Star
          className={`h-5 w-5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400 hover:fill-yellow-300' : 'text-muted-foreground hover:text-yellow-300'
          }`}
        />
      </button>
    ));
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to write a review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mr-2 ml-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Add a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
          {user.coverImage && <AvatarImage src={user.coverImage} alt={user.username} />}
                <AvatarFallback>
        {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
      </AvatarFallback>
        </Avatar>
            <div>
              <p className="font-semibold text-sm">{user.username}</p>
            </div>
          </div>
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts about this book..."
            className="min-h-[120px] resize-none"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!content.trim() || isSubmitting}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
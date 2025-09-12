import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Share2, Flag, Users, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { LikeButton } from '../components/LikeButton';
import { FavoriteButton } from '../components/FavoriteButton';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewCard } from '../components/ReviewCard';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '../components/ui/alert-dialog';
import { useToast } from '../hooks/use-toast';

export const BookPage = ({ book, onBack }) => {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [books, setBooks] = useState([]);
  const [userRole, setUserRole] = useState(''); // 'admin' or 'author' or ''
  const [userName, setUserName] = useState(''); // current user's name
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${book.id}/reviews`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (book?.id) {
      fetchReviews();
    }
  }, [book?.id]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: null,
      content: reviewData.content,
      rating: reviewData.rating,
      likes: 0,
      isLiked: false,
      createdAt: 'Just now',
      isEdited: false,
      isPinned: false
    };

    setReviews(prev => [newReview, ...prev]);
  };

  const handleEditReview = (reviewId, updatedData) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, ...updatedData, isEdited: true }
        : review
    ));
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const handleLikeReview = (reviewId, isLiked) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            likes: isLiked ? review.likes + 1 : review.likes - 1,
            isLiked: isLiked 
          }
        : review
    ));
  };

  const handleDeleteBook = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/books/deleteBook/${book.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({ title: 'Book deleted successfully!', status: 'success' });
        navigate('/books');
      } else {
        const errorData = await response.json();
        toast({ title: errorData.message || 'Failed to delete book', status: 'error' });
      }
    } catch (error) {
      toast({ title: 'An error occurred', status: 'error' });
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'highest-rated':
        return b.rating - a.rating;
      case 'most-liked':
        return b.likes - a.likes;
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </Button>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover and Actions */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-4">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <LikeButton
                    initialLikes={book.likes}
                    isLiked={book.isLiked}
                    size="default"
                  />
                  <FavoriteButton isFavorited={book.isFavorited} />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Book Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{book.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reviews</span>
                <span className="font-medium">{book.reviewCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Likes</span>
                <span className="font-medium">{book.likes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Views</span>
                <span className="font-medium">{Math.floor(Math.random() * 5000) + 1000}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Book Info and Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <p className="text-xl text-muted-foreground">by {book.author}</p>
                <div className="flex items-center space-x-2">
                  {book.category && (
                    <Badge variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {book.category}
                    </Badge>
                  )}
                  {book.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      New Release
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {book.description}
              </p>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Reviews ({reviews.length})</span>
                </CardTitle>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-md px-3 py-1 bg-background"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="most-liked">Most Liked</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReviewForm onSubmit={handleSubmitReview} />
              
              <Separator />
              
              <div className="space-y-4">
                {sortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
                    onLike={handleLikeReview}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Books Grid */}
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="shadow-md">
              <CardHeader>
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                  <img
                    src={book.coverImage || `https://via.placeholder.com/150`}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
                <p className="text-sm text-muted-foreground">Genre: {book.genre}</p>
                <p className="text-sm text-muted-foreground">Published: {book.yearPublished}</p>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/books/${book.id}`)}
                  className="w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Book Button (Visible to authors and admins) */}
      {(userRole === 'admin' || (userRole === 'author' && userName === book.author)) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Book</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this book? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteBook}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
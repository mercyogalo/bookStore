import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Utils/socket";
import ReviewForm from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";
import axiosInstance from "../Utils/axiosInstance";
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from "../components/Navbar";
import api from '../Utils/Api';
import { useToast } from '../hooks/use-toast';

export const BookPage = () => {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [book, setBook] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching book:', bookId);
        // Fetch book details (backend route: GET /api/book/getBook/:id)
        const bookRes = await axiosInstance.get(`/book/getBook/${bookId}`);
        console.log('Book response:', bookRes);

        if (!bookRes.data) {
          throw new Error('Book not found');
        }
        setBook(bookRes.data);

        // Fetch reviews (backend route: GET /api/reviews/:bookId)
        const reviewRes = await axiosInstance.get(`/reviews/${bookId}`);
        console.log('Reviews response:', reviewRes);

        if (Array.isArray(reviewRes.data)) {
          setReviews(reviewRes.data);
          setReviewCount(reviewRes.data.length);
        } else {
          setReviews([]);
          setReviewCount(0);
        }
      } catch (err) {
        console.error('Error fetching book data:', err.response || err);
        setError(err.response?.data?.message || err.message || 'Failed to load book details');
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response?.data?.message || err.message || 'Failed to load book details'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (bookId) {
      fetchData();
    }
  }, [bookId, toast]);

  // Setup socket connection
  useEffect(() => {
    if (!bookId) return;

    // Connect to socket room for this book
    console.log('Joining book room:', bookId);
    socket.emit("joinBook", bookId);

    // Listen for new reviews
    socket.on("receiveReview", (newReview) => {
      console.log('Received new review:', newReview);
      setReviews((prev) => [newReview, ...prev]);
      setReviewCount((prev) => prev + 1);
    });

    // Listen for deleted reviews
    socket.on("reviewDeleted", ({ reviewId }) => {
      console.log('Review deleted:', reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setReviewCount((prev) => prev - 1);
    });

    // Listen for review count updates
    socket.on("updateReviewCount", ({ count }) => {
      console.log('Review count updated:', count);
      setReviewCount(count);
    });

    // Handle socket connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to real-time updates"
      });
    });

    // Cleanup function
    return () => {
      console.log('Leaving book room:', bookId);
      socket.emit("leaveBook", bookId);
      socket.off("receiveReview");
      socket.off("reviewDeleted");
      socket.off("updateReviewCount");
      socket.off("connect_error");
    };
  }, [bookId, toast]);

  // Submit review
  const handleSubmitReview = async (content, rating) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to submit a review"
        });
        return;
      }

      // Emit the socket event to create review (backend socket handler saves and broadcasts)
      socket.emit("newReview", {
        bookId,
        review: {
          userId: user._id,
          userName: user.name,
          content,
          rating,
        },
      });

      toast({
        title: "Success",
        description: "Review submitted successfully"
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to submit review"
      });
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to delete a review"
        });
        return;
      }

  // Emit socket event to delete review (backend socket handler will delete and broadcast)
  socket.emit("deleteReview", { bookId, reviewId, userId: user._id });

      toast({
        title: "Success",
        description: "Review deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting review:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete review"
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-8 text-center">
          <p className="text-muted-foreground">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-5">
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <img
                src={`${api}${book.coverImage}`}
                alt={book.title}
                className="w-full h-[400px] object-cover rounded-lg shadow"
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg';
                }}
              />
            </div>
            <CardContent>
              <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
              <p className="leading-relaxed">{book.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {reviewCount} review{reviewCount !== 1 && "s"}
              </p>
            </CardContent>
          </div>
        </Card>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          <ReviewForm onSubmit={handleSubmitReview} />
          <div className="space-y-4 mt-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDelete={() => handleDeleteReview(review._id)}
                />
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

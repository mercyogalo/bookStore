import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { io } from 'socket.io-client';
import { useToast } from '../hooks/use-toast';
import { Navbar } from './Navbar';
import axiosInstance from '../Utils/axiosInstance';
import { Heart, Star } from 'lucide-react';

const socket = io("http://localhost:5000"); // connect to backend

const TruncatedDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (description.length <= 100) {
    return <p className="text-sm text-muted-foreground mb-2">{description}</p>;
  }

  return (
    <p className="text-sm text-muted-foreground mb-2">
      {isExpanded ? description : `${description.slice(0, 100)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary ml-2 underline"
      >
        {isExpanded ? 'Show Less' : 'More'}
      </button>
    </p>
  );
};

export const ReviewerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const token = localStorage.getItem('token');



  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get(`/book/trending`);
      const data = res.data
      setBooks(data);
      console.log(res);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };



  const fetchReviews = async (bookId) => {
    try {
      const res = await axiosInstance(`/reviews/${bookId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchBooks();

   

    socket.on("receiveReview", (review) => {
     
      if (selectedBook && review.bookId === selectedBook._id) {
        setReviews((prev) => [...prev, review]);
      }
    });

    return () => socket.off("receiveReview");
  }, [selectedBook]);

  // 📌 Join room when selecting a book
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setReviews([]);
    socket.emit("joinBook", book._id);
    fetchReviews(book._id);
  };

  // 📌 Submit a new review
  const handleSubmitReview = () => {
    if (!reviewContent.trim() || !selectedBook) return;

    const reviewData = {
      bookId: selectedBook._id,
      review: {
        content: reviewContent,
        userId: "self",
        userName: "You",
      }
    };

    socket.emit("newReview", reviewData);
    setReviewContent('');
  };

  const handleLikeToggle = async (bookId, isLiked) => {
    try {
      const endpoint = isLiked ? `/book/unlike/${bookId}` : `/book/like/${bookId}`;
      const response = await axiosInstance.post(endpoint);

      if (response.status === 200) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId
              ? { ...book, isLiked: !isLiked, likeCount: book.likeCount + (isLiked ? -1 : 1) }
              : book
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleFavoriteToggle = async (bookId, isFavorited, setBooks) => {
    try {
      const endpoint = isFavorited ? `/book/unfavorite/${bookId}` : `/book/favorite/${bookId}`;
      const response = await axiosInstance.post(endpoint);

      if (response.status === 200) {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === bookId
              ? { ...book, isFavorited: !isFavorited }
              : book
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">Read books and leave your reviews</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <Card key={book._id} className="overflow-hidden">
            <img
              src={book.coverImage || 'https://via.placeholder.com/150'}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
              <TruncatedDescription description={book.description} />
              <p className="text-sm text-muted-foreground font-semibold mb-2">Author: {book.author}</p>
              <Badge variant="default" className="mb-2">{book.reviewCount || 0} Reviews</Badge>
              <div className="flex items-center justify-between space-x-4 mb-2">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikeToggle(book._id, book.isLiked, setBooks)}
                    className={`flex items-center space-x-1 ${book.isLiked ? 'text-red-500' : 'text-gray-800 hover:text-gray-600'}`}
                  >
                    <Heart className="h-5 w-5" />
                    <span>{book.likeCount}</span>
                  </button>
                  <button
                    onClick={() => handleFavoriteToggle(book._id, book.isFavorited, setBooks)}
                    className={`flex items-center space-x-1 ${book.isFavorited ? 'text-yellow-500' : 'text-gray-800 hover:text-gray-600'}`}
                  >
                    <Star className="h-5 w-5" />
                    <span>Favorite</span>
                  </button>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSelectBook(book)}
                  disabled={selectedBook && selectedBook._id === book._id}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Section */}
      {selectedBook && (
        <Card className="mt-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Reviews for: {selectedBook.title}</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4 border p-2 rounded">
              {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
              {reviews.map((r, idx) => (
                <div key={idx} className="p-2 border-b last:border-none">
                  <strong>{r.userName}:</strong> {r.content}
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Write your review here..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />
            <Button className="mt-2" onClick={handleSubmitReview}>
              Submit Review
            </Button>
            <Button
              variant="ghost"
              className="mt-2 ml-2"
              onClick={() => setSelectedBook(null)}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

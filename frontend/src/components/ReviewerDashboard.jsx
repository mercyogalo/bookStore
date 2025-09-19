import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { io } from 'socket.io-client';
import api from '../Utils/Api';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import { Navbar } from './Navbar';
import axiosInstance from '../Utils/axiosInstance';

const socket = io("http://localhost:5000"); // connect to backend

export const ReviewerDashboard = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  // 📌 Fetch all author books
  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get(`${api}/book/trending`);
      const data = res.data
      setBooks(data);
      console.log(res);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  // 📌 Fetch reviews for a book
  const fetchReviews = async (bookId) => {
    try {
      const res = await axiosInstance(`${api}/reviews/${bookId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchBooks();

    // Listen for real-time reviews
    socket.on("receiveReview", (review) => {
      // Only add if it's for the currently selected book
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
        userId: "self", // backend should replace with logged-in user ID
        userName: "You",
      }
    };

    socket.emit("newReview", reviewData);
    setReviewContent('');
  };

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">Read books and leave your reviews</p>
      </div>

      {/* Book List */}
      <div className="space-y-4">
        {books.map((book) => (
          <Card key={book._id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-muted-foreground">Author: {book.author}</p>
                <Badge variant="default">{book.reviewCount || 0} Reviews</Badge>
              </div>
              <Button
                size="sm"
                onClick={() => handleSelectBook(book)}
                disabled={selectedBook && selectedBook._id === book._id}
              >
                Review
              </Button>
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

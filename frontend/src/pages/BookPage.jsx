import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Utils/socket";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";
import axiosInstance from "../Utils/axiosInstance";
import api from '../Utils/Api'
import { Card, CardContent } from '../components/ui/card';

export const BookPage = () => {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [book, setBook] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch book + reviews
  useEffect(() => {
    const fetchData = async () => {
      const bookRes = await axiosInstance(`${api}/book/${bookId}`);
      const bookData = await bookRes.json();
      setBook(bookData);

      const reviewRes = await axiosInstance(`${api}/reviews/${bookId}`);
      const reviewData = await reviewRes.json();
      setReviews(reviewData);
      setReviewCount(reviewData.length);
    };
    fetchData();
  }, [bookId]);

  // Setup socket connection
  useEffect(() => {
    socket.emit("joinBook", bookId);

    socket.on("receiveReview", (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
      setReviewCount((prev) => prev + 1);
    });

    socket.on("reviewDeleted", ({ reviewId }) => {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      setReviewCount((prev) => prev - 1);
    });

    socket.on("updateReviewCount", ({ reviewCount }) => {
      setReviewCount(reviewCount);
    });

    return () => {
      socket.off("receiveReview");
      socket.off("reviewDeleted");
      socket.off("updateReviewCount");
    };
  }, [bookId]);

  // Submit review
  const handleSubmitReview = (content, rating) => {
    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("newReview", {
      bookId,
      review: {
        userId: user._id,
        userName: user.name,
        content,
        rating,
      },
    });
  };

  // Delete review
  const handleDeleteReview = (reviewId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    socket.emit("deleteReview", { bookId, reviewId, userId: user._id });
  };

  return (
    <div className="container mx-auto py-8">
      {book && (
        <Card className="mb-8">
          <img src={book.cover} alt={book.title} className="w-full h-64 object-cover" />
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
            <p className="text-muted-foreground mb-4">by {book.author}</p>
            <p>{book.description}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} className="mb-4">
              <CardContent>
                <p>{review.content}</p>
                <p className="text-sm text-muted-foreground">- {review.userName}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

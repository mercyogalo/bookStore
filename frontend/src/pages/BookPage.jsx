import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Utils/socket";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";

export const BookPage = () => {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [book, setBook] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch book + reviews
  useEffect(() => {
    const fetchData = async () => {
      const bookRes = await fetch(`http://localhost:5000/api/book/${bookId}`);
      const bookData = await bookRes.json();
      setBook(bookData);

      const reviewRes = await fetch(`http://localhost:5000/api/reviews/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
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
    <div>
      {book && (
        <>
          <h1>{book.title}</h1>
          <p>by {book.author}</p>
          <p>{reviewCount} Reviews</p>
        </>
      )}

      <ReviewForm onSubmit={handleSubmitReview} />

      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onDelete={handleDeleteReview}
        />
      ))}
    </div>
  );
};

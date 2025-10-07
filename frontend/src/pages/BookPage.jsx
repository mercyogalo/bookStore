import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../Utils/socket";
import  ReviewForm from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";
import axiosInstance from "../Utils/axiosInstance";
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from "../components/Navbar";

export const BookPage = () => {
  const { id: bookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [book, setBook] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch book + reviews
  useEffect(() => {
    const fetchData = async () => {
      const Res = await axiosInstance.get(`/book/${bookId}`);
      const bookData = Res.data;
      setBook(bookData);

      const reviewRes = await axiosInstance.get(`/reviews/${bookId}`);
      const reviewData = reviewRes.data;
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
      <Navbar />
    <div className="container mx-auto py-5">
      {book && (
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Book Image */}
            <div>
              <img
                src={`${api}${book.coverImage}` }
                alt={book.title}
                className="w-full h-100 object-cover rounded-lg shadow"
              />
            </div>

            {/* Book Details */}
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
      )}

      {/* Reviews Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

        {/* Review Form */}
        <ReviewForm onSubmit={handleSubmitReview} />

      
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
  );
};

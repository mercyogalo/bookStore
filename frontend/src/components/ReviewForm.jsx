import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "@/Utils/socket";
import api from "@/Utils/Api";
import { ReviewForm } from "../components/ReviewForm";
import { ReviewCard } from "../components/ReviewCard";

export default function BookDetail() {
  const { id: bookId } = useParams(); // URL param for book ID
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // 1. Fetch initial reviews from REST
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${bookId}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();

    // 2. Join book socket room
    socket.emit("joinBook", bookId);

    // 3. Listen for new reviews
    socket.on("receiveReview", (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
    });

    // 4. Listen for deleted reviews
    socket.on("reviewDeleted", ({ reviewId }) => {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    });

    // Cleanup when leaving the page
    return () => {
      socket.off("receiveReview");
      socket.off("reviewDeleted");
    };
  }, [bookId]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Review form */}
      <ReviewForm bookId={bookId} />

      {/* Review list */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        ) : (
          <p className="text-muted-foreground text-center">
            No reviews yet. Be the first to add one!
          </p>
        )}
      </div>
    </div>
  );
}

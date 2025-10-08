import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../Utils/socket";
import axiosInstance from "../Utils/axiosInstance";
import { ReviewCard } from "../components/ReviewCard";

export default function ReviewForm() {
  const { id: bookId } = useParams(); // URL param for book ID
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
   

    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/reviews/${bookId}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };
    fetchReviews();

   
    socket.emit("joinBook", bookId);

    
    socket.on("receiveReview", (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
    });

    
    socket.on("reviewDeleted", ({ reviewId }) => {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    });

   
    return () => {
      socket.off("receiveReview");
      socket.off("reviewDeleted");
    };
  }, [bookId]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
    
      <ReviewForm bookId={bookId} />

     
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

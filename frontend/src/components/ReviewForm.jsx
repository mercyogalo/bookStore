import { useState } from "react";

// Simple review form component used by pages like `BookPage`.
// Props:
// - onSubmit(content, rating): callback when user submits a review
export default function ReviewForm({ onSubmit }) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit && onSubmit(content.trim(), rating);
    setContent("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <label className="block">
        <span className="text-sm font-medium">Your review</span>
        <textarea
          className="mt-2 w-full rounded-md border p-2"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
        />
      </label>

      <label className="flex items-center space-x-3">
        <span className="text-sm">Rating</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-md border p-1"
        >
          <option value={5}>5</option>
          <option value={4}>4</option>
          <option value={3}>3</option>
          <option value={2}>2</option>
          <option value={1}>1</option>
        </select>
      </label>

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 rounded bg-primary text-white">
          Submit Review
        </button>
      </div>
    </form>
  );
}

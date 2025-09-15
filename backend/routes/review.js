const express = require("express");
const Review = require("../models/Review");
const router = express.Router();
const protect = require("../middlewares/auth");

// Get all reviews for a book
router.get("/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId })
      .sort({ createdAt: -1 })
      .lean();

    const reviewMap = {};
    reviews.forEach(r => (reviewMap[r._id] = { ...r, replies: [] }));

    const rootReviews = [];
    reviews.forEach(r => {
      if (r.parentId) {
        reviewMap[r.parentId]?.replies.push(reviewMap[r._id]);
      } else {
        rootReviews.push(reviewMap[r._id]);
      }
    });

    res.json(rootReviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a review
router.post("/:bookId",protect,  async (req, res) => {
  try {
    const newReview = new Review({
      bookId: req.params.bookId,
      userId: req.body.userId,
      userName: req.body.userName,
      content: req.body.content,
      rating: req.body.rating || 5,
      parentId: req.body.parentId || null,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a review (only owner)
router.delete("/:reviewId",protect,  async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully", reviewId: review._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

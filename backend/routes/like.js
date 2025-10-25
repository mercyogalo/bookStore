const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Books");
const Like = require("../models/Likes");
const protect = require("../middlewares/auth");

const router = express.Router();


router.post("/likeBook/:id/like", protect, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

   
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

   
    const existingLike = await Like.findOne({ user: userId, book: bookId });

    if (existingLike) {
    
      await existingLike.deleteOne();
      return res.json({ message: "Unliked", liked: false });
    } else {
     
      await Like.create({ user: userId, book: bookId });
      return res.json({ message: "Liked", liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/getLikes/:id", protect, async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

  
    const likeCount = await Like.countDocuments({ book: bookId });

  
    const hasLiked = await Like.exists({ user: req.user._id, book: bookId });

    res.json({ likeCount, hasLiked: !!hasLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/getLikes/:id/users", protect, async (req, res) => {
  try {
    const bookId = req.params.id;

    const likes = await Like.find({ book: bookId }).populate("user", "name avatar");
    res.json({ count: likes.length, users: likes.map(like => like.user) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

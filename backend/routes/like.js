const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Books");
const User = require("../models/User");
const router = express.Router();
const Like=require("../models/Likes");
const protect = require("../middlewares/auth");




router.post("/:id/like", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user._id;
    const alreadyLiked = book.likes.includes(userId);

    if (alreadyLiked) {
      book.likes.pull(userId);
    } else {
      book.likes.push(userId);
    }

    book.likeCount = book.likes.length;
    await book.save();

    res.json({ message: alreadyLiked ? "Unliked" : "Liked", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id/likes", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(req.params.id).select("likes likeCount");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const hasLiked = book.likes.includes(req.user._id);

    res.json({ likeCount: book.likeCount, hasLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;
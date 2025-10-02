const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Books");
const Review = require("../models/Review");
const Favorite = require("../models/Favorite");
const User = require("../models/User");
const router = express.Router();
const protect = require("../middlewares/auth");
const checkRole = require("../middlewares/role");
const upload = require("../middlewares/upload"); // Multer middleware


router.post(
  "/createBook",
  protect,
  checkRole(["author"]),
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const { title, author, yearPublished, link, description, genre, chapters } = req.body;

      if (!title || !author || !link || !description) {
        return res.status(400).json({ message: "Please enter all required fields" });
      }

      const book = await Book.create({
        title,
        author,
        yearPublished,
        link,
        description,
        coverImage: req.file ? `/api/uploads/${req.file.filename}` : null,
        genre,
        chapters,
        createdBy: req.user._id,
      });

      res.status(201).json({ message: "Book added successfully", book });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error kindly try again" });
    }
  }
);


router.get("/allBooks", protect, checkRole(["author"]), async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});


router.get("/featured", protect, async (req, res) => {
  try {
    const books = await Review.aggregate([
      { $group: { _id: "$bookId", reviewCount: { $sum: 1 } } },
      { $sort: { reviewCount: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          _id: "$book._id",
          title: "$book.title",
          author: "$book.author",
          description: "$book.description",
          coverImage: "$book.coverImage",
          genre: "$book.genre",
          createdAt: "$book.createdAt",
          reviewCount: 1,
        },
      },
    ]);

    res.json(books);
  } catch (error) {
    console.error("Error fetching featured books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// NEW ARRIVALS
// =========================
router.get("/newArrivals", protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(8);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/trending", protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ likeCount: -1 }).limit(8);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});


router.post("/favorite/:bookId", protect, async (req, res) => {
  try {
    const favorite = await Favorite.create({
      user: req.user._id,
      book: req.params.bookId,
    });
    res.status(200).json({ message: "Successfully favorited this book" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Book already in favorites" });
    }
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});

router.get("/favorites", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate("book");
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});

router.delete("/unfavorite/:bookId", protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });
    res.status(200).json({ message: "Book removed from favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});



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

// =========================
// GET BOOK BY ID
// =========================
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("The error is:", error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});


router.put(
  "/updateBook/:id",
  protect,
  checkRole(["author"]),
  upload.single("coverImage"),
  async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (req.user.role === "author" && book.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only update your own books" });
      }

      if (req.file) {
        req.body.coverImage = `/api/uploads/${req.file.filename}`;
      }

      Object.assign(book, req.body);
      const updatedBook = await book.save();

      res.status(200).json({ message: "Book details updated successfully", updatedBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error try again" });
    }
  }
);


router.delete("/deleteBook/:id", protect, checkRole(["author"]), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (req.user.role === "author" && book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own books" });
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error try again" });
  }
});

module.exports = router;

const express = require("express");
const Book = require("../models/Books");
const router = express.Router();
const protect = require("../middlewares/auth");
const checkRole = require("../middlewares/role");


router.post('/createBook', protect, checkRole(["author"]), async (req, res) => {
  const { title, author, yearPublished, link, description, coverImage, genre, chapters } = req.body;
  try {
    if (!title || !author || !link || !description) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    const book = await Book.create({
      title,
      author,
      yearPublished,
      link,
      description,
      coverImage,
      genre,
      chapters,
      createdBy: req.user._id
    });

    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});

// Get all Books
router.get('/allBooks', protect, checkRole(["author"]), async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});

// Update Book
router.put('/updateBook/:id', protect, checkRole(["author"]), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (req.user.role === "author" && book.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own books" });
    }

    Object.assign(book, req.body);
    const updatedBook = await book.save();

    res.status(200).json({ message: "Book details updated successfully", updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error try again" });
  }
});

// Delete Book
router.delete('/deleteBook/:id', protect, checkRole(["author"]), async (req, res) => {
  try {
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

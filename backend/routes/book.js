const express = require("express");
const Book = require("../models/Books");
const Review= require("../models/Review");
const router = express.Router();
const protect = require("../middlewares/auth");
const checkRole = require("../middlewares/role");


router.post('/createBook', protect, checkRole(["author"]), async (req, res) => {
  const { title, author, yearPublished,link, description, coverImage, genre, chapters } = req.body;
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

// Get all Books of a specific author
router.get('/allBooks', protect, checkRole(["author"]), async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});
//Get specific book
router.get('/:id', protect, async(req,res)=>{
  try {
    const book=await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
      console.error("The error is:",error);
      res.status(500).json({message:"Server error kindly try again"});
  }
})
// Update Book of a specific author
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

// Delete Book of a specific author
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


// Featured Books = books with the most reviews
router.get("/featured", protect,async (req, res) => {
  try {
    const books = await Review.aggregate([
      {
        $group: {
          _id: "$bookId",
          reviewCount: { $sum: 1 }
        }
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "books",              // collection name in Mongo
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
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
          reviewCount: 1
        }
      }
    ]);

    res.json(books);
  } catch (error) {
    console.error("Error fetching featured books:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// New Arrivals (latest createdAt)
router.get("/newArrivals",protect, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(8);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Trending (most likes)
router.get("/trending",protect,  async (req, res) => {
  try {
    const books = await Book.find().sort({ likeCount: -1 }).limit(8);
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/:id/like", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user._id;
    const alreadyLiked = book.likes.includes(userId);

    if (alreadyLiked) {
      book.likes.pull(userId); // unlike
    } else {
      book.likes.push(userId); // like
    }

    book.likeCount = book.likes.length;
    await book.save();

    res.json({ message: alreadyLiked ? "Unliked" : "Liked", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

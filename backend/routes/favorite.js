const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Books");
const User = require("../models/User");
const router = express.Router();
const protect = require("../middlewares/auth");
const Favorite=require("../models/Favorite");




router.post("/favorite/:bookId", protect, async (req, res) => {
  
  try {
    const { bookId }=req.params;
    const { userId }=req.body;

    if(!bookId || !userId ){
       return res.status(400).json({ message: "Missing userId or bookId" });
    }

    const existing = await Favorite.findOne({ user: userId, book: bookId });
    if (existing) {
      return res.status(200).json({ message: "Book already favorited" });
    }

    const favorite = await Favorite.create({
      user: userId, 
      book: bookId,
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
    const { bookId }=req.params;
    const { userId }=req.body;

    if(!bookId || !userId ){
       return res.status(400).json({ message: "Missing userId or bookId" });
    }
    
    await Favorite.findOneAndDelete({
      user: userId,
      book: bookId,
    });
    res.status(200).json({ message: "Book removed from favorites successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error kindly try again" });
  }
});

module.exports=router;



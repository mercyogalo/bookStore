const express = require("express");
const User= require("../models/User");
const Book=require('../models/Books');
const Favorite=require('../models/Favorite');
const router = express.Router();
const protect=require('../middlewares/auth');

//add book to favorite
router.post('/favorite/:bookId', protect, async(req, res)=>{
    try {
       const favorite=await Favorite.create({
        user:req.user._id,
        book:req.params.bookId
       });
       res.status(200).json({message:"Successfully favorite this book"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error kindly try again"});
    }
})

//get all favorites in the favorites page
router.get('/favorites', protect, async (req,res)=>{
    try {
        const favorites=await Favorite.find({user:req.user._id}).populate("book");
        res.status(200).json(favorites)
    } catch (error) {
        if(error.code===11000){
            return res.status(400).json({ message: "Book already in favorites" })
        }
        console.error(error);
        res.status(500).json({message:"Server error kindly try again"});
    }
})

//remove/delete from favorite
router.delete('/favorite/:bookId', protect, async(req,res)=>{
    try {
       await Favorite.findOneAndDelete({
        user:req.user._id,
        book:req.params.bookId
       });
        res.status(200).json({message:"Book removed from favorites successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error kindly try again"})
    }

})





module.exports=router;
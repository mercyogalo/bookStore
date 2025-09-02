const express = require("express");
const Book = require("../models/Book");
const router = express.Router();
const generateToken = require("../Utils/token");
const protect=require('../middlewares/auth');




router.post('/createBook', protect, async (req,res)=>{
    const { title, author, yearPublished, link, description, coverImage, genre}=req.body;
    try {
         if(!title || !author || !link || !description){
            res.status(400).json({message:"Please enter all fields"});
         }

         const book=await Book.create({ title, author, yearPublished, link, description, coverImage, genre});
         res.status(200).json({message:"Book added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error kindly try again"});
    }
   
    
})


router.put('/updateBook:id', protect, async (req,res)=>{

    
})


router.delete('/deleteBook:id', protect, async (req,res)=>{
    
})

module.exports=router;
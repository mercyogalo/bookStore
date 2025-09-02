const express = require("express");
const Book = require("../models/Book");
const router = express.Router();
const generateToken = require("../Utils/token");
const protect=require('../middlewares/auth');
const checkRole=require('../middlewares/role');




router.post('/createBook', protect,checkRole(["author"]), async (req,res)=>{
    const { title, author, yearPublished, link, description, coverImage, genre}=req.body;
    try {
        if(req.user.role!=="author"){
            res.status(403).json({message:"Only authors can add books"})
        }
         if(!title || !author || !link || !description){
            res.status(400).json({message:"Please enter all fields"});
         }

         const book=await Book.create({ title, author, yearPublished, link, description, coverImage, genre, createdBy: req.user._id });
         res.status(200).json({message:"Book added successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error kindly try again"});
    }
   
    
})


router.put('/updateBook:id', protect,checkRole(["author"]) ,async (req,res)=>{
    try {
        const book=await Book.findById(req.params.id);

        if(!book){
            res.status(404).json({message:"Book not found"});
        }

        if(req.user.role=="author" && book.createdBy.toString()== !req.user._id.toString()){
            res.status(403).json({message:"You can only update your own books"});
        }

        Object.assign(book, req.body);
        const updateBook=await book.save();

        res.status(200).json({message:"Book details updated successfully"});


    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error try again"});
    }
})


router.delete('/deleteBook:id', protect,checkRole(["author"]),  async (req,res)=>{
    try {

        const book=await Book.findById(req.params.id);

        if(!book){
            res.status(404).json({message:"Book not found"});
        }

        if(req.user.role=="author" && book.createdBy.toString()== !req.user._id.toString()){
            res.status(403).json({message:"You can only delete your own books"});
        }

        await book.deleteOne();

        res.status(200).json({message:"Book deleted successfully"});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error try again"});
    }
})

module.exports=router;
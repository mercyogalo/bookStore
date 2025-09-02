const mongoose=require("mongoose");
const User=require("./User");

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true
    },
    yearPublished:{
        type:Number,
        required:true
    },
    link:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        default: "default-book.png"
    },
    genre:{
        type:String
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    
    
})
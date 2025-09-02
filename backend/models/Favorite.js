const mongoose=require("mongoose");
const User=require("./User");


const favoriteSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


const Favorite=("Favorite", favoriteSchema)

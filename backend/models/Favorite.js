const mongoose=require("mongoose");
const User=require("./User");
const Book=require("./Books");


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

favoriteSchema.index(
    {
        user:1,
        book:1
    },
    {
        unique:true
    }
)

const Favorite=("Favorite", favoriteSchema)

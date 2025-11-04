const mongoose = require("mongoose");
const User = require("./User");
const Like=require("./Likes");
const Favorite=require("./Favorite");
const Review=require("./Review");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  yearPublished: {
    type: Number,
    default: 2027
  },
  link: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: "default-book.png"
  },
  genre: {
    type: String
  },
  chapters: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {timestamps:true, toJSON:{virtuals: true}, toOBJECT:{virtuals:true}});

bookSchema.virtual("likes",{
    ref:"Like",
    localField:"_id",
    foreignField:"book",
});


bookSchema.virtual("favorites",{
   ref:"Favorite",
    localField:"_id",
    foreignField:"book",
});


bookSchema.virtual("reviews",{
   ref:"Review",
    localField:"_id",
    foreignField:"book",
});




module.exports = mongoose.model("Book", bookSchema);

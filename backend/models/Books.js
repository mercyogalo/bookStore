const mongoose = require("mongoose");
const User = require("./User");
const Like=require("./Likes");

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
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  likeCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
}, {timestamps:true});


bookSchema.pre("save", function (next) {
  this.likeCount = this.likes.length;
  next();
});

module.exports = mongoose.model("Book", bookSchema);

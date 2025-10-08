const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: null }
}, {timestamps:true});

module.exports = mongoose.model("Review", reviewSchema);

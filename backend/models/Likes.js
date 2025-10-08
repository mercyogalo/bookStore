const mongoose=require("mongoose");
const { Schema }=mongoose;
const User=require("../models/User");
const Book=require("../models/Books");

const likeSchema=new Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true },
    book:{ type:mongoose.Schema.Types.ObjectId, ref:"Book", required:true}
}, {timeStamps:true});

likeSchema.index({user:1, book:1}, {unique:true});

module.exports=mongoose.model("Like", likeSchema);
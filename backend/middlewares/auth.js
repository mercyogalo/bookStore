const express=require("express");
const User=require("../models/User");
const jwt=require("jsonwebtoken");


const protect=async (req, res, next) =>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const token=req.headers.authorization.split(" ")[1];
            const decoded=jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (error) {
            console.log("Error failed in authorization: ", error);
            res.status(401).json({message:"Token failed, not authorized"});
        }
    }
}

module.exports=protect;
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const generateToken = require("../Utils/token");
const protect=require('../middlewares/auth');


router.post("/register", async (req, res) => {
  const { name, email, role,  password } = req.body;
  try {
    if (!name || !password || !email || !role ) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This user already exists" });
    }

    const user = await User.create({ name, email, role, password });
    const token = generateToken(user._id);

    res.status(201).json({
      userID: user._id,
      username: user.name,
      email: user.email,
      role:user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error in signup" });
  }
});

// LOGIN user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming body:", req.body);
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      userID: user._id,
      username: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in login" });
  }
});

//user profile
router.get('/profile', protect, async (req,res)=>{
  try {
    
    const user=User.findById(req.params.id);
    res.status(200).json({
      userID: req.user._id,
      username: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Server error in profile fetch"})
  }
})

module.exports = router;

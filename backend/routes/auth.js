const express = require("express");
const User = require("../models/User");
const router = express.Router();
const generateToken = require("../Utils/token");
const protect = require("../middlewares/auth");
const upload=require("../middlewares/upload");


router.post("/register", upload.single("avatar"), async (req, res) => {
  const { name, email, role, password, username } = req.body;
  try {
    if (!name || !password || !email || !role || !username) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This user already exists" });
    }

  
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.create({ 
      name, 
      username, 
      email, 
      role, 
      password, 
      avatar 
    });

    res.status(201).json({
      userID: user._id,
      name:user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user), 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error in signup" });
  }
});




router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      userID: user._id,
      name:user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar:user.avatar,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in login" });
  }
});


router.get("/profile", protect, async (req, res) => {
  try {
    res.status(200).json({
      userID: req.user._id,
      username: req.user.username,
      name:req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar:req.user.avatar,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error in profile fetch" });
  }
});

module.exports = router;

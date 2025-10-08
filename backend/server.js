const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const path=require("path");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const reviewRoutes = require("./routes/review"); 

dotenv.config();

const app = express();

const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));


mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB running"))
  .catch(err => console.log(`Error: ${err}`));

const Review = require("./models/Review");


// Socket.IO for real-time reviews
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  
  socket.on("joinBook", (bookId) => {
    socket.join(bookId);
    console.log(`User ${socket.id} joined book ${bookId}`);
  });

 
  socket.on("newReview", async (data) => {
    const { bookId, review } = data;
    try {
      const newReview = new Review({
        bookId,
        userId: review.userId,
        userName: review.userName,
        content: review.content,
        rating: review.rating || 5,
        parentId: review.parentId || null,
      });

      await newReview.save();
      io.to(bookId).emit("receiveReview", newReview);
    } catch (err) {
      console.error("Error saving review:", err);
      socket.emit("reviewError", { message: "Failed to save review" });
    }
  });

  
  socket.on("deleteReview", async (data) => {
    const { bookId, reviewId, userId } = data;
    try {
      const review = await Review.findById(reviewId);
      if (!review) throw new Error("Review not found");

     
      // Only allow the owner to delete
      if (review.userId.toString() !== userId) {
        return socket.emit("reviewError", { message: "You can only delete your own review" });
      }

      await review.deleteOne();
      io.to(bookId).emit("reviewDeleted", { reviewId });
    } catch (err) {
      console.error("Error deleting review:", err);
      socket.emit("reviewError", { message: "Failed to delete review" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

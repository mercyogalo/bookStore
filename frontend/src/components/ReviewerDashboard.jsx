import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useToast } from "../hooks/use-toast";
import { Navbar } from "./Navbar";
import axiosInstance from "../Utils/axiosInstance";
import { BookCard } from "./BookCard"; 


const socket = io("http://localhost:5000"); // connect to backend

export const ReviewerDashboard = () => {
  const [books, setBooks] = useState([]);
  const { toast } = useToast();

  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get(`/book/trending`);
      const data = res.data;
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      toast({
        title: "Error",
        description: "Could not load books",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBooks();

   
    socket.on("bookUpdated", (updatedBook) => {
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b._id === updatedBook._id ? updatedBook : b))
      );
    });

    return () => {
      socket.off("bookUpdated");
    };
  }, []);

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Reviewer Dashboard</h1>
        <p className="text-muted-foreground">
          Browse books, view details, and engage with reviews
        </p>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <BookCard key={book._id} className="mr-5"book={book} />
        ))}
      </div>
    </div>
  );
};

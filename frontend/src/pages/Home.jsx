import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BookList } from "../components/BookList";

export const Home = ({ onBookClick, onLike, onFavorite }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/book");
        const data = await res.json();

        // You can customize filters
        setFeaturedBooks(data.slice(0, 4)); // first 4 as featured
        setNewArrivals(data.slice(-4));     // last 4 as new arrivals
        setTrendingBooks(data.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)); // top reviewed
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12 bg-gradient-to-br from-background to-accent/5 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to BookReview</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing books, share your thoughts, and connect with fellow readers
        </p>
      </div>

      {/* Featured */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span>Featured Books</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookList
              books={featuredBooks}
              onBookClick={onBookClick}
              onLike={onLike}
              onFavorite={onFavorite}
            />
          </CardContent>
        </Card>
      </section>

      {/* New Arrivals */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Clock className="h-6 w-6 text-green-500" />
              <span>New Arrivals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookList
              books={newArrivals}
              onBookClick={onBookClick}
              onLike={onLike}
              onFavorite={onFavorite}
            />
          </CardContent>
        </Card>
      </section>

      {/* Trending */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-orange-500" />
              <span>Trending This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookList
              books={trendingBooks}
              onBookClick={onBookClick}
              onLike={onLike}
              onFavorite={onFavorite}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, TrendingUp, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { BookList } from "../components/BookList";

export const Home = ({ onBookClick, onLike, onFavorite }) => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);

  const testimonials = [
    {
      name: "Jane Doe",
      text: "BookReview has completely changed how I discover new books. The reviews are insightful and the community is amazing!",
    },
    {
      name: "John Smith",
      text: "I love being able to track trending books every week. Makes it so easy to decide what to read next.",
    },
    {
      name: "Mary W.",
      text: "The platform is clean and easy to use. Writing reviews feels rewarding and I get to connect with fellow readers.",
    },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [featuredRes, trendingRes, allBooksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/book/featured"),
          axios.get("http://localhost:5000/api/book/trending"),
          axios.get("http://localhost:5000/api/book/newArrivals"),
        ]);

        setFeaturedBooks(featuredRes.data);
        setTrendingBooks(trendingRes.data);

        // Last 4 from all books as new arrivals
        const allBooks = allBooksRes.data;
        setNewArrivals(allBooks.slice(-4).reverse());
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16 bg-white">
        <div className="space-y-6 px-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Discover, Review & Share Books
          </h1>
          <p className="text-lg text-gray-600">
            Dive into trending stories, explore new arrivals, and join a
            community of passionate readers.
          </p>
          <Button className="bg-amber-800 text-white hover:bg-amber-900">
            Get Started
          </Button>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
            alt="Books"
            className="rounded-none shadow-md object-cover w-full h-96"
          />
        </div>
      </section>

      {/* Trending */}
      <section>
        <Card className="border border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <TrendingUp className="h-6 w-6 text-amber-700" />
              Trending This Week
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

      {/* Featured */}
      <section>
        <Card className="border border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <Sparkles className="h-6 w-6 text-amber-700" />
              Featured Books
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
        <Card className="border border-gray-200 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-gray-900">
              <Clock className="h-6 w-6 text-amber-700" />
              New Arrivals
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

      {/* Testimonials Carousel */}
      <section className="bg-gray-50 py-16 rounded-none text-center w-full">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">
          What Readers Say
        </h2>
        <Carousel className="max-w-2xl mx-auto">
          <CarouselContent>
            {testimonials.map((t, index) => (
              <CarouselItem key={index}>
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                  <p className="text-lg italic text-gray-700 mb-4">
                    “{t.text}”
                  </p>
                  <p className="font-semibold text-amber-700">— {t.name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-6">
            <CarouselPrevious className="bg-amber-800 text-white hover:bg-amber-900" />
            <CarouselNext className="bg-amber-800 text-white hover:bg-amber-900" />
          </div>
        </Carousel>
      </section>

     
    </div>
  );
};

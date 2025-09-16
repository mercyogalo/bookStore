import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, Gem } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BookList } from './BookList';

export const PopularBooks = ({ onBookClick, onLike, onFavorite }) => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [newestBooks, setNewestBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [trendingRes, topRatedRes, newestRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books/trending'),
          axios.get('http://localhost:5000/api/books/top-rated'),
          axios.get('http://localhost:5000/api/books/newest')
        ]);

        setTrendingBooks(trendingRes.data);
        setTopRatedBooks(topRatedRes.data);
        setNewestBooks(newestRes.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Popular Books</h1>
        <p className="text-muted-foreground">
          Discover what everyone's reading and loving
        </p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Top Rated</span>
          </TabsTrigger>
          <TabsTrigger value="newest" className="flex items-center space-x-2">
            <Gem className="h-4 w-4" />
            <span>Newest Uploads</span>
          </TabsTrigger>
        </TabsList>

        {/* Trending */}
        <TabsContent value="trending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
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
        </TabsContent>

        {/* Top Rated */}
        <TabsContent value="top-rated">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Highest Rated Books</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookList
                books={topRatedBooks}
                onBookClick={onBookClick}
                onLike={onLike}
                onFavorite={onFavorite}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newest Uploads */}
        <TabsContent value="newest">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gem className="h-5 w-5 text-brown-600" />
                <span>Newest Uploads</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookList
                books={newestBooks}
                onBookClick={onBookClick}
                onLike={onLike}
                onFavorite={onFavorite}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

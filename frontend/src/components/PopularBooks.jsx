import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Award, Gem } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BookList } from './BookList';
import { Navbar } from './Navbar';
import axiosInstance from '../Utils/axiosInstance';

export const PopularBooks = ({ onBookClick, onLike, onFavorite }) => {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [topRatedBooks, setTopRatedBooks] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [trendingRes, topRatedRes, newestRes] = await Promise.all([
          axiosInstance.get('/books/trending'),
          axiosInstance.get('/books/top-rated'),
          axiosInstance.get('/books/newest'),
        ]);

        setTrendingBooks(trendingRes.data);
        setTopRatedBooks(topRatedRes.data);
        setHiddenGems(newestRes.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="space-y-10 w-full px-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Popular Books</h1>
        <p className="text-muted-foreground">
          Discover what everyone's reading and loving
        </p>
      </div>

      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto">
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Top Rated</span>
          </TabsTrigger>
          <TabsTrigger value="hidden-gems" className="flex items-center space-x-2">
            <Gem className="h-4 w-4" />
            <span>Hidden Gems</span>
          </TabsTrigger>
        </TabsList>

        {/* Trending */}
        <TabsContent value="trending" className="mt-6">
          <Card className="w-full shadow-none border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
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
        <TabsContent value="top-rated" className="mt-6">
          <Card className="w-full shadow-none border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
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

        {/* Hidden Gems */}
        <TabsContent value="hidden-gems" className="mt-6">
          <Card className="w-full shadow-none border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Gem className="h-5 w-5 text-purple-500" />
                <span>Hidden Gems</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookList
                books={hiddenGems}
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

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({ authors: 0, reviewers: 0 });
  const [loading, setLoading] = useState({ books: true, popular: true, favorites: true, stats: true });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        const data = await response.json();
        console.log('Fetched books:', data); // Debugging: Check the response data
        setBooks(data);
      } catch (error) {
        toast({ title: 'Failed to fetch books', status: 'error' });
      } finally {
        setLoading((prev) => ({ ...prev, books: false }));
      }
    };

    const fetchPopularBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books/popular');
        const data = await response.json();
        setPopularBooks(data.sort((a, b) => b.likes - a.likes));
      } catch (error) {
        toast({ title: 'Failed to fetch popular books', status: 'error' });
      } finally {
        setLoading((prev) => ({ ...prev, popular: false }));
      }
    };

    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        toast({ title: 'Failed to fetch favorites', status: 'error' });
      } finally {
        setLoading((prev) => ({ ...prev, favorites: false }));
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        toast({ title: 'Failed to fetch stats', status: 'error' });
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    fetchBooks();
    fetchPopularBooks();
    fetchFavorites();
    fetchStats();
  }, [toast]);

  return (
    <div className="space-y-8 p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading.stats ? (
          <Skeleton className="h-24" />
        ) : (
          <>
            <Card>
              <CardContent>
                <CardTitle>Authors</CardTitle>
                <p className="text-2xl font-bold">{stats.authors}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <CardTitle>Reviewers</CardTitle>
                <p className="text-2xl font-bold">{stats.reviewers}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Books Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading.books
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)
            : books.length === 0 ? (
              <p className="text-center text-muted-foreground">No books available at the moment.</p>
            ) : (
              books.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/150'}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-t-md"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="mt-2 w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Popular Books Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Popular Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading.popular
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)
            : popularBooks.map((book) => (
                <Card key={book.id}>
                  <CardHeader>
                    <img
                      src={book.coverImage || 'https://via.placeholder.com/150'}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-t-md"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <p className="text-sm text-muted-foreground">Likes: {book.likes}</p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Favorites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading.favorites
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48" />)
              : favorites.map((book) => (
                  <Card key={book.id}>
                    <CardHeader>
                      <img
                        src={book.coverImage || 'https://via.placeholder.com/150'}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-t-md"
                      />
                    </CardHeader>
                    <CardContent>
                      <CardTitle>{book.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

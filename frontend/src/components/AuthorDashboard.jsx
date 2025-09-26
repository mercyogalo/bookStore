import { useState, useEffect } from 'react'; 
import { Upload, Eye, BarChart3, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';
import axiosInstance from '../Utils/axiosInstance';
import { Navbar } from './Navbar';

export const AuthorDashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState({
    title: '',
    description: '',
    genre: '',
    coverImage: '',
    chapters: '',
    author: '',
    yearPublished: '',
    link: ''
  });


 
 
  const fetchBooks = async () => {
    try {
      const res = await axiosInstance.get(`/book/allBooks`);
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Validate required fields
      if (!bookForm.title || !bookForm.description || !bookForm.genre || !bookForm.author) {
        alert('Please fill in all required fields.');
        setIsUploading(false);
        return;
      }

      // Send POST request
      const response = await axiosInstance.post(`/book/createBook`, bookForm);
       alert(response.data);
      if (response.status === 201) {
        alert('Book created successfully!');
        fetchBooks();
      } else {
        alert('Failed to create book. Please try again.');
      }
    } catch (error) {
      console.error('Error creating book:', error.response?.data || error.message);
      alert('An error occurred while creating the book. Please check the console for details.');
    } finally {
      setIsUploading(false);
      setBookForm({
          title: '',
          description: '',
          genre: '',
          coverImage: '',
          chapters: '',
          author: '',
          yearPublished: '',
          link: ''
        });
    }
  };

 
  const handleDelete = async (id) => {
   
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await axiosInstance.delete(`/book/deleteBook/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error.response?.data || error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Author Dashboard</h1>
        <p className="text-muted-foreground">Manage your books and connect with readers</p>
      </div>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{books.length}</div>
            <div className="text-sm text-muted-foreground">Published Books</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Book</TabsTrigger>
          <TabsTrigger value="manage">Manage Books</TabsTrigger>
        </TabsList>

      
        <TabsContent value="upload">
          <Card className="w-full md:w-3/4 lg:w-3/4 mx-auto"> 
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Author Name" value={bookForm.author} onChange={e => setBookForm(p => ({...p, author: e.target.value}))} required />
                <Input placeholder="Book Title" value={bookForm.title} onChange={e => setBookForm(p => ({...p, title: e.target.value}))} required />
                <Input placeholder="Genre" value={bookForm.genre} onChange={e => setBookForm(p => ({...p, genre: e.target.value}))} required />
                <Input type="url" placeholder="Book Link" value={bookForm.link} onChange={e => setBookForm(p => ({...p, link: e.target.value}))} />
                <Input type="url" placeholder="Cover Image URL" value={bookForm.coverImage} onChange={e => setBookForm(p => ({...p, coverImage: e.target.value}))} />
                <Input placeholder="Year Published" value={bookForm.yearPublished} onChange={e => setBookForm(p => ({...p, yearPublished: e.target.value}))} />
                <Textarea placeholder="Description" value={bookForm.description} onChange={e => setBookForm(p => ({...p, description: e.target.value}))} required />
                <Textarea placeholder="Sample Chapters" value={bookForm.chapters} onChange={e => setBookForm(p => ({...p, chapters: e.target.value}))} required />
                
                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? 'Saving...' : 'Upload Book'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

      
        <TabsContent value="manage">
          <div className="space-y-4">
            {books.map((book) => (
              <Card key={book._id}>
                <CardContent className="p-6">
                
                  <div className="flex gap-6">
                   
                    <div className="w-32 h-44 flex-shrink-0">
                      <img
                        src={book.coverImage || ''}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    
                    <div className="flex flex-col justify-between flex-1">
                     
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{book.title}</h3>
                          <Badge variant="default">Published</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{book.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Author: {book.author}</span>
                          <span>Genre: {book.genre}</span>
                          <span>Year: {book.yearPublished}</span>
                        </div>
                      </div>

                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Link to={`/update-book/${book._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(book._id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

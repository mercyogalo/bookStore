import { useState } from 'react'; 
import { Upload, Eye, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../Utils/Api';

export const AuthorDashboard = ({ onUploadBook }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    description: '',
    genre: '',
    coverImage: '',
    chapters: '',
    author:'',
    yearPublished:'',
    link:''
    
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
   
    setTimeout(() => {
      onUploadBook(bookForm);
      setBookForm({
        title: '',
        description: '',
        genre: '',
        coverImage: '',
        chapters: '',
        author:'',
       yearPublished:'',
        link:''
      });



      //try {
     //   const res=await axios.post(`${api}/`)
     // } catch (error) {
        
    //  }






      setIsUploading(false);
    }, 1000);
  };



  try {
    const books= axios.get()
  } catch (error) {
    
  }






  const mockBooks = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `My Book ${i + 1}`,
    description: 'An engaging story that captures the reader\'s imagination...',
    genre: 'Fiction',
    rating: 4.2 + Math.random() * 0.8,
    reviewCount: Math.floor(Math.random() * 50) + 10,
    likes: Math.floor(Math.random() * 200) + 50,
    views: Math.floor(Math.random() * 1000) + 200,
    status: i === 0 ? 'Published' : i === 1 ? 'Draft' : 'Under Review'
  }));

  const mockStats = {
    totalBooks: 3,
    totalViews: 1247,
    totalLikes: 89,
    totalReviews: 23
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Author Dashboard</h1>
        <p className="text-muted-foreground">Manage your books and connect with readers</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{mockStats.totalBooks}</div>
            <div className="text-sm text-muted-foreground">Published Books</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{mockStats.totalViews}</div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{mockStats.totalLikes}</div>
            <div className="text-sm text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{mockStats.totalReviews}</div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
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


                 <div>
                 <label className="text-sm font-medium">Author Name</label>
                  <Input
                    value={bookForm.author}
                    onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                    required
                  />
                </div>
                

                <div>
                  <label className="text-sm font-medium">Book Title</label>
                  <Input
                    value={bookForm.title}
                    onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter book title"
                    required
                  />
                </div>

               
                  <div>
                  <label className="text-sm font-medium">Genre</label>
                  <Input
                    value={bookForm.genre}
                    onChange={(e) => setBookForm(prev => ({ ...prev, genre: e.target.value }))}
                    placeholder="e.g., Fiction, Mystery, Romance"
                    required
                  />
                </div>

                 <div>
                  <label className="text-sm font-medium">Book link</label>
                  <Input
                    value={bookForm.link}
                    onChange={(e) => setBookForm(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://example.com/book.com"
                    type="url"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Cover Image URL</label>
                  <Input
                    value={bookForm.coverImage}
                    onChange={(e) => setBookForm(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://example.com/cover.jpg"
                    type="url"
                  />
                </div>
                 

                 <div>
                 <label className="text-sm font-medium">Year of publication</label>
                  <Input
                    value={bookForm.yearPublished}
                    onChange={(e) => setBookForm(prev => ({ ...prev, yearPublished: e.target.value }))}
                    placeholder="Year of publishing"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={bookForm.description}
                    onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Write a compelling description..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                

                <div>
                  <label className="text-sm font-medium">Sample Chapters</label>
                  <Textarea
                    value={bookForm.chapters}
                    onChange={(e) => setBookForm(prev => ({ ...prev, chapters: e.target.value }))}
                    placeholder="Paste your sample chapters here..."
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? 'Uploading...' : 'Upload Book'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>


        <TabsContent value="manage">
          <div className="space-y-4">
            {mockBooks.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <Badge 
                          variant={book.status === 'Published' ? 'default' : book.status === 'Draft' ? 'secondary' : 'destructive'}
                        >
                          {book.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {book.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>⭐ {book.rating.toFixed(1)}</span>
                        <span>📚 {book.reviewCount} reviews</span>
                        <span>❤️ {book.likes} likes</span>
                        <span>👁️ {book.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Link to={`/updatePage/${book.id}`} className="flex items-center">
                          Edit
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
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

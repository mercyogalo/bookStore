import { useState, useEffect } from "react";
import { Upload, Eye, BarChart3, Trash2, Edit } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Link } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { Navbar } from "./Navbar";
import { useToast } from "../hooks/use-toast";
import api from '../Utils/Api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export const AuthorDashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 
  const [books, setBooks] = useState([]);
  const [bookForm, setBookForm] = useState({
    title: "",
    description: "",
    genre: "",
    coverImage: "",
    chapters: "",
    author: "",
    yearPublished: "",
    link: "",
  });

  const { toast } = useToast();

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
      if (!bookForm.title || !bookForm.description || !bookForm.genre || !bookForm.author) {
        toast({
          title: "Missing fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      Object.entries(bookForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosInstance.post(`/book/createBook`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Book created successfully!",
        });
        fetchBooks();
      } else {
        toast({
          title: "Failed",
          description: "Could not create book. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating book:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "An error occurred while creating the book.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setBookForm({
        title: "",
        description: "",
        genre: "",
        coverImage: "",
        chapters: "",
        author: "",
        yearPublished: "",
        link: "",
      });
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/book/deleteBook/${id}`);
      fetchBooks();
      toast({
        title: "Deleted",
        description: "The book has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting book:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Navbar />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Author Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your books and connect with readers
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{books.length}</div>
            <div className="text-sm text-muted-foreground">Published Books</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="w-full mb-3">
        <TabsList className="grid w-full grid-cols-2 mt-2 mb-2">
          <TabsTrigger value="upload">Upload Book</TabsTrigger>
          <TabsTrigger value="manage">Manage Books</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card className="w-full md:w-3/4 lg:w-3/4 mx-auto mt-2">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 mt-3">

                  <label className="block text-sm font-medium mb-1">Author name</label>
                <Input
                  placeholder="Author Name"
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, author: e.target.value }))
                  }
                  required
                />

                 <label className="block text-sm font-medium mb-1">Book title</label>
                <Input
                  placeholder="Book Title"
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />

                 <label className="block text-sm font-medium mb-1">Genre</label>
                <Input
                  placeholder="Genre"
                  value={bookForm.genre}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, genre: e.target.value }))
                  }
                  required
                />
                 <label className="block text-sm font-medium mb-1">Cover Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, coverImage: e.target.files[0] }))
                  }
                  required
                />

                 <label className="block text-sm font-medium mb-1">Year of publication</label>
                <Input
                  placeholder="Year Published"
                  value={bookForm.yearPublished}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, yearPublished: e.target.value }))
                  }
                />

                 <label className="block text-sm font-medium mb-1">Book official Link</label>
                <Input
                  type="url"
                  placeholder="Book Link"
                  value={bookForm.link}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, link: e.target.value }))
                  }
                />

                 <label className="block text-sm font-medium mb-1">Brief description of the book</label>
                <Textarea
                  placeholder="Description"
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, description: e.target.value }))
                  }
                  required
                />

                 <label className="block text-sm font-medium mb-1">Highlighted chapters</label>
                <Textarea
                  placeholder="Sample Chapters"
                  value={bookForm.chapters}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, chapters: e.target.value }))
                  }
                  required
                />

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? "Saving..." : "Upload Book"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage">
          <div className="space-y-4">
            {books.map((book) => (
              <Card key={book._id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Book Cover */}
                    <div className="w-32 h-44 flex-shrink-0">
                      <img
                        src={`${api}${book.coverImage}` || ""}
                        alt={book.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{book.title}</h3>
                          <Badge variant="default">Published</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {book.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Author: {book.author}</span>
                          <span>Genre: {book.genre}</span>
                          <span>Year: {book.yearPublished}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 mt-4">
                        <Link to={`/update-book/${book._id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </Link>

                        {/* Delete Button with AlertDialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently
                                delete <strong>{book.title}</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => handleDelete(book._id)}
                                disabled={deletingId === book._id}
                              >
                                {deletingId === book._id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

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

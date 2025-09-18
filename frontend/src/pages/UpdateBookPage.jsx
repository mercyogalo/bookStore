import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import api from "../Utils/Api";
import { Navbar } from '../components/Navbar';

const UpdateBookPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    yearPublished: "",
    genre: "",
    description: "",
    link: "",
    coverImage: "",
    author: "",
    chapters: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axiosInstance.get(`${api}/book/${id}`);
        setFormData(res.data);
      } catch {
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`${api}/book/updateBook/${id}`, formData);
      toast({ title: "Book updated successfully!", status: "success" });
      navigate("/author-dashboard");
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to update book",
        status: "error",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert status="error">{error}</Alert>;

  return (
    <div>
       <Navbar />
    <div className="flex justify-center">
     
      <div className="w-3/4 max-w-4xl p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Year Published</label>
            <Input name="yearPublished" value={formData.yearPublished} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <Input name="genre" value={formData.genre} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" rows={8} value={formData.description} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link</label>
            <Input name="link" value={formData.link} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <Input name="coverImage" value={formData.coverImage} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Author</label>
            <Input name="author" value={formData.author} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 w-full gap-2">Chapters</label>
            <Textarea name="chapters" rows={8} value={formData.chapters} onChange={handleChange} />
          </div>

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default UpdateBookPage;

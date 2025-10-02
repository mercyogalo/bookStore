import React, { useState, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { useToast } from "../hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import api from "../Utils/Api";
import { Navbar } from "../components/Navbar";

const UpdateBookPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    yearPublished: "",
    genre: "",
    description: "",
    link: "",
    author: "",
    chapters: "",
  });
  const [coverImage, setCoverImage] = useState(null); // file upload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axiosInstance.get(`${api}/book/${id}`);
        setFormData({
          title: res.data.title || "",
          yearPublished: res.data.yearPublished || "",
          genre: res.data.genre || "",
          description: res.data.description || "",
          link: res.data.link || "",
          author: res.data.author || "",
          chapters: res.data.chapters || "",
        });
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

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("yearPublished", formData.yearPublished);
      data.append("genre", formData.genre);
      data.append("description", formData.description);
      data.append("link", formData.link);
      data.append("author", formData.author);
      data.append("chapters", formData.chapters);
      if (coverImage) {
        data.append("coverImage", coverImage);
      }

      await axiosInstance.put(`${api}/book/updateBook/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {formData.coverImage && (
                <img
                  src={`${api}${formData.coverImage}`}
                  alt="Current Cover"
                  className="mt-2 h-32 w-24 object-cover rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <Input name="author" value={formData.author} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Chapters</label>
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

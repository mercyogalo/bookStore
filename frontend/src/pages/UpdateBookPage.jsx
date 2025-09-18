import React, { useState, useEffect } from "react";
import { Form, Input, Textarea, Button, Alert } from "../components/ui";
import { useToast } from "../hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import api from "../Utils/Api";

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

  // 📌 Fetch book details by ID
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await axiosInstance.get(`${api}/book/${id}`);
        setFormData(res.data);
      } catch (err) {
        setError("Failed to fetch book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  // 📌 Check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`${api}/book/updateBook/${id}`, formData);

      toast({ title: "Book updated successfully!", status: "success" });
      navigate("/authorDashboard"); // ✅ redirect back to dashboard
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Book</h1>
      <Form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          name="yearPublished"
          label="Year Published"
          value={formData.yearPublished}
          onChange={handleChange}
          required
        />
        <Input
          name="genre"
          label="Genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />
        <Textarea
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <Input
          name="link"
          label="Link"
          value={formData.link}
          onChange={handleChange}
        />
        <Input
          name="coverImage"
          label="Cover Image URL"
          value={formData.coverImage}
          onChange={handleChange}
        />
        <Input
          name="author"
          label="Author"
          value={formData.author}
          onChange={handleChange}
        />
        <Textarea
          name="chapters"
          label="Chapters"
          value={formData.chapters}
          onChange={handleChange}
        />
        <Button type="submit">Save Changes</Button>
      </Form>
    </div>
  );
};

export default UpdateBookPage;

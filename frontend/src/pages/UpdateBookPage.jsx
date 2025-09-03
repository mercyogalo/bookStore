import React, { useState, useEffect } from 'react';
import { Form, Input, Textarea, Button, Alert } from "../components/ui";
import { useToast } from "../hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBookPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    yearPublished: "",
    genre: "",
    description: "",
    link: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/books/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          setError("Failed to fetch book details.");
        }
      } catch (err) {
        setError("An error occurred while fetching book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/books/updateBook/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({ title: "Book updated successfully!", status: "success" });
        navigate(`/books/${id}`);
      } else {
        const errorData = await response.json();
        toast({ title: errorData.message || "Failed to update book", status: "error" });
      }
    } catch (error) {
      toast({ title: "An error occurred", status: "error" });
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
          required
        />
        <Input
          name="coverImage"
          label="Cover Image URL"
          value={formData.coverImage}
          onChange={handleChange}
          required
        />
        <Button type="submit">Save Changes</Button>
      </Form>
    </div>
  );
};

export default UpdateBookPage;

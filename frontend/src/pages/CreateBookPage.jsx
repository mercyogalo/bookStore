import React, { useState, useEffect } from 'react';
import { Form, Input, Textarea, Button } from "../components/ui";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreateBookPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    yearPublished: "",
    genre: "",
    description: "",
    link: "",
    coverImage: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const author = localStorage.getItem("user");

    try {
      const response = await fetch("http://localhost:5000/api/books/createBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, author }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (response.ok) {
        toast({ title: "Book created successfully!", status: "success" });
        navigate("/books");
      } else {
        const errorData = await response.json();
        toast({ title: errorData.message || "Failed to create book", status: "error" });
      }
    } catch (error) {
      toast({ title: "An error occurred", status: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Book</h1>
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
        <Button type="submit">Create Book</Button>
      </Form>
    </div>
  );
};

export default CreateBookPage;

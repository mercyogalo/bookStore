"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, Upload } from "lucide-react"

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Poetry",
  "Drama",
]

const statuses = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "published", label: "Published" },
]

export function BookDialog({ book, open, onOpenChange, mode = "view", onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    status: "draft",
    pages: "",
    rating: "0",
    sales: "0",
    coverImage: "",
    publishedDate: "",
    isbn: "",
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        genre: book.genre || "",
        status: book.status || "draft",
        pages: book.pages?.toString() || "",
        rating: book.rating?.toString() || "0",
        sales: book.sales?.toString() || "0",
        coverImage: book.coverImage || "",
        publishedDate: book.publishedDate || "",
        isbn: book.isbn || "",
      })
    }
  }, [book])

  const handleSave = () => {
    const updatedBook = {
      ...book,
      ...formData,
      pages: Number.parseInt(formData.pages) || 0,
      rating: Number.parseFloat(formData.rating) || 0,
      sales: Number.parseInt(formData.sales) || 0,
      updatedAt: new Date().toISOString(),
    }
    onSave(updatedBook)
  }

  const isEditing = mode === "edit"
  const isViewing = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isViewing ? "Book Details" : isEditing ? "Edit Book" : "Add New Book"}</DialogTitle>
          <DialogDescription>
            {isViewing
              ? "View book information and statistics"
              : isEditing
                ? "Update book information and details"
                : "Add a new book to your collection"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Cover Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage || "/placeholder.svg"}
                    alt="Book cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">No Cover</p>
                    </div>
                  </div>
                )}
              </div>
              {!isViewing && (
                <Input
                  placeholder="Cover image URL"
                  value={formData.coverImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                />
              )}
            </div>

            <div className="md:col-span-2 space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  {isViewing ? (
                    <p className="text-sm font-medium">{formData.title}</p>
                  ) : (
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter book title"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  {isViewing ? (
                    <p className="text-sm">{formData.author}</p>
                  ) : (
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                      placeholder="Enter author name"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                {isViewing ? (
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                ) : (
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter book description"
                    rows={3}
                  />
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  {isViewing ? (
                    <Badge variant="secondary">{formData.genre}</Badge>
                  ) : (
                    <Select
                      value={formData.genre}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, genre: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isViewing ? (
                    <Badge
                      className={
                        formData.status === "published"
                          ? "bg-green-100 text-green-800"
                          : formData.status === "review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {formData.status}
                    </Badge>
                  ) : (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Pages</Label>
                  {isViewing ? (
                    <p className="text-sm">{formData.pages}</p>
                  ) : (
                    <Input
                      id="pages"
                      type="number"
                      value={formData.pages}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pages: e.target.value }))}
                      placeholder="0"
                    />
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {isViewing ? (
                      <span className="text-sm font-medium">{formData.rating}</span>
                    ) : (
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                        placeholder="0.0"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sales">Sales</Label>
                  {isViewing ? (
                    <p className="text-sm font-medium">{Number.parseInt(formData.sales).toLocaleString()}</p>
                  ) : (
                    <Input
                      id="sales"
                      type="number"
                      value={formData.sales}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sales: e.target.value }))}
                      placeholder="0"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  {isViewing ? (
                    <p className="text-sm font-mono">{formData.isbn}</p>
                  ) : (
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isbn: e.target.value }))}
                      placeholder="978-0-000-00000-0"
                    />
                  )}
                </div>
              </div>

              {/* Published Date */}
              <div className="space-y-2">
                <Label htmlFor="publishedDate">Published Date</Label>
                {isViewing ? (
                  <p className="text-sm">
                    {formData.publishedDate ? new Date(formData.publishedDate).toLocaleDateString() : "Not published"}
                  </p>
                ) : (
                  <Input
                    id="publishedDate"
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isViewing ? "Close" : "Cancel"}
          </Button>
          {!isViewing && <Button onClick={handleSave}>{isEditing ? "Save Changes" : "Add Book"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

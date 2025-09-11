import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookGrid } from "./book-grid"
import { BookDialog } from "./book-dialog"
import { Grid, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"

// Sample book data
const sampleBooks = [
  {
    id: 1,
    title: "The Digital Renaissance",
    author: "Sarah Mitchell",
    description: "A comprehensive guide to navigating the digital transformation in modern business.",
    genre: "Business",
    status: "published",
    pages: 324,
    rating: 4.5,
    sales: 12500,
    coverImage: "/business-book-cover-digital-renaissance.jpg",
    publishedDate: "2024-01-15",
    isbn: "978-0-123-45678-9",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Whispers in the Wind",
    author: "Sarah Mitchell",
    description: "A haunting tale of love and loss set against the backdrop of rural Ireland.",
    genre: "Fiction",
    status: "draft",
    pages: 287,
    rating: 4.2,
    sales: 8750,
    coverImage: "/fiction-book-cover-ireland-countryside.jpg",
    publishedDate: "",
    isbn: "978-0-987-65432-1",
    updatedAt: "2024-03-10T14:20:00Z",
  },
  {
    id: 3,
    title: "Code & Coffee: A Developer's Journey",
    author: "Sarah Mitchell",
    description: "Personal stories and insights from a decade in software development.",
    genre: "Biography",
    status: "review",
    pages: 198,
    rating: 4.8,
    sales: 15200,
    coverImage: "/programming-book-cover-coffee-developer.jpg",
    publishedDate: "2023-11-20",
    isbn: "978-0-456-78901-2",
    updatedAt: "2024-03-12T09:15:00Z",
  },
  {
    id: 4,
    title: "The Art of Mindful Living",
    author: "Sarah Mitchell",
    description: "Practical techniques for finding peace and purpose in a chaotic world.",
    genre: "Self-Help",
    status: "published",
    pages: 245,
    rating: 4.6,
    sales: 22100,
    coverImage: "/mindfulness-book-cover-zen-meditation.jpg",
    publishedDate: "2023-08-10",
    isbn: "978-0-789-01234-5",
    updatedAt: "2024-03-08T16:45:00Z",
  },
]

export function BookManagement() {
  const [books, setBooks] = useState(sampleBooks)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [dialogMode, setDialogMode] = useState("add")

  // Filter books based on search and filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || book.status === statusFilter
    const matchesGenre = genreFilter === "all" || book.genre === genreFilter

    return matchesSearch && matchesStatus && matchesGenre
  })

  const handleAddBook = () => {
    setSelectedBook(null)
    setDialogMode("add")
    setDialogOpen(true)
  }

  const handleEditBook = (book) => {
    setSelectedBook(book)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleDeleteBook = (bookId) => {
    setBooks(books.filter((book) => book.id !== bookId))
  }

  const handleSaveBook = (bookData) => {
    if (dialogMode === "add") {
      const newBook = {
        ...bookData,
        id: Math.max(...books.map((b) => b.id)) + 1,
        updatedAt: new Date().toISOString(),
      }
      setBooks([...books, newBook])
    } else {
      setBooks(books.map((book) => (book.id === bookData.id ? bookData : book)))
    }
    setDialogOpen(false)
  }

  const uniqueGenres = [...new Set(books.map((book) => book.genre))].sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Books</h1>
          <p className="text-muted-foreground">Manage your book collection and track performance</p>
        </div>
        <Button onClick={handleAddBook} className="shrink-0">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {uniqueGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredBooks.length} of {books.length} books
        </span>
        <span>Total Sales: {books.reduce((sum, book) => sum + book.sales, 0).toLocaleString()}</span>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || genreFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first book"}
          </p>
          {!searchTerm && statusFilter === "all" && genreFilter === "all" && (
            <Button onClick={handleAddBook}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Book
            </Button>
          )}
        </div>
      ) : (
        <BookGrid
          books={filteredBooks}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onView={(book) => {
            setSelectedBook(book)
            setDialogMode("view")
            setDialogOpen(true)
          }}
        />
      )}

      {/* Add/Edit Dialog */}
      <BookDialog
        book={selectedBook}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        onSave={handleSaveBook}
      />
    </div>
  )
}

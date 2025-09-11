import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookDialog } from "./book-dialog"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"

export function BookGrid({ books, onEdit, onDelete, onView }) {
  const [selectedBook, setSelectedBook] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view")

  const handleEdit = (book) => {
    setSelectedBook(book)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleView = (book) => {
    setSelectedBook(book)
    setDialogMode("view")
    setDialogOpen(true)
  }

  const handleDelete = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 text-balance">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">by {book.author}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(book)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(book)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Book
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(book)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Book
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="aspect-[3/4] bg-muted rounded-md mb-4 overflow-hidden">
                {book.coverImage ? (
                  <img
                    src={book.coverImage || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-sm">No Cover</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{book.genre}</span>
                  <span>{book.pages} pages</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                <span>Sales: {book.sales.toLocaleString()}</span>
                <span>Updated {new Date(book.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <BookDialog
        book={selectedBook}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        onSave={(updatedBook) => {
          onEdit(updatedBook)
          setDialogOpen(false)
        }}
      />
    </>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export function BookPerformance({ books = [] }) {
  // Sort books by sales and get top performers
  const topBooks = books
    .filter((book) => book.status === "published")
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5)

  // Sort books by rating
  const topRated = books
    .filter((book) => book.status === "published" && book.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

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

  if (topBooks.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Books</CardTitle>
            <CardDescription>Your best-selling books</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <div className="text-center text-muted-foreground">
              <p>No published books yet</p>
              <p className="text-sm">Publish books to see performance data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Rated Books</CardTitle>
            <CardDescription>Books with the best ratings</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[200px]">
            <div className="text-center text-muted-foreground">
              <p>No rated books yet</p>
              <p className="text-sm">Get reviews to see rating data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Performing Books */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Books</CardTitle>
          <CardDescription>Your best-selling books</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={book.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">{book.genre}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                  <div className="text-right">
                    <p className="font-medium">{(book.sales || 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">sales</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Highest Rated Books */}
      <Card>
        <CardHeader>
          <CardTitle>Highest Rated Books</CardTitle>
          <CardDescription>Books with the best ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRated.length > 0 ? (
              topRated.map((book, index) => (
                <div key={book.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.genre}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">{book.rating}</p>
                    <p className="text-xs text-muted-foreground">rating</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No rated books yet</p>
                <p className="text-sm">Get reviews to see rating data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

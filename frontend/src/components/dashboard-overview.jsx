"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatsOverview } from "./stats-overview"
import { BookOpen, TrendingUp, Star, Users, Edit, Eye } from "lucide-react"
import { PlusIcon } from "@radix-ui/react-icons"

// Sample recent books data
const recentBooks = [
  {
    id: 1,
    title: "The Digital Renaissance",
    status: "published",
    sales: 12500,
    rating: 4.5,
    updatedAt: "2024-03-15",
  },
  {
    id: 2,
    title: "Whispers in the Wind",
    status: "draft",
    sales: 0,
    rating: 0,
    updatedAt: "2024-03-10",
  },
  {
    id: 3,
    title: "Code & Coffee: A Developer's Journey",
    status: "review",
    sales: 15200,
    rating: 4.8,
    updatedAt: "2024-03-12",
  },
]

export function DashboardOverview({ onNavigate }) {
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground">Here's what's happening with your books today.</p>
        </div>
        <Button onClick={() => onNavigate("books")}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </div>

      {/* Stats Overview */}
      <StatsOverview books={recentBooks} />

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Books</CardTitle>
              <CardDescription>Your latest book projects</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("books")}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{book.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(book.status)}>{book.status}</Badge>
                      {book.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{book.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{book.sales.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => onNavigate("books")}
              >
                <PlusIcon className="h-5 w-5" />
                <span className="text-sm">Add Book</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => onNavigate("statistics")}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">View Stats</span>
              </Button>

              <Button
                variant="outline"
                className="h-20 flex-col gap-2 bg-transparent"
                onClick={() => onNavigate("profile")}
              >
                <Edit className="h-5 w-5" />
                <span className="text-sm">Edit Profile</span>
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                <Users className="h-5 w-5" />
                <span className="text-sm">Readers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Highlights</CardTitle>
          <CardDescription>Key achievements and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold text-green-900 dark:text-green-100">Sales Growth</p>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
              <p className="text-sm text-green-700 dark:text-green-300">vs last month</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-blue-900 dark:text-blue-100">New Reviews</p>
              <p className="text-2xl font-bold text-blue-600">47</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">this month</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-purple-900 dark:text-purple-100">New Readers</p>
              <p className="text-2xl font-bold text-purple-600">284</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">joined this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Edit, Star, DollarSign } from "lucide-react"

export function RecentActivity({ books = [] }) {
  // Generate recent activity from books data
  const activities = []

  // Add book updates
  books.forEach((book) => {
    activities.push({
      id: `update-${book.id}`,
      type: "update",
      title: `Updated "${book.title}"`,
      description: `Book details were modified`,
      timestamp: book.updatedAt,
      icon: Edit,
      book: book,
    })

    // Add sales milestones
    if (book.sales > 10000) {
      activities.push({
        id: `milestone-${book.id}`,
        type: "milestone",
        title: `"${book.title}" reached ${Math.floor(book.sales / 1000)}K sales`,
        description: `Congratulations on this achievement!`,
        timestamp: book.updatedAt,
        icon: DollarSign,
        book: book,
      })
    }

    // Add rating achievements
    if (book.rating >= 4.5) {
      activities.push({
        id: `rating-${book.id}`,
        type: "rating",
        title: `"${book.title}" achieved ${book.rating} star rating`,
        description: `Excellent reader feedback`,
        timestamp: book.updatedAt,
        icon: Star,
        book: book,
      })
    }
  })

  // Sort by timestamp and take recent 8
  const recentActivities = activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8)

  const getActivityColor = (type) => {
    switch (type) {
      case "milestone":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rating":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "update":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`

    return time.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {recentActivities.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Activity will appear as you manage your books</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <Badge variant="secondary" className={getActivityColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BookOpen, DollarSign, Star, Users } from "lucide-react"

export function StatsOverview({ books = [] }) {
  // Calculate statistics from books data
  const totalBooks = books.length
  const publishedBooks = books.filter((book) => book.status === "published").length
  const totalSales = books.reduce((sum, book) => sum + (book.sales || 0), 0)
  const averageRating =
    books.length > 0 ? (books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length).toFixed(1) : "0.0"

  // Calculate trends (mock data for demo)
  const salesTrend = 12.5 // percentage increase
  const ratingTrend = -2.1 // percentage change
  const booksTrend = 25.0 // percentage increase
  const readersTrend = 8.3 // percentage increase

  const stats = [
    {
      title: "Total Books",
      value: totalBooks.toString(),
      description: `${publishedBooks} published`,
      icon: BookOpen,
      trend: booksTrend,
      trendLabel: "from last month",
    },
    {
      title: "Total Sales",
      value: totalSales.toLocaleString(),
      description: "copies sold",
      icon: DollarSign,
      trend: salesTrend,
      trendLabel: "from last month",
    },
    {
      title: "Average Rating",
      value: averageRating,
      description: "across all books",
      icon: Star,
      trend: ratingTrend,
      trendLabel: "from last month",
    },
    {
      title: "Active Readers",
      value: "2,847",
      description: "monthly readers",
      icon: Users,
      trend: readersTrend,
      trendLabel: "from last month",
    },
  ]

  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon(stat.trend)}
                <span className={getTrendColor(stat.trend)}>{Math.abs(stat.trend)}%</span>
                <span className="text-muted-foreground">{stat.trendLabel}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function GenreChart({ books = [] }) {
  // Calculate genre distribution from books data
  const genreData = books.reduce((acc, book) => {
    const genre = book.genre || "Unknown"
    const existing = acc.find((item) => item.name === genre)
    if (existing) {
      existing.value += book.sales || 0
      existing.books += 1
    } else {
      acc.push({
        name: genre,
        value: book.sales || 0,
        books: 1,
      })
    }
    return acc
  }, [])

  // Sort by sales and take top 5
  const topGenres = genreData.sort((a, b) => b.value - a.value).slice(0, 5)

  if (topGenres.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Genre Performance</CardTitle>
          <CardDescription>Sales distribution by book genre</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center text-muted-foreground">
            <p>No data available</p>
            <p className="text-sm">Add books to see genre distribution</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Performance</CardTitle>
        <CardDescription>Sales distribution by book genre</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={topGenres} cx="50%" cy="50%" innerRadius={60} outerRadius={120} paddingAngle={2} dataKey="value">
              {topGenres.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm">Sales: {data.value.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.books} book{data.books !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {topGenres.map((genre, index) => (
            <div key={genre.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-sm font-medium">{genre.name}</span>
              <span className="text-sm text-muted-foreground">({genre.value.toLocaleString()})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

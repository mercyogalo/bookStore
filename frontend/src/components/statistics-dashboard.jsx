import { StatsOverview } from "./stats-overview"
import { SalesChart } from "./sales-chart"
import { GenreChart } from "./genre-chart"
import { BookPerformance } from "./book-performance"
import { RecentActivity } from "./recent-activity"

export function StatisticsDashboard({ books = [] }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Statistics</h1>
        <p className="text-muted-foreground">Track your book performance and sales analytics</p>
      </div>

      {/* Overview Stats */}
      <StatsOverview books={books} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <GenreChart books={books} />
      </div>

      {/* Performance and Activity */}
      <BookPerformance books={books} />

      <RecentActivity books={books} />
    </div>
  )
}

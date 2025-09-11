import { useState } from "react"
import { AuthorSidebar } from "@/components/author-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { BookManagement } from "@/components/book-management"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { ProfileManagement } from "@/components/profile-management"

// Sample books data
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

export default function AuthorDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview onNavigate={setActiveSection} />
      case "books":
        return <BookManagement />
      case "statistics":
        return <StatisticsDashboard books={sampleBooks} />
      case "profile":
        return <ProfileManagement />
      default:
        return <DashboardOverview onNavigate={setActiveSection} />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <AuthorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

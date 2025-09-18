import { TrendingUp, Heart, User, Book, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"

const navMain = [
  { title: "Popular", url: "/popular", icon: TrendingUp },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Author Dashboard", url: "/author-dashboard", icon: Book },
]

export function AppSidebar(props) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h1 className="font-bold text-lg px-4 py-2">BookReview</h1>
      </SidebarHeader>

      {/* TOP LINKS */}
      <SidebarContent>
        <nav className="flex flex-col gap-1 px-2">
          {navMain.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>

      {/* LOGOUT AT BOTTOM */}
      <SidebarFooter>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

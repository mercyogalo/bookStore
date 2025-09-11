import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { BookOpen, BarChart3, Home, PenTool, TrendingUp, Star, Menu } from "lucide-react"
import { PersonIcon, GearIcon, Cross2Icon } from "@radix-ui/react-icons"

const navigationItems = [
  {
    title: "Overview",
    icon: Home,
    id: "overview",
    description: "Dashboard overview",
  },
  {
    title: "My Books",
    icon: BookOpen,
    id: "books",
    description: "Manage your books",
  },
  {
    title: "Statistics",
    icon: BarChart3,
    id: "statistics",
    description: "View performance",
  },
  {
    title: "Profile",
    icon: User,
    id: "profile",
    description: "Account settings",
  },
]

const quickStats = [
  { label: "Total Books", value: "4", icon: BookOpen },
  { label: "Total Sales", value: "58.5K", icon: TrendingUp },
  { label: "Avg Rating", value: "4.5", icon: Star },
]

export function AuthorSidebar({ activeSection, onSectionChange, className }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <PenTool className="h-6 w-6 text-sidebar-primary" />
            <span className="font-bold text-sidebar-foreground">Author Hub</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <Cross2Icon className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/professional-author-headshot.jpg" alt="Sarah Mitchell" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">Sarah Mitchell</p>
              <p className="text-sm text-sidebar-foreground/70 truncate">Author & Writer</p>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "px-2",
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Quick Stats */}
      {!isCollapsed && (
        <>
          <Separator className="bg-sidebar-border" />
          <div className="p-4">
            <h3 className="font-medium text-sidebar-foreground mb-3">Quick Stats</h3>
            <div className="space-y-3">
              {quickStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
                      <Icon className="h-4 w-4 text-sidebar-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-sidebar-foreground">{stat.value}</p>
                      <p className="text-xs text-sidebar-foreground/70">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <GearIcon className="h-4 w-4" />
          {!isCollapsed && "Settings"}
        </Button>
      </div>
    </div>
  )
}

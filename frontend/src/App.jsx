import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Home } from "./pages/Home"
import { Popular } from "./pages/Popular"
import { Favorites } from "./pages/Favorites"
import { Profile } from "./pages/Profile"
import { BookPage } from "./pages/BookPage"
import { LoginSignup } from "./pages/LoginSignup"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { Toaster } from "./components/ui/toaster"
import { AuthorDashboard } from "./components/AuthorDashboard"

function App() {
  return (
    <ThemeProvider>
      
        <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {/* Navbar will always show, except on auth page */}
            <Navbar />

            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/authorDashboard" element={<AuthorDashboard />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/book/:id" element={<BookPage />} />
                <Route path="/login" element={<LoginSignup />} />
              </Routes>
            </main>

            <Toaster />
          </div>
          </AuthProvider>
        </BrowserRouter>
      
    </ThemeProvider>
  )
}

export default App

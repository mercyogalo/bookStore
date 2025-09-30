import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Popular } from "./pages/Popular";
import { Favorites } from "./pages/Favorites";
import { Profile } from "./pages/Profile";
import { BookPage } from "./pages/BookPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { AuthorDashboard } from "./components/AuthorDashboard";
import { ReviewerDashboard } from "./components/ReviewerDashboard.jsx";
import UpdateBookPage from "./pages/UpdateBookPage";



function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
           

            <main className="w-full ">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/author-dashboard" element={<AuthorDashboard />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookPage/:id" element={<BookPage />} />
                <Route path="/update-book/:id" element={<UpdateBookPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
              </Routes>
            </main>

            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

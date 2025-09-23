import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Heart, Home, TrendingUp, User, LogIn, Menu, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../components/ui/sheet';
import { useState, useEffect } from 'react';

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Popular', path: '/popular', icon: TrendingUp },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            } ${mobile ? 'w-full' : ''}`}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Nav */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Book className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">BookReview</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Book className="h-6 w-6" />
              <span className="font-bold">BookReview</span>
            </Link>
            <nav className="flex flex-col space-y-3 mt-6">
              <NavLinks mobile />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <Book className="h-6 w-6" />
              <span className="font-bold">BookReview</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {!isAuthenticated ? (
              <Link to="/">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

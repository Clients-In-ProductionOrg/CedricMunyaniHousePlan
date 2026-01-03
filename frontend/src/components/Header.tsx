import { Home, Search, X, MessageCircle, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { chatBotRef } from "./ChatBot";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    const baseClasses = "text-sm font-medium transition-all duration-200 relative pb-2";
    if (isActive(path)) {
      return `${baseClasses} text-primary border-b-2 border-primary`;
    }
    return `${baseClasses} text-foreground hover:text-primary`;
  };

  const getMobileLinkClasses = (path: string) => {
    const baseClasses = "block px-4 py-2 text-base font-medium transition-all rounded-md";
    if (isActive(path)) {
      return `${baseClasses} text-white bg-primary`;
    }
    return `${baseClasses} text-foreground hover:bg-primary/10`;
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/house-plans", label: "House Plans" },
    { to: "/built-homes", label: "Built Homes" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
          <Home className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold text-foreground hidden sm:inline">Cedric House Planning</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={getLinkClasses(link.to)}>
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right side buttons and mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Munyai AI Button - Hide on very small screens */}
          <Button 
            onClick={() => chatBotRef.current?.open()}
            className="hidden sm:flex bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:inline">Munyai AI</span>
          </Button>

          {/* Get Quote Button - Show on all screens */}
          <Link to="/get-quote">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-xs sm:text-sm px-2 sm:px-4">
              Get FREE Quote Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container py-4 space-y-2">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={getMobileLinkClasses(link.to)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile AI Button */}
            <button
              onClick={() => {
                chatBotRef.current?.open();
                setIsMobileMenuOpen(false);
              }}
              className="w-full block px-4 py-2 text-base font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <MessageCircle className="w-4 h-4" />
              Munyai AI
            </button>

            {/* Mobile Get Quote Button */}
            <Link
              to="/get-quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full block"
            >
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                Get FREE Quote Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

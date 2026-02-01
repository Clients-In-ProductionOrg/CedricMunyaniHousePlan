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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:inline">Cedric House Planning</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(link.to) 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Right side buttons and mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Munyai AI Button */}
          <Button 
            onClick={() => chatBotRef.current?.open()}
            variant="outline"
            className="hidden sm:flex border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary gap-2 h-10 px-4 rounded-full"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden md:inline">Munyai AI</span>
          </Button>

          {/* Get Quote Button - Gradient CTA */}
          <Link to="/get-quote">
            <Button className="bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-700/90 text-white font-semibold shadow-lg shadow-primary/25 h-10 px-6 rounded-full transition-all hover:scale-105 active:scale-95">
              Get Quote
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
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

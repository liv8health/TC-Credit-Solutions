import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TrendingUp, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function PublicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="bg-primary text-primary-foreground rounded-lg p-2 mr-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-primary">TC Credit Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => item.href.startsWith('#') ? scrollToSection(item.href) : null}
                className="text-muted-foreground hover:text-primary px-3 py-2 font-medium transition-colors"
              >
                {item.href.startsWith('#') ? item.name : (
                  <Link href={item.href}>{item.name}</Link>
                )}
              </button>
            ))}
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/portal">
                <Button>Member Portal</Button>
              </Link>
            ) : (
              <Button onClick={() => window.location.href = '/api/login'}>
                Member Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => item.href.startsWith('#') ? scrollToSection(item.href) : null}
                className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary font-medium"
              >
                {item.href.startsWith('#') ? item.name : (
                  <Link href={item.href}>{item.name}</Link>
                )}
              </button>
            ))}
            {isAuthenticated ? (
              <Link href="/portal">
                <Button className="w-full mt-2">Member Portal</Button>
              </Link>
            ) : (
              <Button 
                className="w-full mt-2"
                onClick={() => window.location.href = '/api/login'}
              >
                Member Login
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

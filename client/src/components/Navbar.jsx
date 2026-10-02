import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User, Settings, LayoutDashboard, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";

  // Navigation links based on authentication state
  const navLinks = isAuthenticated
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Calendar", href: "/calendar" },
        { name: "Events", href: "/events" },
      ]
    : [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Documentation", href: "/docs" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight rounded-lg px-2 py-1.5 -ml-2 transition-all duration-200 hover:bg-muted/60 active:scale-95 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-6 text-primary" />
            <span>Calendar</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="hover:text-foreground transition-colors cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Dynamic Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /* Logged in View: User Avatar & Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Logged Out View: Login & Register Buttons */
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className="cursor-pointer">
                <Button variant="ghost" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="cursor-pointer">
                <Button className="cursor-pointer">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 pt-2 pb-4 space-y-3">
          <nav className="flex flex-col space-y-1 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Unauthenticated Action Buttons for Mobile */}
          {!isAuthenticated && (
            <div className="pt-2 border-t flex flex-col gap-2 sm:hidden">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer"
              >
                <Button
                  variant="outline"
                  className="w-full justify-center cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer"
              >
                <Button className="w-full justify-center cursor-pointer">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

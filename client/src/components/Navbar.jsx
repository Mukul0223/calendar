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
import { LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4">
        {/*Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight rounded-lg px-2 py-1.5 -ml-2 transition-all duration-200 hover:bg-muted/60 active:scale-95 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LayoutDashboard className="h-4 w-6 text-primary" />
            <span>Calendar</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Documentation
            </Link>
          </nav>
        </div>

        {/* Dynamic Auth Section */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /*Logged in View: User Avater & Dropdown */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /*Logged Out View: Login $ Register Buttons */
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="cursor-pointer">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

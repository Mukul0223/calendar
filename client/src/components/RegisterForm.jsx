import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      await register(name, email, password);
      navigate("/login");
    } catch (err) {
      console.log("Register Failed", err);
      const data = err.response?.data || err;

      if (data.details) {
        setFieldErrors(data.details);
      } else if (data.message) {
        setError(data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-muted">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Sign Up
        </CardTitle>
        <CardDescription>
          Enter your name, email and password to register your account
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pb-2">
          {/* General Error Alerts */}
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/*Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {fieldErrors && (
              <p className="text-xs text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {fieldErrors && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="......"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors && (
              <p className=" text-xs text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-1">
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account.{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

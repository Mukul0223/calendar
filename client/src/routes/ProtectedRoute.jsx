import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center pt-4">
        <Loader className="animate-spin h-6 w-6 text-blue-600" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

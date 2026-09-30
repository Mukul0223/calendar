import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>; //TODO: real spinner later
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

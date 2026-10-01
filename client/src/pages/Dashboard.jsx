import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { meRequest } from "@/api/auth.api";

export default function Dashboard() {
  const { user, accessToken } = useAuth();

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Derived state: Loading is true only if we have a token but haven't gotten data or an error yet
  const isLoading = Boolean(accessToken && !result && !error);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;

    const getUserData = async () => {
      try {
        const res = await meRequest(accessToken);
        if (isMounted) setResult(res.data.data);
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to fetch user data",
          );
        }
      }
    };

    getUserData();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  //if (!accessToken) return <div>Please log in to view the dashboard.</div>;
  if (isLoading) return <div>Loading user data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}</h1>
      <pre>{JSON.stringify(result.user, null, 2)}</pre>
    </div>
  );
}

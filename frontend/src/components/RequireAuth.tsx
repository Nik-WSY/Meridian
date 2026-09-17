import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth-context";

export function RequireAuth() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
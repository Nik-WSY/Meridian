import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "../auth-context";

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (profile?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
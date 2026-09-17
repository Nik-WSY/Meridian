import { createContext, useContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "employee" | "manager";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
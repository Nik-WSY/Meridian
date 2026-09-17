import { useAuth } from "../auth-context";
import { Nav } from "../components/Nav";

export default function DashboardPage() {
  const { profile } = useAuth();

  return (
    <div>
      <Nav />
      <div className="mer-page">
        <h1>Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
        <p className="mer-muted">
          You&apos;re signed in as a{profile?.role === "manager" ? "n" : ""} <strong>{profile?.role ?? "..."}</strong>.
        </p>
      </div>
    </div>
  );
}
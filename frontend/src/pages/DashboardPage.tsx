import { Link } from "react-router-dom";
import { useAuth } from "../auth-context";

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();

  return (
    <div style={{ maxWidth: 640, margin: "60px auto", fontFamily: "system-ui" }}>
      <h1>Meridian</h1>
      <p>Signed in as {user?.email}</p>
      <p>
        Role: <strong>{profile?.role ?? "loading..."}</strong>
      </p>
      <nav style={{ display: "flex", gap: 16, margin: "20px 0" }}>
        <Link to="/submit">Submit an expense</Link>
        {profile?.role === "manager" && <Link to="/queue">Approval queue</Link>}
      </nav>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
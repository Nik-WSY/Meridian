import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth-context";

function initials(name: string | null, email: string | undefined) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "??";
}

export function Nav() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/submit", label: "Submit" },
    ...(profile?.role === "manager" ? [{ to: "/queue", label: "Requests" }] : []),
  ];

  return (
    <nav className="mer-nav">
      <div className="mer-nav-left">
        <Link to="/" className="mer-brand">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.2" />
            <ellipse cx="11" cy="11" rx="4" ry="9.5" stroke="currentColor" strokeWidth="1" />
            <line x1="1.5" y1="11" x2="20.5" y2="11" stroke="currentColor" strokeWidth="1" />
          </svg>
          <span>MERIDIAN</span>
        </Link>
        <div className="mer-nav-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "mer-nav-active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mer-nav-right">
        <span>{profile?.full_name || user?.email}</span>
        <div className="mer-avatar">{initials(profile?.full_name ?? null, user?.email)}</div>
        <button type="button" className="mer-link-btn" onClick={signOut}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
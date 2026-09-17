import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";

export default function LoginPage() {
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: authError } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });

    setSubmitting(false);
    if (authError) setError(authError.message);
  }

  return (
    <div className="mer-login">
      <div className="mer-login-sphere" />
      <div className="mer-login-content">
        <div className="mer-login-eyebrow">Provisioning &middot; Finance Network</div>
        <h1 className="mer-login-wordmark">MERIDIAN</h1>

        <form onSubmit={handleSubmit} className="mer-login-form">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="mer-error">{error}</p>}
          <button type="submit" className="mer-btn-primary" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "signin" ? "Enter Terminal" : "Create Access"}
          </button>
        </form>

        <button
          type="button"
          className="mer-link-btn"
          style={{ marginTop: 18 }}
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>

        <div className="mer-login-footer">Secure Access &middot; Vierpolders HQ</div>
      </div>
    </div>
  );
}
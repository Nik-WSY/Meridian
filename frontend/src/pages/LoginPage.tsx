import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const ROUTES = [
  { id: "route1", d: "M90,120 L840,760", dashDur: "2.5s", packetDur: "7s", packetBegin: "0s" },
  { id: "route2", d: "M420,60 L1220,800", dashDur: "3s", packetDur: "9s", packetBegin: "0.8s" },
  { id: "route3", d: "M1080,70 L60,430", dashDur: "2.2s", packetDur: "6.5s", packetBegin: "1.6s" },
  { id: "route4", d: "M1380,160 L460,820", dashDur: "3.5s", packetDur: "10s", packetBegin: "2.4s" },
  { id: "route5", d: "M1540,340 L140,700", dashDur: "2.8s", packetDur: "8s", packetBegin: "3.2s" },
  { id: "route6", d: "M760,150 L1560,560", dashDur: "3.2s", packetDur: "11s", packetBegin: "4s" },
  { id: "route7", d: "M60,430 L1220,800", dashDur: "2.6s", packetDur: "7.5s", packetBegin: "4.8s" },
  { id: "route8", d: "M460,820 L1080,70", dashDur: "3.8s", packetDur: "9.5s", packetBegin: "5.6s" },
];

const NODES = [
  { cx: 90, cy: 120, delay: "0s" },
  { cx: 420, cy: 60, delay: "0.3s" },
  { cx: 760, cy: 150, delay: "0.6s" },
  { cx: 1080, cy: 70, delay: "0.9s" },
  { cx: 1380, cy: 160, delay: "1.2s" },
  { cx: 1540, cy: 340, delay: "1.5s" },
  { cx: 60, cy: 430, delay: "1.8s" },
  { cx: 1560, cy: 560, delay: "2.1s" },
  { cx: 140, cy: 700, delay: "2.4s" },
  { cx: 460, cy: 820, delay: "2.7s" },
  { cx: 840, cy: 760, delay: "3s" },
  { cx: 1220, cy: 800, delay: "3.3s" },
];

export default function LoginPage() {
  const { session } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

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
    <div className="mer-login-page">
      <svg
        className="mer-login-network"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {ROUTES.map((route) => (
            <path
              key={route.id}
              id={route.id}
              className="mer-network-route"
              d={route.d}
              style={{ animationDuration: route.dashDur }}
            />
          ))}
        </g>

        <g>
          {NODES.map((node, i) => (
            <g key={i}>
              <circle className="mer-network-node-dot" cx={node.cx} cy={node.cy} r="3.4" />
              <circle
                className="mer-network-node-ring"
                cx={node.cx}
                cy={node.cy}
                r="3.4"
                style={{ animationDelay: node.delay }}
              />
            </g>
          ))}
        </g>

        <g>
          {ROUTES.map((route) => (
            <circle key={route.id} className="mer-network-packet" r="3.5">
              <animateMotion dur={route.packetDur} begin={route.packetBegin} repeatCount="indefinite">
                <mpath href={`#${route.id}`} />
              </animateMotion>
            </circle>
          ))}
        </g>
      </svg>

      <div className="mer-login-card">
        <div className="mer-login-visual">
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="mer-login-visual-bg">
            <defs>
              <linearGradient id="loginSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#04070d" />
                <stop offset="45%" stopColor="#0a1220" />
                <stop offset="68%" stopColor="#25323f" />
                <stop offset="100%" stopColor="#0a1119" />
              </linearGradient>
              <linearGradient id="loginFogFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a4a5c" stopOpacity="0" />
                <stop offset="100%" stopColor="#3a4a5c" stopOpacity="0.5" />
              </linearGradient>
              <filter id="loginSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="loginGlowBlur" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="loginGlowBlurSoft" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>

            <rect width="1440" height="900" fill="url(#loginSky)" />

            <g opacity="0.9">
              <circle cx="180" cy="90" r="1.2" fill="#eef2f7" opacity="0.5" />
              <circle cx="340" cy="140" r="0.9" fill="#eef2f7" opacity="0.4" />
              <circle cx="520" cy="70" r="1.1" fill="#eef2f7" opacity="0.45" />
              <circle cx="760" cy="110" r="0.8" fill="#eef2f7" opacity="0.35" />
              <circle cx="980" cy="60" r="1.3" fill="#eef2f7" opacity="0.5" />
              <circle cx="1180" cy="130" r="0.9" fill="#eef2f7" opacity="0.4" />
              <circle cx="1320" cy="80" r="1.1" fill="#eef2f7" opacity="0.45" />
              <circle cx="90" cy="220" r="0.7" fill="#eef2f7" opacity="0.3" />
              <circle cx="1400" cy="200" r="0.8" fill="#eef2f7" opacity="0.35" />
            </g>

            <path d="M-40,900 L-40,400.0 L0.0,400.0 L65.5,369.1 L130.9,344.0 L196.4,315.2 L261.8,290.1 L327.3,275.6 L392.7,255.2 L458.2,220.6 L523.6,213.3 L589.1,198.2 L654.5,169.4 L720.0,172.6 L785.5,172.8 L850.9,193.2 L916.4,205.9 L981.8,233.2 L1047.3,244.5 L1112.7,262.8 L1178.2,291.6 L1243.6,313.4 L1309.1,340.5 L1374.5,373.9 L1440.0,395.6 L1480,900 Z" fill="#3a4a5c" opacity="0.5" filter="url(#loginSoftBlur)" />
            <rect x="0" y="330" width="1440" height="160" fill="url(#loginFogFade)" />

            <path d="M-40,900 L-40,486.5 L0.0,486.5 L55.4,459.6 L110.8,418.4 L166.2,404.6 L221.5,364.7 L276.9,343.7 L332.3,329.4 L387.7,291.4 L443.1,287.3 L498.5,253.6 L553.8,251.4 L609.2,237.5 L664.6,216.0 L720.0,208.3 L775.4,250.5 L830.8,263.1 L886.2,267.3 L941.5,277.8 L996.9,314.2 L1052.3,344.7 L1107.7,354.2 L1163.1,407.4 L1218.5,415.9 L1273.8,459.0 L1329.2,492.3 L1384.6,524.1 L1440.0,553.7 L1480,900 Z" fill="#1b2530" opacity="0.88" />

            <path d="M-40,900 L-40,565.0 L0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9 L1480,900 Z" fill="#0c121b" />
            <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff3b3b" strokeWidth="10" opacity="0.4" filter="url(#loginGlowBlurSoft)" />
            <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff3b3b" strokeWidth="3" opacity="0.6" filter="url(#loginGlowBlur)" />
            <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff6a5a" strokeWidth="1" opacity="0.85" />

            <path d="M-40,900 L-40,846.7 L0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6 L1480,900 Z" fill="#05070b" />
            <path d="M0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6" fill="none" stroke="#ff3b3b" strokeWidth="6" opacity="0.3" filter="url(#loginGlowBlurSoft)" />
            <path d="M0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6" fill="none" stroke="#ff3b3b" strokeWidth="1.4" opacity="0.7" />

            <path d="M84.7,474.7 L296.5,339.5 L508.2,257.5 L720.0,233.5 L931.8,389.8 L1143.5,557.3" fill="none" stroke="#ff3b3b" strokeWidth="1" strokeDasharray="2 5" opacity="0.55" />
            <circle cx="84.7" cy="474.7" r="4" fill="#ff3b3b" />
            <circle cx="84.7" cy="474.7" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />
            <circle cx="296.5" cy="339.5" r="4" fill="#ff3b3b" />
            <circle cx="296.5" cy="339.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />
            <circle cx="508.2" cy="257.5" r="4" fill="#ff3b3b" />
            <circle cx="508.2" cy="257.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />
            <circle cx="720.0" cy="233.5" r="4" fill="#ff3b3b" />
            <circle cx="720.0" cy="233.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />
            <circle cx="931.8" cy="389.8" r="4" fill="#ff3b3b" />
            <circle cx="931.8" cy="389.8" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />
            <circle cx="1143.5" cy="557.3" r="4" fill="#ff3b3b" />
            <circle cx="1143.5" cy="557.3" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" />

            <g stroke="#ff3b3b" strokeWidth="1.5" opacity="0.7" fill="none">
              <path d="M40,40 L40,72 M40,40 L72,40" />
              <path d="M1400,40 L1400,72 M1400,40 L1368,40" />
              <path d="M40,860 L40,828 M40,860 L72,860" />
              <path d="M1400,860 L1400,828 M1400,860 L1368,860" />
            </g>
          </svg>

          <div className="mer-login-visual-scrim" />

          <div className="mer-login-visual-brand">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="11" cy="11" rx="4" ry="9.5" stroke="currentColor" strokeWidth="1" />
              <line x1="1.5" y1="11" x2="20.5" y2="11" stroke="currentColor" strokeWidth="1" />
            </svg>
            <span>MERIDIAN</span>
          </div>

          <div className="mer-login-visual-copy">
            <h2 className="mer-login-visual-heading">
              Access built for the fleet,
              <br />
              one secure sign-in at a time.
            </h2>
            <p className="mer-login-visual-subtext">
              Join the network keeping every vessel provisioned and accounted for.
            </p>
            <p className="mer-login-visual-tagline">MERIDIAN &mdash; Internal Provisioning &amp; Finance Network</p>
          </div>
        </div>

        <div className="mer-login-form-panel">
          <div className="mer-login-form-inner">
            <h1 className="mer-login-heading">{mode === "signin" ? "Sign in to Meridian" : "Create your account"}</h1>
            <p className="mer-login-subtext">
              {mode === "signin"
                ? "Enter your credentials to access the provisioning & finance network."
                : "Join the network and get access to fleet provisioning tools."}
            </p>

            <form onSubmit={handleSubmit} className="mer-login-form">
              {mode === "signup" && (
                <div>
                  <label>
                    Full name <span className="mer-required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Andrew Thomas"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label>
                  Email address <span className="mer-required">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {mode === "signup" ? (
                <>
                  <div className="mer-login-row">
                    <div className="mer-field">
                      <label>Password</label>
                      <div className="mer-field-wrap">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="mer-field-toggle"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                    <div className="mer-field">
                      <label>Confirm password</label>
                      <div className="mer-field-wrap">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="mer-field-toggle"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="mer-login-help">Password must be at least 6 characters.</p>
                </>
              ) : (
                <div>
                  <label>Password</label>
                  <div className="mer-field-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="mer-field-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}

              {error && <p className="mer-error">{error}</p>}

              <button type="submit" className="mer-btn-primary mer-login-submit" disabled={submitting}>
                {submitting ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <div className="mer-login-switch">
              {mode === "signin" ? (
                <>
                  Need an account?{" "}
                  <button type="button" className="mer-link-btn" onClick={() => setMode("signup")}>
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" className="mer-link-btn" onClick={() => setMode("signin")}>
                    Sign in
                  </button>
                </>
              )}
            </div>

            <div className="mer-login-footer">Secure Access &middot; Encrypted Channel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

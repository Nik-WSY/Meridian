import { Link } from "react-router-dom";
import { useAuth } from "../auth-context";

export default function HomePage() {
  const { session } = useAuth();

  return (
    <div className="mer-home">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="mer-home-bg">
        <defs>
          <linearGradient id="homeSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04070d" />
            <stop offset="45%" stopColor="#0a1220" />
            <stop offset="68%" stopColor="#25323f" />
            <stop offset="100%" stopColor="#0a1119" />
          </linearGradient>
          <linearGradient id="homeFogFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a4a5c" stopOpacity="0" />
            <stop offset="100%" stopColor="#3a4a5c" stopOpacity="0.5" />
          </linearGradient>
          <filter id="homeSoftBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="homeGlowBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="homeGlowBlurSoft" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>

        <rect width="1440" height="900" fill="url(#homeSky)" />

        <g opacity="0.9">
          <circle className="mer-home-star" cx="180" cy="90" r="1.2" fill="#eef2f7" style={{ animationDelay: "0s", animationDuration: "3.4s" }} />
          <circle className="mer-home-star" cx="340" cy="140" r="0.9" fill="#eef2f7" style={{ animationDelay: "0.6s", animationDuration: "4.2s" }} />
          <circle className="mer-home-star" cx="520" cy="70" r="1.1" fill="#eef2f7" style={{ animationDelay: "1.2s", animationDuration: "3.8s" }} />
          <circle className="mer-home-star" cx="760" cy="110" r="0.8" fill="#eef2f7" style={{ animationDelay: "1.8s", animationDuration: "4.6s" }} />
          <circle className="mer-home-star" cx="980" cy="60" r="1.3" fill="#eef2f7" style={{ animationDelay: "0.3s", animationDuration: "5s" }} />
          <circle className="mer-home-star" cx="1180" cy="130" r="0.9" fill="#eef2f7" style={{ animationDelay: "2.1s", animationDuration: "3.6s" }} />
          <circle className="mer-home-star" cx="1320" cy="80" r="1.1" fill="#eef2f7" style={{ animationDelay: "0.9s", animationDuration: "4.4s" }} />
          <circle className="mer-home-star" cx="90" cy="220" r="0.7" fill="#eef2f7" style={{ animationDelay: "1.5s", animationDuration: "5.2s" }} />
          <circle className="mer-home-star" cx="1400" cy="200" r="0.8" fill="#eef2f7" style={{ animationDelay: "2.4s", animationDuration: "4s" }} />
        </g>

        <path d="M-40,900 L-40,400.0 L0.0,400.0 L65.5,369.1 L130.9,344.0 L196.4,315.2 L261.8,290.1 L327.3,275.6 L392.7,255.2 L458.2,220.6 L523.6,213.3 L589.1,198.2 L654.5,169.4 L720.0,172.6 L785.5,172.8 L850.9,193.2 L916.4,205.9 L981.8,233.2 L1047.3,244.5 L1112.7,262.8 L1178.2,291.6 L1243.6,313.4 L1309.1,340.5 L1374.5,373.9 L1440.0,395.6 L1480,900 Z" fill="#3a4a5c" opacity="0.5" filter="url(#homeSoftBlur)" />
        <rect x="0" y="330" width="1440" height="160" fill="url(#homeFogFade)" />

        <path d="M-40,900 L-40,486.5 L0.0,486.5 L55.4,459.6 L110.8,418.4 L166.2,404.6 L221.5,364.7 L276.9,343.7 L332.3,329.4 L387.7,291.4 L443.1,287.3 L498.5,253.6 L553.8,251.4 L609.2,237.5 L664.6,216.0 L720.0,208.3 L775.4,250.5 L830.8,263.1 L886.2,267.3 L941.5,277.8 L996.9,314.2 L1052.3,344.7 L1107.7,354.2 L1163.1,407.4 L1218.5,415.9 L1273.8,459.0 L1329.2,492.3 L1384.6,524.1 L1440.0,553.7 L1480,900 Z" fill="#1b2530" opacity="0.88" />

        <path d="M-40,900 L-40,565.0 L0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9 L1480,900 Z" fill="#0c121b" />
        <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff3b3b" strokeWidth="10" opacity="0.4" filter="url(#homeGlowBlurSoft)" className="mer-home-ridge-glow" style={{ animationDelay: "0s" }} />
        <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff3b3b" strokeWidth="3" opacity="0.6" filter="url(#homeGlowBlur)" className="mer-home-ridge-glow" style={{ animationDelay: "0.8s" }} />
        <path d="M0.0,565.0 L42.4,525.2 L84.7,474.7 L127.1,461.6 L169.4,427.6 L211.8,392.7 L254.1,385.1 L296.5,339.5 L338.8,306.3 L381.2,271.6 L423.5,293.0 L465.9,260.1 L508.2,257.5 L550.6,196.3 L592.9,202.2 L635.3,257.9 L677.6,212.2 L720.0,233.5 L762.4,275.5 L804.7,302.1 L847.1,354.4 L889.4,388.9 L931.8,389.8 L974.1,443.7 L1016.5,468.0 L1058.8,497.9 L1101.2,540.0 L1143.5,557.3 L1185.9,594.4 L1228.2,618.9 L1270.6,667.6 L1312.9,704.0 L1355.3,747.8 L1397.6,756.7 L1440.0,760.9" fill="none" stroke="#ff6a5a" strokeWidth="1" opacity="0.85" className="mer-home-ridge-line" style={{ animationDelay: "0.3s" }} />

        <path d="M-40,900 L-40,846.7 L0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6 L1480,900 Z" fill="#05070b" />
        <path d="M0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6" fill="none" stroke="#ff3b3b" strokeWidth="6" opacity="0.3" filter="url(#homeGlowBlurSoft)" className="mer-home-ridge-glow" style={{ animationDelay: "2s" }} />
        <path d="M0.0,846.7 L48.0,811.2 L96.0,791.8 L144.0,763.5 L192.0,741.9 L240.0,681.0 L288.0,696.8 L336.0,682.3 L384.0,652.4 L432.0,631.2 L480.0,606.2 L528.0,592.4 L576.0,589.1 L624.0,556.5 L672.0,545.9 L720.0,515.9 L768.0,555.4 L816.0,578.1 L864.0,581.2 L912.0,570.6 L960.0,601.6 L1008.0,596.7 L1056.0,614.8 L1104.0,664.8 L1152.0,708.5 L1200.0,696.4 L1248.0,722.7 L1296.0,769.1 L1344.0,785.8 L1392.0,830.2 L1440.0,838.6" fill="none" stroke="#ff3b3b" strokeWidth="1.4" opacity="0.7" className="mer-home-ridge-line" style={{ animationDelay: "1.6s" }} />

        <path className="mer-home-route" d="M84.7,474.7 L296.5,339.5 L508.2,257.5 L720.0,233.5 L931.8,389.8 L1143.5,557.3" fill="none" stroke="#ff3b3b" strokeWidth="1" strokeDasharray="2 5" opacity="0.55" />
        <circle cx="84.7" cy="474.7" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="84.7" cy="474.7" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "0s" }} />
        <circle cx="296.5" cy="339.5" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="296.5" cy="339.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "0.5s" }} />
        <circle cx="508.2" cy="257.5" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="508.2" cy="257.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "1s" }} />
        <circle cx="720.0" cy="233.5" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="720.0" cy="233.5" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "1.5s" }} />
        <circle cx="931.8" cy="389.8" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="931.8" cy="389.8" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "2s" }} />
        <circle cx="1143.5" cy="557.3" r="4" fill="#ff3b3b" />
        <circle className="mer-home-node-ring" cx="1143.5" cy="557.3" r="9" fill="none" stroke="#ff3b3b" strokeWidth="1" opacity="0.5" style={{ animationDelay: "2.5s" }} />

        <g stroke="#ff3b3b" strokeWidth="1.5" opacity="0.7" fill="none">
          <path d="M40,40 L40,72 M40,40 L72,40" />
          <path d="M1400,40 L1400,72 M1400,40 L1368,40" />
          <path d="M40,860 L40,828 M40,860 L72,860" />
          <path d="M1400,860 L1400,828 M1400,860 L1368,860" />
        </g>
      </svg>

      <div className="mer-home-brand">
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9.5" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="11" cy="11" rx="4" ry="9.5" stroke="currentColor" strokeWidth="1" />
          <line x1="1.5" y1="11" x2="20.5" y2="11" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span>MERIDIAN</span>
      </div>

      <div className="mer-home-panel">
        <div className="mer-home-eyebrow">Provisioning &middot; Finance Network</div>
        <h1 className="mer-home-wordmark">MERIDIAN</h1>
        <p className="mer-home-tagline">Internal access only.</p>
        <Link to={session ? "/dashboard" : "/login"} className="mer-btn-primary mer-home-cta">
          {session ? "Go to Dashboard" : "Access Portal"}
        </Link>
      </div>
    </div>
  );
}

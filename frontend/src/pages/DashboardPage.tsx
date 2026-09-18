import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth-context";
import { Nav } from "../components/Nav";
import type { Expense, ExpenseStatus } from "../types";

type ExpenseWithSubmitter = Expense & { submitter?: { full_name: string | null } | null };

interface PortRef {
  key: string;
  label: string;
  lon: number;
  lat: number;
}

// A small set of ports the fleet commonly touches. Real port text entered on
// the submit form is matched against this list (loosely -- see matchPort) so
// the map only ever plots real, currently-open or recent requests.
const PORTS: PortRef[] = [
  { key: "vierpolders", label: "HQ", lon: 4.15, lat: 51.85 },
  { key: "palma", label: "Palma de Mallorca", lon: 2.65, lat: 39.57 },
  { key: "antibes", label: "Antibes", lon: 7.13, lat: 43.58 },
  { key: "monaco", label: "Monaco", lon: 7.42, lat: 43.73 },
  { key: "cannes", label: "Cannes", lon: 7.02, lat: 43.55 },
  { key: "tropez", label: "St. Tropez", lon: 6.64, lat: 43.27 },
  { key: "genoa", label: "Genoa", lon: 8.93, lat: 44.41 },
  { key: "barcelona", label: "Barcelona", lon: 2.17, lat: 41.39 },
  { key: "ibiza", label: "Ibiza", lon: 1.43, lat: 38.91 },
  { key: "valletta", label: "Valletta", lon: 14.51, lat: 35.9 },
  { key: "malta", label: "Valletta", lon: 14.51, lat: 35.9 },
  { key: "gibraltar", label: "Gibraltar", lon: -5.35, lat: 36.14 },
  { key: "cervo", label: "Porto Cervo", lon: 9.53, lat: 41.13 },
  { key: "split", label: "Split", lon: 16.44, lat: 43.51 },
  { key: "athens", label: "Athens", lon: 23.65, lat: 37.94 },
  { key: "piraeus", label: "Athens", lon: 23.65, lat: 37.94 },
  { key: "bodrum", label: "Bodrum", lon: 27.43, lat: 37.03 },
  { key: "lauderdale", label: "Fort Lauderdale", lon: -80.14, lat: 26.12 },
  { key: "miami", label: "Miami", lon: -80.19, lat: 25.76 },
  { key: "newport", label: "Newport", lon: -71.31, lat: 41.49 },
  { key: "singapore", label: "Singapore", lon: 103.82, lat: 1.35 },
  { key: "dubai", label: "Dubai", lon: 55.27, lat: 25.2 },
  { key: "hong kong", label: "Hong Kong", lon: 114.17, lat: 22.28 },
  { key: "phuket", label: "Phuket", lon: 98.39, lat: 7.89 },
  { key: "sydney", label: "Sydney", lon: 151.21, lat: -33.87 },
  { key: "auckland", label: "Auckland", lon: 174.76, lat: -36.85 },
  { key: "cape town", label: "Cape Town", lon: 18.42, lat: -33.92 },
];

const HQ = PORTS[0];

function project(lon: number, lat: number) {
  return { x: (lon + 180) * (1000 / 360), y: (90 - lat) * (500 / 180) };
}

// Deterministic fallback position for a port that isn't in the known list above,
// so the map always plots something instead of silently dropping the request.
function pseudoLocation(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return { lon: (hash % 300) - 150, lat: (Math.floor(hash / 300) % 90) - 40 };
}

function matchPort(portText: string): PortRef | null {
  const norm = portText.trim().toLowerCase();
  if (!norm) return null;
  const known = PORTS.slice(1).find((p) => norm.includes(p.key));
  if (known) return known;
  return { key: norm, label: portText.trim(), ...pseudoLocation(norm) };
}

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function computeStats(expenses: Expense[]) {
  const monthStart = startOfMonth();
  const pending = expenses.filter((e) => e.status === "pending").length;

  const approvedThisMonth = expenses.filter(
    (e) => e.status === "approved" && e.reviewed_at && new Date(e.reviewed_at) >= monthStart
  );
  const approvedMtd = approvedThisMonth.length;
  const spendMtd = approvedThisMonth.reduce((sum, e) => sum + e.amount_cents, 0) / 100;

  const reviewedThisMonth = expenses.filter((e) => e.reviewed_at && new Date(e.reviewed_at) >= monthStart);
  const avgHours =
    reviewedThisMonth.length === 0
      ? null
      : reviewedThisMonth.reduce((sum, e) => {
          const created = new Date(e.created_at).getTime();
          const reviewed = new Date(e.reviewed_at as string).getTime();
          return sum + (reviewed - created) / 3_600_000;
        }, 0) / reviewedThisMonth.length;

  return { pending, approvedMtd, spendMtd, avgHours };
}

function statusClass(status: ExpenseStatus) {
  return `mer-status-${status}`;
}

const STATUS_ACCENT: Record<ExpenseStatus, string> = {
  pending: "var(--accent)",
  approved: "var(--success)",
  rejected: "var(--danger)",
};

function capitalize(s: string) {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

// Animates a stat from 0 up to its real value once the data has loaded,
// so the dashboard reads like a live ticker instead of a static snapshot.
function useCountUp(target: number) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const duration = 700;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return display;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const isManager = profile?.role === "manager";
  const [expenses, setExpenses] = useState<ExpenseWithSubmitter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);

    const query = isManager
      ? supabase
          .from("expenses")
          .select("*, submitter:profiles!expenses_submitter_id_fkey(full_name)")
          .order("created_at", { ascending: false })
      : supabase.from("expenses").select("*").eq("submitter_id", user.id).order("created_at", { ascending: false });

    query.then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error("Failed to load dashboard data", error);
      } else {
        setExpenses((data as ExpenseWithSubmitter[]) ?? []);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, isManager]);

  const stats = useMemo(() => computeStats(expenses), [expenses]);
  const pendingCount = useCountUp(stats.pending);
  const approvedCount = useCountUp(stats.approvedMtd);
  const spendCount = useCountUp(stats.spendMtd);
  const avgHoursCount = useCountUp(stats.avgHours ?? 0);

  const listItems = useMemo(
    () => (isManager ? expenses.filter((e) => e.status === "pending") : expenses).slice(0, 6),
    [expenses, isManager]
  );

  const mapPoints = useMemo(() => {
    const seen = new Map<string, { label: string; x: number; y: number }>();
    for (const e of expenses) {
      if (!e.port || seen.size >= 8) continue;
      const match = matchPort(e.port);
      if (match && !seen.has(match.key)) {
        seen.set(match.key, { label: match.label, ...project(match.lon, match.lat) });
      }
    }
    return Array.from(seen.values());
  }, [expenses]);

  const hq = project(HQ.lon, HQ.lat);

  return (
    <div>
      <Nav />
      <div className="mer-page mer-dash">
        <div className="mer-dash-stats">
          <div className="mer-stat">
            <div className="mer-stat-value">{loading ? "–" : Math.round(pendingCount)}</div>
            <div className="mer-stat-label">{isManager ? "Pending Approvals" : "Your Pending"}</div>
          </div>
          <div className="mer-stat">
            <div className="mer-stat-value">{loading ? "–" : Math.round(approvedCount)}</div>
            <div className="mer-stat-label">Approved &middot; MTD</div>
          </div>
          <div className="mer-stat">
            <div className="mer-stat-value">
              {loading ? "–" : `€${spendCount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
            </div>
            <div className="mer-stat-label">Total Spend &middot; MTD</div>
          </div>
          <div className="mer-stat">
            <div className="mer-stat-value">
              {loading || stats.avgHours === null ? "—" : `${avgHoursCount.toFixed(1)}H`}
            </div>
            <div className="mer-stat-label">Avg Approval Time</div>
          </div>
        </div>

        <div className="mer-dash-main">
          <div className="mer-dash-panel mer-dash-map-panel">
            <div className="mer-dash-panel-header">
              <span>Global Request Map</span>
            </div>
            <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" className="mer-dash-map-svg" xmlns="http://www.w3.org/2000/svg">
              <path className="mer-dash-continent" d="M42,61 L100,50 L235,55 L295,100 L294,137 L277,180 L277,225 L230,210 L172,156 L158,114 Z" />
              <path className="mer-dash-continent" d="M277,225 L319,219 L370,240 L403,272 L390,300 L381,314 L340,370 L311,403 L295,370 L303,342 L278,283 L278,244 Z" />
              <path className="mer-dash-continent" d="M475,147 L491,100 L500,70 L556,56 L600,65 L667,97 L640,120 L569,144 L533,131 L500,145 Z" />
              <path className="mer-dash-continent" d="M483,153 L535,150 L589,164 L610,190 L642,219 L642,244 L611,261 L590,300 L550,344 L520,320 L533,267 L500,240 L522,236 L475,220 L453,208 L465,175 Z" />
              <path className="mer-dash-continent" d="M597,142 L650,100 L750,69 L850,55 L944,94 L986,67 L950,140 L889,150 L860,190 L836,164 L792,225 L806,269 L760,250 L717,228 L703,197 L653,181 L600,190 L560,160 Z" />
              <path className="mer-dash-continent" d="M814,311 L864,283 L900,290 L925,325 L903,356 L875,347 L822,339 L800,320 Z" />

              {mapPoints.map((p, i) => (
                <g key={p.label}>
                  <path
                    id={`dashroute-${i}`}
                    className="mer-dash-route"
                    d={`M${hq.x},${hq.y} L${p.x},${p.y}`}
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  <circle className="mer-dash-packet" r="2.8">
                    <animateMotion dur={`${5 + i}s`} begin={`${i * 0.6}s`} repeatCount="indefinite">
                      <mpath href={`#dashroute-${i}`} />
                    </animateMotion>
                  </circle>
                </g>
              ))}

              {mapPoints.map((p, i) => (
                <g key={`node-${p.label}`}>
                  <circle className="mer-dash-node-dot" cx={p.x} cy={p.y} r="3" />
                  <circle className="mer-dash-node-ring" cx={p.x} cy={p.y} r="3" style={{ animationDelay: `${i * 0.4}s` }} />
                  <text className="mer-dash-map-label" x={p.x + 7} y={p.y + [-6, 11, 19][i % 3]}>
                    {p.label.toUpperCase()}
                  </text>
                </g>
              ))}

              <circle className="mer-dash-hq-dot" cx={hq.x} cy={hq.y} r="3.5" />
              <text className="mer-dash-map-label mer-dash-map-label-hq" x={hq.x + 8} y={hq.y + 3}>
                HQ
              </text>
            </svg>
          </div>

          <div className="mer-dash-panel mer-dash-list-panel">
            <div className="mer-dash-panel-header">
              <span>{isManager ? "Pending Approvals" : "Your Requests"}</span>
              <span>{listItems.length}</span>
            </div>
            {loading ? (
              <p className="mer-muted mer-dash-empty">Loading&hellip;</p>
            ) : listItems.length === 0 ? (
              <p className="mer-muted mer-dash-empty">{isManager ? "Nothing pending." : "No requests yet."}</p>
            ) : (
              listItems.map((item) => (
                <div className="mer-dash-item" style={{ borderLeftColor: STATUS_ACCENT[item.status] }} key={item.id}>
                  <div>
                    <div className="mer-dash-item-title">
                      {isManager ? item.submitter?.full_name ?? "Unknown" : item.description}
                    </div>
                    <div className="mer-dash-item-sub">
                      {capitalize(item.category)}
                      {item.port ? ` · ${item.port}` : ""}
                      {isManager ? ` · ${item.description}` : ""}
                    </div>
                  </div>
                  <div className="mer-dash-item-right">
                    <div className="mer-dash-item-amount">&euro;{(item.amount_cents / 100).toFixed(2)}</div>
                    <div className={`mer-status-pill ${statusClass(item.status)}`}>{item.status}</div>
                  </div>
                </div>
              ))
            )}
            <Link to={isManager ? "/queue" : "/submit"} className="mer-dash-footer-link">
              {isManager ? "Open Full Queue →" : "Submit a Request →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

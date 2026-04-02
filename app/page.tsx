"use client";

import { useRef, useState, useEffect } from "react";
import { toast } from "sonner"

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ══════════════════════════════════════════
   ATOMS
══════════════════════════════════════════ */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.9)] animate-pulse" />
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-s font-bold tracking-[0.18em] uppercase text-zinc-400 mb-3">
      {children}
    </p>
  );
}

function StatusBadge({ status }: { status: "UP" | "DOWN" | "SLOW" }) {
  const map = {
    UP: { bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400", dot: "bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.9)]" },
    DOWN: { bg: "bg-red-500/10 border-red-500/30 text-red-400", dot: "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.9)]" },
    SLOW: { bg: "bg-amber-500/10 border-amber-500/30 text-amber-400", dot: "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.9)]" },
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${map[status].bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${map[status].dot}`} />
      {status}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const map: Record<string, string> = {
    GET: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    POST: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    PUT: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    DELETE: "text-red-400 bg-red-500/10 border-red-500/25",
  };
  return (
    <span className={`text-[11px] font-bold font-mono border px-2.5 py-0.5 rounded whitespace-nowrap ${map[method] || "text-zinc-400 bg-zinc-800 border-zinc-700"}`}>
      {method}
    </span>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD MOCKUP
   Fixed: proper table on desktop, card layout on mobile
══════════════════════════════════════════ */
const MOCK_APIS = [
  { name: "User Auth API", method: "GET", url: "api.acme.com/auth/verify", interval: "1 min", status: "UP" as const, ms: "48ms" },
  { name: "Payment Gateway", method: "POST", url: "api.acme.com/payments/charge", interval: "5 min", status: "DOWN" as const, ms: "—" },
  { name: "Product Catalog", method: "GET", url: "api.acme.com/products/list", interval: "1 min", status: "UP" as const, ms: "102ms" },
  { name: "Email Service", method: "POST", url: "api.acme.com/emails/send", interval: "15 min", status: "SLOW" as const, ms: "1,840ms" },
];

function DashboardMockup() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-800/60 bg-[#0f0f0f] shadow-[0_40px_120px_rgba(0,0,0,0.9),0_0_60px_rgba(34,197,94,0.04)]">

      {/* ── Browser chrome bar ── */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#111] border-b border-zinc-800/60">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57] shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e] shrink-0" />
        <span className="w-3 h-3 rounded-full bg-[#28c840] shrink-0" />
        <div className="ml-3 bg-zinc-900 border border-zinc-800 rounded px-3 py-1 flex items-center gap-2 min-w-0">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
            <circle cx="5" cy="5" r="4" stroke="#555" strokeWidth="1" />
            <path d="M5 3v2l1.5 1.5" stroke="#555" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] font-mono text-zinc-500 truncate">app.apisentinel.io/dashboard</span>
        </div>
      </div>

      {/* ── Dashboard layout ── */}
      <div className="flex min-h-0">

        {/* Sidebar — hidden on mobile, shown on md+ */}
        <div className="hidden md:flex w-44 shrink-0 border-r border-zinc-800/60 bg-[#0d0d0d] flex-col gap-1 p-3">
          <div className="flex items-center gap-2 mb-4 px-2 pt-1">
            <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path d="M1 6l2-4 2 3 2-2 2 4 2-1" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[12px] font-semibold text-zinc-200">API Sentinel</span>
          </div>
          {["Dashboard", "Projects", "Alerts", "API Checker"].map((item, i) => (
            <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] cursor-default ${i === 0 ? "bg-zinc-800/70 text-white font-medium" : "text-zinc-500"}`}>
              <div className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
              {item}
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-200 shrink-0">A</div>
            <span className="text-[11px] text-zinc-500 truncate">Akshay chaudhary</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 min-w-0">

          {/* Stat cards — 2 cols on mobile, 4 on md */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
            {[
              { label: "Total APIs", val: "6", sub: "Monitored", color: "text-zinc-100" },
              { label: "Avg Response", val: "110ms", sub: "Across all", color: "text-emerald-400" },
              { label: "Down Now", val: "1", sub: "Needs attention", color: "text-red-400" },
              { label: "Uptime (24h)", val: "97.8%", sub: "All endpoints", color: "text-emerald-400" },
            ].map(({ label, val, sub, color }) => (
              <div key={label} className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 mb-1 truncate">{label}</p>
                <p className={`text-xl font-bold leading-none mb-1 ${color}`}>{val}</p>
                <p className="text-[10px] text-zinc-600 truncate">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── API TABLE — desktop only (md+) ── */}
          <div className="hidden md:block bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="grid px-4 py-2.5 border-b border-zinc-800/60"
              style={{ gridTemplateColumns: "1.8fr 72px 1.6fr 70px 80px 70px" }}>
              {["API NAME", "METHOD", "ENDPOINT", "INTERVAL", "STATUS", "LATENCY"].map((h) => (
                <span key={h} className="text-[10px] font-bold tracking-widest uppercase text-zinc-600">{h}</span>
              ))}
            </div>
            {/* Rows */}
            {MOCK_APIS.map((api) => (
              <div
                key={api.name}
                className="grid items-center px-4 py-3 border-b border-zinc-800/30 last:border-0"
                style={{ gridTemplateColumns: "1.8fr 72px 1.6fr 70px 80px 70px" }}
              >
                <span className="text-[13px] font-medium text-zinc-100 truncate pr-2">{api.name}</span>
                <MethodBadge method={api.method} />
                <span className="text-[11px] font-mono text-zinc-500 truncate px-2">{api.url}</span>
                <span className="text-[12px] text-zinc-400">{api.interval}</span>
                <StatusBadge status={api.status} />
                <span className={`text-[12px] font-mono font-semibold ${api.status === "DOWN" ? "text-zinc-600" :
                  api.status === "SLOW" ? "text-amber-400" : "text-emerald-400"
                  }`}>{api.ms}</span>
              </div>
            ))}
          </div>

          {/* ── API CARDS — mobile only (hidden on md+) ── */}
          <div className="md:hidden space-y-2">
            {MOCK_APIS.map((api) => (
              <div key={api.name} className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[13px] font-semibold text-zinc-100 leading-tight">{api.name}</span>
                  <StatusBadge status={api.status} />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <MethodBadge method={api.method} />
                  <span className="text-[11px] font-mono text-zinc-500 truncate flex-1 min-w-0">{api.url}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500">Every {api.interval}</span>
                  <span className={`text-[12px] font-mono font-bold ${api.status === "DOWN" ? "text-zinc-600" :
                    api.status === "SLOW" ? "text-amber-400" : "text-emerald-400"
                    }`}>{api.ms}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROBLEM DIAGRAM
══════════════════════════════════════════ */
function ProblemDiagram() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0 select-none">
      {/* Server */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="18" height="7" rx="2" stroke="#22c55e" strokeWidth="1.4" /><rect x="2" y="13" width="18" height="7" rx="2" stroke="#22c55e" strokeWidth="1.4" /><circle cx="5.5" cy="5.5" r="1" fill="#22c55e" /><circle cx="5.5" cy="16.5" r="1" fill="#22c55e" /></svg>
          <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase">Server</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />UP
        </span>
      </div>

      {/* Arrow + fail label */}
      <div className="flex lg:flex-col items-center mx-2">
        <div className="flex items-center lg:flex-col gap-0">
          <div className="w-16 h-px lg:w-px lg:h-8 bg-zinc-700" />
          <svg className="rotate-0 lg:rotate-90" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M0 0l6 5-6 5V0z" fill="#3f3f46" /></svg>
        </div>
        <div className="ml-2 lg:ml-0 lg:mt-2 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5 text-center">
          <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider">API FAILS</p>
          <p className="text-[9px] text-zinc-600 mt-0.5">500 Error</p>
        </div>
      </div>

      {/* Users */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="7" r="4" stroke="#ef4444" strokeWidth="1.4" /><path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase">Your Users</span>
        </div>
        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">😤 Angry</span>
      </div>

      {/* VS */}
      <div className="mx-4 lg:mx-6 text-zinc-700 font-black text-sm border border-zinc-800 rounded-full w-8 h-8 flex items-center justify-center bg-zinc-900 shrink-0">VS</div>

      {/* Sentinel */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1.5 relative">
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" stroke="#22c55e" strokeWidth="1.4" strokeLinejoin="round" /><path d="M8 11l2 2 4-4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">Sentinel</span>
        </div>
        <span className="text-[10px] text-zinc-500 text-center leading-tight">Catches it<br />before users</span>
      </div>

      {/* Arrow + alert label */}
      <div className="flex lg:flex-col items-center mx-2">
        <div className="flex items-center lg:flex-col gap-0">
          <div className="w-16 h-px lg:w-px lg:h-8 bg-emerald-900" />
          <svg className="rotate-0 lg:rotate-90" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M0 0l6 5-6 5V0z" fill="#16a34a" /></svg>
        </div>
        <div className="ml-2 lg:ml-0 lg:mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5 text-center">
          <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">ALERT SENT</p>
          <p className="text-[9px] text-zinc-600 mt-0.5">Email / WhatsApp</p>
        </div>
      </div>

      {/* Developer */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-20 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M8 8l-4 3 4 3M14 8l4 3-4 3M12 6l-2 10" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="text-[10px] font-bold text-zinc-400 tracking-wide uppercase">Developer</span>
        </div>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">🔧 Fixing it</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Home() {
  const LINKEDIN_URL = "https://www.linkedin.com/in/akshay-punia/";
  const waitlistRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heroAnim = useInView(0.05);
  const problemAnim = useInView(0.05);
  const solutionAnim = useInView(0.05);
  const demoAnim = useInView(0.05);
  const waitlistAnim = useInView(0.05);

  const scrollToWaitlist = () =>
    waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  const handleSubmit = async (e: React.FormEvent) => {
    
    try {
      e.preventDefault();

      // RFC‑5322–ish but pragmatic email validation
      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailPattern.test(email.trim())) {
        setError("Please enter a valid work email address.");
        return;
      }
      

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/waitlist`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()

      setLoading(true);

      if(!response.ok){
        throw new Error(data.message || "Something went wrong")
      }
      setError("");

      // TODO: replace mock delay with real API call
      await new Promise((r) => setTimeout(r, 1200));
      setLoading(false);
      setSubmitted(true);
      setEmail("");
      toast.success("Congratulations! You're on the list! 🎉")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong";

      toast.error(message)
      console.log("error: Error adding to waitlist", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 overflow-x-hidden">

      {/* ── Background orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-[30%] right-[-100px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[20%] left-[-100px] w-[350px] h-[350px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ══ NAV ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 h-14 bg-[#080808]/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8l2.5-5 2.5 4 2.5-2 2.5 5 2.5-2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">API Sentinel</span>
          <span className="hidden sm:inline text-[9px] font-bold tracking-[0.12em] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            Early Access
          </span>
        </div>
        <button
          onClick={scrollToWaitlist}
          className="h-9 px-5 bg-white text-zinc-950 text-[13px] font-bold rounded-lg hover:bg-zinc-100 transition-all hover:-translate-y-0.5"
        >
          Join Waitlist
        </button>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-16 px-5 md:px-6 z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          }}
        />
        <div
          ref={heroAnim.ref}
          className={`relative z-10 max-w-4xl w-full transition-all duration-700 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Pill>Launching Soon — Join the Waitlist</Pill>

          <h1 className="mt-7 text-[clamp(38px,7vw,80px)] font-black leading-[1.02] tracking-[-0.04em] text-white">
            Know your APIs break —<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #4ade80 100%)" }}>
              Before your users do.
            </span>
          </h1>

          <p className="mt-5 text-[clamp(15px,2vw,22px)] text-zinc-300 max-w-[560px] mx-auto leading-relaxed">
            API Sentinel watches every endpoint 24/7. The moment something breaks or slows down —
            you get alerted on Email, WhatsApp, and Teams.{" "}
            <strong className="text-zinc-200 font-semibold">Before a single user complains.</strong>
          </p>

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={scrollToWaitlist}
              className="inline-flex items-center gap-2 h-12 px-7 bg-white text-zinc-950 text-[14px] font-bold rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              Get Early Access
            </button>
            <button
              onClick={scrollToWaitlist}
              className="inline-flex items-center gap-2 h-12 px-6 text-zinc-300 text-[14px] font-medium rounded-xl border border-zinc-800 hover:border-zinc-600 hover:text-white transition-all"
            >
              See how it works
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["#1d4ed8", "#7c3aed", "#b45309", "#065f46", "#9f1239"].map((color, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#080808] flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                  style={{ background: color }}>
                  {["A", "R", "S", "M", "P"][i]}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-zinc-400">
              <strong className="text-zinc-100">120+ developers</strong> already on the waitlist
            </p>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className={`relative z-10 w-full max-w-5xl mt-14 md:mt-16 transition-all duration-700 delay-300 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 rounded-full blur-3xl opacity-25"
            style={{ background: "rgba(34,197,94,0.4)" }} />
          <DashboardMockup />
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section className="relative z-10 py-20 md:py-24 px-5 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div
            ref={problemAnim.ref}
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${problemAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="text-[clamp(30px,5vw,52px)] font-black tracking-[-0.03em] text-white leading-tight">
              Your server is up.<br />
              <span className="text-red-400">Your APIs are silently dying.</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-[15px] md:text-[17px] max-w-lg mx-auto leading-relaxed">
              Uptime monitors only check if your server responds. They have no idea if your actual business logic is broken.
            </p>
          </div>

          {/* Problem cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="1.4" /><path d="M11 7v5M11 15h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                border: "border-red-500/15 bg-red-500/5", iconBg: "bg-red-500/10 border-red-500/20",
                tag: "Most Common", tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
                title: "Server up, API broken",
                desc: "Health check returns 200 OK, but your /checkout throws 500 after a deploy. Users can't buy. You don't know.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9" stroke="#f59e0b" strokeWidth="1.4" /><path d="M11 7v4l3 3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                border: "border-amber-500/15 bg-amber-500/5", iconBg: "bg-amber-500/10 border-amber-500/20",
                tag: "Silent Killer", tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                title: "You find out too late",
                desc: "A user tweets 'your app is broken.' Then your boss messages. Only then you open logs — 47 minutes after it started.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2L3 6v5c0 4.4 3.4 8.5 8 9.5 4.6-1 8-5.1 8-9.5V6L11 2z" stroke="#3b82f6" strokeWidth="1.4" strokeLinejoin="round" /></svg>,
                border: "border-blue-500/15 bg-blue-500/5", iconBg: "bg-blue-500/10 border-blue-500/20",
                tag: "Trust Issue", tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                title: "Auth endpoints fail silently",
                desc: "Login API returns 200 but token is invalid. Users get logged out randomly. Uptime tools can't test authenticated routes.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M3 3h16v12H3z" stroke="#ef4444" strokeWidth="1.4" strokeLinejoin="round" /><path d="M7 19h8M11 15v4" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" /></svg>,
                border: "border-red-500/15 bg-red-500/5", iconBg: "bg-red-500/10 border-red-500/20",
                tag: "Revenue Loss", tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
                title: "Third-party APIs go down",
                desc: "Payment gateway, email service, or SMS provider goes down. Your app breaks. You only monitor your server — not external deps.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" /><circle cx="11" cy="11" r="4" stroke="#f59e0b" strokeWidth="1.4" /></svg>,
                border: "border-amber-500/15 bg-amber-500/5", iconBg: "bg-amber-500/10 border-amber-500/20",
                tag: "Performance", tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                title: "Slow is the new down",
                desc: "API takes 8 seconds instead of 80ms. Not 'down' so no alert fires. Users are bouncing. Revenue dropping.",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M4 4l14 14M4 18L18 4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                border: "border-red-500/15 bg-red-500/5", iconBg: "bg-red-500/10 border-red-500/20",
                tag: "Wrong Tool", tagColor: "text-red-400 bg-red-500/10 border-red-500/20",
                title: "Postman isn't monitoring",
                desc: "Manual Postman tests before deploy = QA, not monitoring. Production breaks at 3am after you've closed your laptop.",
              },
            ].map(({ icon, border, iconBg, tag, tagColor, title, desc }) => (
              <div key={title} className={`rounded-2xl border p-5 ${border} transition-all duration-200 hover:-translate-y-0.5`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
                  <span className={`text-[9px] font-bold tracking-widest uppercase border px-2 py-0.5 rounded-full ${tagColor}`}>{tag}</span>
                </div>
                <h3 className="text-[18px] font-bold text-white mb-1.5">{title}</h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Flow diagram */}
          <div className={`rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-6 md:p-10 transition-all duration-700 ${problemAnim.visible ? "opacity-100" : "opacity-0"}`}>
            <p className="text-center text-[13px] font-bold tracking-[0.18em] uppercase text-zinc-300 mb-8">Without API Sentinel vs With API Sentinel</p>
            <ProblemDiagram />
          </div>
        </div>
      </section>

      {/* ══ SOLUTION ══ */}
      <section className="relative z-10 py-20 md:py-24 px-5 md:px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div
            ref={solutionAnim.ref}
            className={`text-center mb-12 md:mb-16 transition-all duration-700 ${solutionAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <SectionLabel>The Solution</SectionLabel>
            <h2 className="text-[clamp(30px,5vw,52px)] font-black tracking-[-0.03em] text-white leading-tight">
              A watchdog that never<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #22c55e, #4ade80)" }}>
                sleeps, never misses.
              </span>
            </h2>
            <p className="mt-4 text-zinc-400 text-[15px] md:text-[17px] max-w-lg mx-auto leading-relaxed">
              API Sentinel pings every endpoint on your schedule, validates the response, tracks performance, and alerts you the moment something breaks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="1.5" /><path d="M12 6v6l4 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                accentColor: "#22c55e", borderCls: "border-emerald-500/15 hover:border-emerald-500/25", dotCls: "bg-emerald-400",
                title: "Continuous Monitoring",
                desc: "Register any endpoint — GET, POST, PUT, DELETE — with custom intervals from 1 minute to 1 hour. Sentinel pings it 24/7.",
                features: ["Every HTTP method", "1 min to 1 hr intervals", "Authenticated endpoints", "Custom status code rules"],
              },
              {
                num: "02",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="#3b82f6" strokeWidth="1.5" /><path d="M3 9h18M9 21V9" stroke="#3b82f6" strokeWidth="1.5" /></svg>,
                accentColor: "#3b82f6", borderCls: "border-blue-500/15 hover:border-blue-500/25", dotCls: "bg-blue-400",
                title: "Detailed Logs",
                desc: "Every check is logged — response time, status code, timestamp. See exactly when things broke and how often it happens.",
                features: ["Response time history", "Status code logs", "Incident timeline", "Performance trends"],
              },
              {
                num: "03",
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                accentColor: "#f59e0b", borderCls: "border-amber-500/15 hover:border-amber-500/25", dotCls: "bg-amber-400",
                title: "Instant Alerts",
                desc: "API fails or slows beyond your threshold — you're notified immediately. No dashboards to refresh. The alert finds you.",
                features: ["📧 Email alerts", "💬 WhatsApp (coming)", "🟦 MS Teams (coming)", "Custom thresholds"],
              },
            ].map(({ num, icon, accentColor, borderCls, dotCls, title, desc, features }) => (
              <div key={title} className={`relative rounded-2xl border bg-zinc-900/30 p-6 transition-all duration-200 hover:-translate-y-0.5 ${borderCls}`}>
                <div className="absolute top-5 right-5 text-[36px] font-black leading-none select-none" style={{ color: accentColor }}>{num}</div>
                <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-4">{icon}</div>
                <h3 className="text-[18px] font-bold text-white mb-2">{title}</h3>
                <p className="text-[15px] text-zinc-300 leading-relaxed mb-4">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-zinc-300">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotCls}`} />{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-12 rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-6 md:p-8">
            <p className="text-center text-[15px] font-bold tracking-[0.18em] uppercase text-zinc-300 mb-8">How it works</p>
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-3 relative">
              <div className="hidden md:block absolute top-5 left-[8%] right-[8%] h-px bg-zinc-800" />
              {[
                { step: "1", label: "Register API", desc: "Add endpoint URL, method & auth", icon: "📝" },
                { step: "2", label: "Set Interval", desc: "Choose check frequency (1–60 min)", icon: "⏱️" },
                { step: "3", label: "We Monitor", desc: "Sentinel pings it around the clock", icon: "👁️" },
                { step: "4", label: "API Fails", desc: "We detect the failure instantly", icon: "🚨" },
                { step: "5", label: "You're Alerted", desc: "Email, WhatsApp, Teams — you choose", icon: "📱" },
              ].map(({ step, label, desc, icon }) => (
                <div key={step} className="flex md:flex-col items-center md:items-center gap-3 md:gap-0 text-left md:text-center flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-base shrink-0 md:mb-2.5">{icon}</div>
                  <div>
                    <div className="text-[12px] font-bold tracking-widest uppercase text-zinc-400 mb-0.5">Step {step}</div>
                    <div className="text-[15px] font-bold text-white mb-0.5">{label}</div>
                    <div className="text-[12px] text-zinc-400 leading-snug">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEMO ══ */}
      <section className="relative z-10 py-20 md:py-24 px-5 md:px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div
            ref={demoAnim.ref}
            className={`text-center mb-10 md:mb-14 transition-all duration-700 ${demoAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <SectionLabel>Product Preview</SectionLabel>
            <h2 className="text-[clamp(30px,5vw,50px)] font-black tracking-[-0.03em] text-white leading-tight">
              Built for developers.<br />
              <span className="text-zinc-300 font-light italic" style={{ fontFamily: "Georgia, serif" }}>Designed for clarity.</span>
            </h2>
            <p className="mt-4 text-zinc-400 text-[15px] md:text-[16px] max-w-lg mx-auto">
              See every API's health at a glance. Know what's up, what's down, and how fast everything responds.
            </p>
          </div>

          <div className={`relative z-10 w-full max-w-5xl mt-14 md:mt-16 transition-all duration-700 delay-300 ${heroAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 rounded-full blur-3xl opacity-25"
              style={{ background: "rgba(34,197,94,0.4)" }} />
            <DashboardMockup />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { val: "< 60s", label: "Alert delivery time", sub: "From failure to your inbox" },
              { val: "99.9%", label: "Monitoring uptime", sub: "Our infrastructure SLA" },
              { val: "1 min", label: "Min check interval", sub: "Catch failures fast" },
            ].map(({ val, label, sub }) => (
              <div key={label} className="text-center p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/20">
                <div className="text-[30px] md:text-[34px] font-black text-white tracking-tight mb-1">{val}</div>
                <div className="text-[18px] font-semibold text-zinc-200 mb-0.5">{label}</div>
                <div className="text-[15px] text-zinc-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WAITLIST ══ */}
      <section className="relative z-10 py-20 md:py-24 px-5 md:px-6 border-t border-zinc-900" ref={waitlistRef}>
        <div className="max-w-lg mx-auto">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

          <div
            ref={waitlistAnim.ref}
            className={`relative transition-all duration-700 ${waitlistAnim.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-center mb-10">
              <SectionLabel>Join the Waitlist</SectionLabel>
              <h2 className="text-[clamp(32px,5vw,54px)] font-black tracking-[-0.04em] text-white leading-[1.05] mb-4">
                Be the first to<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)" }}>
                  know when we launch.
                </span>
              </h2>
              <p className="text-zinc-400 text-[18px] leading-relaxed max-w-sm mx-auto">
                Early access members get <strong className="text-zinc-200">1 months free</strong> and priority onboarding. No credit card required.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl border border-zinc-800 bg-[#0f0f0f] p-6 md:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              {submitted ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
                    <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M6 14l5 5 11-11" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <h3 className="text-[20px] font-bold text-white mb-2">You're on the list! 🎉</h3>
                  <p className="text-zinc-400 text-[14px]">We'll email you the moment API Sentinel launches.</p>
                  <button
                    type="button"
                    onClick={() => window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer")}
                    className="mt-5 inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-700 bg-zinc-900/80 text-zinc-100 text-[13px] font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.06c.53-1 1.84-2.05 3.78-2.05C21.71 8.6 22 11.24 22 14.66V21h-4v-5.62c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z" />
                    </svg>
                    Follow the build journey
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
                    <div>
                      <label className="block text-[13px] font-bold tracking-[0.13em] uppercase text-zinc-400 mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@company.com"
                        className="w-full h-12 px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-[14px] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all font-mono"
                        autoComplete="off"
                      />
                      {error && (
                        <p className="mt-1.5 text-[12px] text-red-400 flex items-center gap-1.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.5" stroke="currentColor" strokeWidth="1" /><path d="M5 3v2M5 7h.01" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                          {error}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-white text-zinc-950 font-bold text-[14px] rounded-xl hover:bg-zinc-100 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Adding you to the list…
                        </>
                      ) : (
                        <>
                          Join the Waitlist
                          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </>
                      )}
                    </button>
                  </form>
                  <div className="mt-5 flex items-center justify-center gap-5 flex-wrap">
                    {["No credit card", "Free early access", "Cancel anytime"].map((t) => (
                      <div key={t} className="flex items-center gap-1.5 text-[13px] text-zinc-300">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {t}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Alert channels */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <p className="text-[15px] text-zinc-300 uppercase tracking-widest font-bold w-full text-center mb-1">Alert channels</p>
              {[
                { icon: "📧", label: "Email", badge: "Live", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
                { icon: "💬", label: "WhatsApp", badge: "Soon", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
                { icon: "🟦", label: "MS Teams", badge: "Soon", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
              ].map(({ icon, label, badge, color }) => (
                <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50">
                  <span className="text-[14px]">{icon}</span>
                  <span className="text-[13px] text-zinc-300 font-medium">{label}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.5 rounded-full ${color}`}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="relative z-10 border-t border-zinc-900 py-8 px-5 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path d="M1 7l2-4 2 3 2-2 2 4 2-1" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[18px] font-bold text-white">API Sentinel</p>
            </div>
          </div>

          <p className="text-[15px] text-zinc-300">
            © {new Date().getFullYear()} API Sentinel. All rights reserved.
          </p>

          <div className="flex items-center gap-2.5">
            {[
              { label: "Twitter / X", href: "#", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
              { label: "GitHub", href: "#", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg> },
              { label: "LinkedIn", href: "#", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
            ].map(({ label, href, icon }) => (
              <a key={label} href={href} aria-label={label}
                className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 transition-all hover:-translate-y-0.5">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
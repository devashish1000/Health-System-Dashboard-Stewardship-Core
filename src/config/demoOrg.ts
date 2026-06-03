import type { UserPersona } from "../types";

/**
 * Demo "today" — pins close month, ledger range, and UI as-of labels.
 * June 2, 2026 → close May 2026 (FY26 P05); ledger Jan–May actuals.
 */
export const DEMO_AS_OF = new Date(2026, 5, 2); // 2026-06-02 local

/**
 * Synthetic ledger sizing (close-month rows = templates; total ≈ templates × months).
 * Below ~40 close-month rows, facility filters and service-line drills look like n=1–2 samples.
 */
export const LEDGER_TARGET_CLOSE_MONTH_ROWS = 64;
export const LEDGER_TARGET_MONTHS_YTD = 5;

/** Houston-primary, multi-market demo org (synthetic — not operational data). */
export const DEMO_DISCLAIMER =
  "Concept prototype · not affiliated with or endorsed by CommonSpirit Health · synthetic ledger · no PHI";

export const HOUSTON_MARKET = "Houston Market";
export const HOME_FACILITY = "Baylor St. Luke's Medical Center";

/** Per close-month row scaling applied in synthetic ledger generation. */
/** Houston templates are pre-sized for flagship AMC scale; other markets are scaled up at generation. */
export const REGION_LEDGER_SCALE: Record<string, number> = {
  [HOUSTON_MARKET]: 1,
  "Midwest Region": 2.4,
  "Mountain Region": 2.4,
  "Pacific Region": 2.4,
  "Southwest Region": 2.4,
};

export interface PersonaPreset {
  persona: UserPersona;
  name: string;
  email: string;
  /** Full title for modals and login cards */
  role: string;
  /** Compact label for top bar (avoids truncation) */
  headerTitle: string;
  desc: string;
  emoji: string;
  initials: string;
  grad: string;
}

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    persona: "analyst",
    name: "Devashish Neupane",
    email: "devashish.neupane@commonspirit.org",
    role: "Sr Financial Analyst — Supply Chain Finance",
    headerTitle: "Sr Financial Analyst",
    desc: "Supply chain budgets, variance reporting, and initiative ROI for Houston market leaders",
    emoji: "📊",
    initials: "DN",
    grad: "from-brand-600 to-brand-800",
  },
  {
    persona: "cfo",
    name: "Elena Marsh",
    email: "elena.marsh@commonspirit.org",
    role: "Director, Market Finance",
    headerTitle: "Market Finance",
    desc: "Market P&L oversight, cycle close sign-off, and board-ready stewardship briefs",
    emoji: "💼",
    initials: "EM",
    grad: "from-emerald-600 to-teal-500",
  },
  {
    persona: "director",
    name: "Robert Kane",
    email: "robert.kane@commonspirit.org",
    role: "Director, Supply Chain Operations",
    headerTitle: "Supply Chain Ops",
    desc: "GPO initiatives, implant utilization, and expense predictability with Finance partners",
    emoji: "📦",
    initials: "RK",
    grad: "from-brand-400 to-brand-600",
  },
  {
    persona: "auditor",
    name: "Priya Nair",
    email: "priya.nair@commonspirit.org",
    role: "Finance Compliance Analyst",
    headerTitle: "Finance Compliance",
    desc: "Internal controls, allocation audits, and regulatory readiness for Finance reporting",
    emoji: "🔍",
    initials: "PN",
    grad: "from-teal-600 to-cyan-500",
  },
];

export function getPersonaPreset(persona: UserPersona): PersonaPreset {
  return PERSONA_PRESETS.find((p) => p.persona === persona) ?? PERSONA_PRESETS[0];
}

/** Synthetic service-line / cost-center owners (not real individuals). */
export const LEDGER_OWNER_BY_REGION: Record<string, string> = {
  [HOUSTON_MARKET]: "Carmen Alvarez",
  "Midwest Region": "Elena Marsh",
  "Mountain Region": "Noah Whitaker",
  "Pacific Region": "Sofia Delgado",
  "Southwest Region": "James Porter",
};

export const DEFAULT_LEDGER_OWNER = "Carmen Alvarez";

/** Flavor-only: leadership titles seen in public CommonSpirit / St. Luke's announcements. */
export const PUBLIC_LEADERSHIP_FLAVOR = [
  "Reports align to St. Luke's Health Houston market leadership and CommonSpirit Finance standards.",
  "Briefings are formatted for market finance leaders reviewing supply chain initiative performance.",
];

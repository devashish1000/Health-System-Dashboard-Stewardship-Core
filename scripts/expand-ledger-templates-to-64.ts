/**
 * Expands LEDGER_COMBO_TEMPLATES from 32 → 64 balanced facility×service-line combos.
 * Run: npx tsx scripts/expand-ledger-templates-to-64.ts
 */
import { writeFileSync } from "node:fs";
import { LEDGER_COMBO_TEMPLATES } from "../src/data/ledgerComboTemplates.ts";
import { LEDGER_OWNER_BY_REGION, HOUSTON_MARKET } from "../src/config/demoOrg.ts";

type Template = (typeof LEDGER_COMBO_TEMPLATES)[number];
type TemplateMutable = {
  facility: string;
  region: string;
  service_line: string;
  net_patient_revenue: number;
  operating_expense: number;
  labor_cost: number;
  supply_cost: number;
  operating_margin: number;
  budget_variance: number;
  patient_volume: number;
  payer_mix_index: number;
  denial_rate: number;
  reimbursement_delay_days: number;
  overtime_utilization: number;
  forecasted_margin: number;
  variance_status: "Favorable" | "Watchlist" | "Unfavorable";
  payer_type: "Commercial" | "Medicare" | "Medicaid" | "Self-Pay" | "Other";
  owner: string;
};

function key(t: { facility: string; service_line: string }) {
  return `${t.facility}|${t.service_line}`;
}

function findSeed(
  region: string,
  serviceLine: string,
  preferFacility?: string
): Template {
  const pool = [...LEDGER_COMBO_TEMPLATES] as Template[];
  const hit =
    pool.find((t) => t.facility === preferFacility && t.service_line === serviceLine) ??
    pool.find((t) => t.region === region && t.service_line === serviceLine) ??
    pool.find((t) => t.service_line === serviceLine) ??
    pool[0];
  return hit;
}

function scaleTemplate(
  seed: Template,
  facility: string,
  region: string,
  serviceLine: string,
  scale: number,
  owner: string,
  tweaks?: Partial<TemplateMutable>
): TemplateMutable {
  const npr = Math.round(seed.net_patient_revenue * scale);
  const opex = Math.round(seed.operating_expense * scale);
  const labor = Math.round(seed.labor_cost * scale);
  const supply = Math.round(seed.supply_cost * scale);
  const margin = npr > 0 ? parseFloat((((npr - opex) / npr) * 100).toFixed(2)) : seed.operating_margin;
  let variance_status = seed.variance_status;
  if (margin < 0) variance_status = "Unfavorable";
  else if (margin < 6.5) variance_status = "Watchlist";
  else if (margin > 10) variance_status = "Favorable";

  return {
    facility,
    region,
    service_line: serviceLine,
    net_patient_revenue: npr,
    operating_expense: opex,
    labor_cost: labor,
    supply_cost: supply,
    operating_margin: margin,
    budget_variance: Math.round(seed.budget_variance * scale),
    patient_volume: Math.round(seed.patient_volume * scale),
    payer_mix_index: parseFloat((seed.payer_mix_index * (0.95 + (scale % 3) * 0.02)).toFixed(2)),
    denial_rate: parseFloat(Math.max(1, seed.denial_rate * (scale > 0.5 ? 1 : 1.05)).toFixed(1)),
    reimbursement_delay_days: Math.round(seed.reimbursement_delay_days * (scale > 0.6 ? 1 : 1.08)),
    overtime_utilization: parseFloat(
      Math.max(2, seed.overtime_utilization * (scale < 0.7 ? 1.1 : 1)).toFixed(1)
    ),
    forecasted_margin: parseFloat(
      Math.max(0, margin + (seed.forecasted_margin - seed.operating_margin) * 0.85).toFixed(2)
    ),
    variance_status,
    payer_type: seed.payer_type,
    owner,
    ...tweaks,
  };
}

const NEW_COMBOS: Array<{
  facility: string;
  region: string;
  service_line: string;
  scale: number;
  owner?: string;
  seedFacility?: string;
  tweaks?: Partial<TemplateMutable>;
}> = [
  // Houston satellites — 3 lines each
  { facility: "St. Luke's Hospital — The Woodlands", region: HOUSTON_MARKET, service_line: "Cardiology", scale: 0.42, owner: "Carmen Alvarez" },
  { facility: "St. Luke's Hospital — The Woodlands", region: HOUSTON_MARKET, service_line: "Surgical Supplies", scale: 0.38, owner: "Devashish Neupane" },
  { facility: "St. Luke's Hospital — The Woodlands", region: HOUSTON_MARKET, service_line: "Imaging", scale: 0.45, owner: "Carmen Alvarez" },
  { facility: "St. Luke's Lakeside Hospital", region: HOUSTON_MARKET, service_line: "Emergency", scale: 0.35, owner: "Carmen Alvarez" },
  { facility: "St. Luke's Lakeside Hospital", region: HOUSTON_MARKET, service_line: "Orthopedics", scale: 0.4, owner: "Robert Kane" },
  { facility: "St. Luke's Lakeside Hospital", region: HOUSTON_MARKET, service_line: "Cardiology", scale: 0.38, owner: "Carmen Alvarez" },
  { facility: "St. Luke's Hospital — Sugar Land", region: HOUSTON_MARKET, service_line: "Cardiology", scale: 0.36, owner: "Carmen Alvarez" },
  { facility: "St. Luke's Hospital — Sugar Land", region: HOUSTON_MARKET, service_line: "Pharmacy Distribution", scale: 0.34, owner: "Devashish Neupane" },
  { facility: "St. Luke's Hospital — Sugar Land", region: HOUSTON_MARKET, service_line: "Emergency", scale: 0.32, owner: "Carmen Alvarez" },
  // Flagship gaps
  { facility: "Baylor St. Luke's Medical Center", region: HOUSTON_MARKET, service_line: "Neurology", scale: 0.55, owner: "Carmen Alvarez" },
  { facility: "Baylor St. Luke's Medical Center", region: HOUSTON_MARKET, service_line: "Emergency", scale: 0.48, owner: "Carmen Alvarez" },
  // Midwest
  { facility: "CHI Health Lakeside", region: "Midwest Region", service_line: "Neurology", scale: 0.55, owner: "James Porter" },
  { facility: "CHI Health Lakeside", region: "Midwest Region", service_line: "Emergency", scale: 0.45, owner: "James Porter" },
  { facility: "CHI Health Lakeside", region: "Midwest Region", service_line: "Surgical Supplies", scale: 0.4, owner: "Elena Marsh" },
  { facility: "CHI Health Mercy Council Bluffs", region: "Midwest Region", service_line: "Orthopedics", scale: 0.5, owner: "James Porter" },
  { facility: "CHI Health Mercy Council Bluffs", region: "Midwest Region", service_line: "Primary Care", scale: 0.42, owner: "James Porter" },
  { facility: "CHI Health Mercy Council Bluffs", region: "Midwest Region", service_line: "Surgical Supplies", scale: 0.35, owner: "Elena Marsh" },
  { facility: "CHI Immanuel", region: "Midwest Region", service_line: "Imaging", scale: 0.52, owner: "Elena Marsh" },
  { facility: "CHI Immanuel", region: "Midwest Region", service_line: "Orthopedics", scale: 0.58, owner: "Elena Marsh" },
  // Mountain
  { facility: "St. Joseph Medical Center", region: "Mountain Region", service_line: "Emergency", scale: 0.48, owner: "Noah Whitaker" },
  { facility: "St. Joseph Medical Center", region: "Mountain Region", service_line: "Imaging", scale: 0.5, owner: "Noah Whitaker" },
  { facility: "St. Joseph Medical Center", region: "Mountain Region", service_line: "Primary Care", scale: 0.44, owner: "Noah Whitaker" },
  { facility: "St. Anthony North", region: "Mountain Region", service_line: "Cardiology", scale: 0.52, owner: "Noah Whitaker" },
  { facility: "St. Anthony North", region: "Mountain Region", service_line: "Emergency", scale: 0.4, owner: "Noah Whitaker" },
  { facility: "Mercy Lakewood", region: "Mountain Region", service_line: "Emergency", scale: 0.42, owner: "Noah Whitaker" },
  { facility: "Mercy Lakewood", region: "Mountain Region", service_line: "Imaging", scale: 0.46, owner: "Noah Whitaker" },
  // Pacific
  { facility: "Mercy General", region: "Pacific Region", service_line: "Orthopedics", scale: 0.55, owner: "Sofia Delgado" },
  { facility: "Mercy General", region: "Pacific Region", service_line: "Imaging", scale: 0.5, owner: "Sofia Delgado" },
  { facility: "Mercy General", region: "Pacific Region", service_line: "Neurology", scale: 0.48, owner: "Sofia Delgado" },
  // Southwest
  { facility: "Mercy Gilbert", region: "Southwest Region", service_line: "Orthopedics", scale: 0.52, owner: "Noah Whitaker" },
  { facility: "Mercy Gilbert", region: "Southwest Region", service_line: "Emergency", scale: 0.45, owner: "Noah Whitaker" },
  { facility: "Mercy Gilbert", region: "Southwest Region", service_line: "Primary Care", scale: 0.4, owner: "Noah Whitaker" },
];

const existing = new Set(LEDGER_COMBO_TEMPLATES.map((t) => key(t)));
const additions: TemplateMutable[] = [];

for (const combo of NEW_COMBOS) {
  if (existing.has(key(combo))) continue;
  const owner = combo.owner ?? LEDGER_OWNER_BY_REGION[combo.region] ?? "Carmen Alvarez";
  const seed = findSeed(combo.region, combo.service_line, combo.seedFacility);
  additions.push(
    scaleTemplate(seed, combo.facility, combo.region, combo.service_line, combo.scale, owner, combo.tweaks)
  );
  existing.add(key(combo));
}

const merged = [...LEDGER_COMBO_TEMPLATES, ...additions];
if (merged.length !== 64) {
  console.warn(`Expected 64 templates, got ${merged.length} (${additions.length} added)`);
}

writeFileSync(
  "src/data/ledgerComboTemplates.ts",
  `// Combo templates for synthetic ledger generation (${merged.length} facility×service-line seeds)\n` +
    `export const LEDGER_COMBO_TEMPLATES = ${JSON.stringify(merged, null, 2)} as const;\n`
);
console.log(`Wrote ${merged.length} templates (+${additions.length} new)`);

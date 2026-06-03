import type { FinanceRecord } from "../types/financeRecord";
import { LEDGER_COMBO_TEMPLATES } from "./ledgerComboTemplates";
import {
  monthsThroughClose,
  parseYearMonth,
  resolveCloseMonth,
} from "../lib/fiscalCalendar";

const VARIANCE_NOTES: Record<FinanceRecord["variance_status"], string[]> = {
  Favorable: [
    "Volume recovery ahead of budget; outpatient mix favorable for {period}.",
    "Payer mix and collection timing improved during {period} close.",
    "Elective procedural growth offset supply inflation for {period}.",
  ],
  Watchlist: [
    "Slight labor expense pressure; active recruitment open for {period}.",
    "Denial backlog elevated — month-end AR review scheduled for {period}.",
    "Margin within tolerance but below stewardship target for {period}.",
  ],
  Unfavorable: [
    "Premium registry nursing required for {period} volume surge.",
    "Commercial denial rate elevated; prior-auth taskforce engaged for {period}.",
    "Expense overrun vs budget during {period}; director review in progress.",
  ],
};

function hashComboMonth(facility: string, serviceLine: string, month: string): number {
  let h = 0;
  const s = `${facility}|${serviceLine}|${month}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function reviewStatusForMonth(
  month: string,
  closeMonth: string,
  varianceStatus: FinanceRecord["variance_status"]
): FinanceRecord["review_status"] {
  if (month < closeMonth) return "Closed";
  if (varianceStatus === "Unfavorable") return "Director Review";
  if (varianceStatus === "Watchlist") return "Analyst Review";
  return "Executive Ready";
}

function lastUpdatedInMonth(month: string, seed: number): string {
  const { year, month: m } = parseYearMonth(month);
  const day = 22 + (seed % 9);
  return `${year}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function driftValue(base: number, monthIndex: number, seed: number, scale = 0.02): number {
  const wave = Math.sin((monthIndex + seed % 7) * 0.55) * scale;
  return base * (1 + wave + monthIndex * 0.004);
}

/**
 * Builds a rolling synthetic ledger through the prior calendar month (month-end close).
 */
export function buildSyntheticLedger(asOf: Date = new Date()): FinanceRecord[] {
  const closeMonth = resolveCloseMonth(asOf);
  const { year: closeYear } = parseYearMonth(closeMonth);
  const monthList = monthsThroughClose(closeMonth);
  const periodShort = (m: string) => {
    const { year, month } = parseYearMonth(m);
    const label = new Date(`${m}-15`).toLocaleString("default", { month: "long" });
    return `${label} ${year}`;
  };

  const records: FinanceRecord[] = [];
  let idCounter = 1;

  monthList.forEach((month, monthIndex) => {
    const isClose = month === closeMonth;
    LEDGER_COMBO_TEMPLATES.forEach((tpl, tplIndex) => {
      const seed = hashComboMonth(tpl.facility, tpl.service_line, month) + tplIndex;
      const npr = Math.round(driftValue(tpl.net_patient_revenue, monthIndex, seed, 0.025));
      const opex = Math.round(driftValue(tpl.operating_expense, monthIndex, seed + 1, 0.028));
      const labor = Math.round(driftValue(tpl.labor_cost, monthIndex, seed + 2, 0.03));
      const supply = Math.round(driftValue(tpl.supply_cost, monthIndex, seed + 3, 0.02));
      const margin = npr > 0 ? parseFloat((((npr - opex) / npr) * 100).toFixed(2)) : tpl.operating_margin;
      const variance = Math.round(driftValue(tpl.budget_variance, monthIndex, seed + 4, 0.15));
      const volume = Math.round(driftValue(tpl.patient_volume, monthIndex, seed + 5, 0.04));
      const denial = parseFloat(
        Math.max(1.2, driftValue(tpl.denial_rate, monthIndex, seed + 6, 0.08)).toFixed(1)
      );
      const arDays = Math.round(driftValue(tpl.reimbursement_delay_days, monthIndex, seed + 7, 0.05));
      const overtime = parseFloat(
        Math.max(2, driftValue(tpl.overtime_utilization, monthIndex, seed + 8, 0.1)).toFixed(1)
      );
      const forecast = parseFloat(
        Math.max(0, margin + (tpl.forecasted_margin - tpl.operating_margin) * 0.85).toFixed(2)
      );

      let variance_status = tpl.variance_status;
      if (margin < 0) variance_status = "Unfavorable";
      else if (margin < 6.5) variance_status = "Watchlist";
      else if (variance > 100000) variance_status = "Favorable";

      const notePool = VARIANCE_NOTES[variance_status];
      const variance_note = notePool[seed % notePool.length].replace("{period}", periodShort(month));

      records.push({
        id: `rec-${String(idCounter++).padStart(3, "0")}`,
        month,
        facility: tpl.facility,
        region: tpl.region,
        service_line: tpl.service_line,
        net_patient_revenue: npr,
        operating_expense: opex,
        labor_cost: labor,
        supply_cost: supply,
        operating_margin: margin,
        budget_variance: variance,
        patient_volume: volume,
        payer_mix_index: parseFloat(driftValue(tpl.payer_mix_index, monthIndex, seed + 9, 0.03).toFixed(2)),
        denial_rate: denial,
        reimbursement_delay_days: arDays,
        overtime_utilization: overtime,
        forecasted_margin: forecast,
        variance_status,
        payer_type: tpl.payer_type,
        owner: tpl.owner,
        review_status: reviewStatusForMonth(month, closeMonth, variance_status),
        variance_note: isClose ? variance_note : `${variance_note} (archived)`,
        last_updated: lastUpdatedInMonth(month, seed),
      });
    });
  });

  return records;
}

/** Months included in the generated ledger (for reporting cap alignment). */
export function generatedLedgerMonths(asOf: Date = new Date()): string[] {
  return monthsThroughClose(resolveCloseMonth(asOf));
}

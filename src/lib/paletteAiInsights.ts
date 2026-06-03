import type { FinanceRecord } from "../types/financeRecord";
import { calculateKpis } from "./financeCalculations";
import { formatCurrency, formatPercent, formatPoints } from "./formatters";
import { getReportingContext } from "./reportingPeriod";
import { STEWARDSHIP_TARGET_MARGIN } from "./stewardshipConfig";

function closeMonthRecords(records: FinanceRecord[]) {
  const reporting = getReportingContext(records);
  const close = records.filter(reporting.filterCloseMonth);
  return { reporting, scoped: close.length ? close : records };
}

function avgDenialByServiceLine(records: FinanceRecord[], serviceLine: string) {
  const rows = records.filter((r) => r.service_line === serviceLine);
  if (!rows.length) return null;
  return rows.reduce((s, r) => s + r.denial_rate, 0) / rows.length;
}

/** Local Intel-Palette AI replies grounded in the same close-month ledger as the dashboard. */
export function buildPaletteAiAnswer(query: string, records: FinanceRecord[]): string {
  const { reporting, scoped } = closeMonthRecords(records);
  const kpis = calculateKpis(scoped);
  const q = query.toLowerCase();
  const period = reporting.closeMonthLabel;
  const fyP = `${reporting.fiscalYearLabel} ${reporting.periodLabel}`;
  const marginGap = STEWARDSHIP_TARGET_MARGIN - kpis.operatingMargin;
  const cardiologyDenial = avgDenialByServiceLine(scoped, "Cardiology") ?? kpis.denialRate;

  if (q.includes("opex") || q.includes("expense") || q.includes("spending")) {
    return `For ${period} (${fyP}), close-month operating expense is ${formatCurrency(kpis.operatingExpense)} against NPR of ${formatCurrency(kpis.netPatientRevenue)}. Labor totals ${formatCurrency(kpis.laborCost)}; supplies ${formatCurrency(kpis.supplyCost)}. Highest-pressure lines are typically Cardiology registry labor and Orthopedics implant supply — open Service Lines Review to annotate drivers.`;
  }

  if (q.includes("margin") || q.includes("profit") || q.includes("target")) {
    const gapText =
      marginGap > 0
        ? `${formatPoints(marginGap)} below the ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} stewardship goal`
        : `at or above the ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} stewardship goal`;
    return `Close-month operating margin for ${period} is ${formatPercent(kpis.operatingMargin)}, ${gapText}. Forecasted margin in the ledger averages ${formatPercent(kpis.forecastedMargin)}. Prioritize Cardiology denials (${formatPercent(cardiologyDenial)}) and agency/overtime utilization (${formatPercent(kpis.overtimeUtilization)} system average) to close the gap.`;
  }

  if (q.includes("revenue") || q.includes("npr") || q.includes("net patient")) {
    return `Close-month Net Patient Revenue for ${period} (${fyP}) is ${formatCurrency(kpis.netPatientRevenue)} across ${scoped.length} facility/service-line rows. Budget variance in-period is ${formatCurrency(kpis.budgetVariance)}. Use the Financial Dashboard filters to compare regions and facilities before board readout.`;
  }

  if (q.includes("denial") || q.includes("claim")) {
    return `System average claim denial rate for ${period} is ${formatPercent(kpis.denialRate)}. Cardiology is elevated at ${formatPercent(cardiologyDenial)} — often prior-authorization mismatch on commercial cases. Recommended action: coordinate revenue-cycle and clinical auditors on pre-certification for high-acuity volumes.`;
  }

  return `Operational intelligence for "${query}" (${period}, ${fyP}): NPR ${formatCurrency(kpis.netPatientRevenue)}, margin ${formatPercent(kpis.operatingMargin)} vs ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} target, ${scoped.length} close-month records in the synthetic ledger. Open Forecast & Walk for projection context or the full Copilot for a leadership brief.`;
}

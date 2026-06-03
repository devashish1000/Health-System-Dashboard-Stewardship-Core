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
  const surgicalDenial = avgDenialByServiceLine(scoped, "Surgical Supplies") ?? kpis.denialRate;

  if (q.includes("surgical") || q.includes("supply") || q.includes("supplies") || q.includes("gpo") || q.includes("pharmacy") || q.includes("device")) {
    const supplyRows = scoped.filter((r) =>
      ["Surgical Supplies", "Pharmacy Distribution", "Medical Devices"].includes(r.service_line)
    );
    const supplySpend = supplyRows.reduce((s, r) => s + r.supply_cost, 0);
    return `For ${period} (${fyP}), supply chain spend in the close-month ledger totals ${formatCurrency(supplySpend)} across surgical, pharmacy, and device lines. Houston Market rows drive most of the variance — compare GPO benchmarks in Service Lines Review and export filtered data from the Finance Export Suite (⌘K → Export).`;
  }

  if (q.includes("opex") || q.includes("expense") || q.includes("spending") || q.includes("budget") || q.includes("variance")) {
    return `For ${period} (${fyP}), close-month operating expense is ${formatCurrency(kpis.operatingExpense)} against NPR of ${formatCurrency(kpis.netPatientRevenue)}. Supply chain spend is ${formatCurrency(kpis.supplyCost)}; labor ${formatCurrency(kpis.laborCost)}. For the Sr Financial Analyst review path, start with Surgical Supplies and Pharmacy Distribution in Houston Market — annotate GPO/initiative drivers in Service Lines Review.`;
  }

  if (q.includes("margin") || q.includes("profit") || q.includes("target") || q.includes("initiative")) {
    const gapText =
      marginGap > 0
        ? `${formatPoints(marginGap)} below the ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} stewardship goal`
        : `at or above the ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} stewardship goal`;
    return `Close-month operating margin for ${period} is ${formatPercent(kpis.operatingMargin)}, ${gapText}. Forecasted margin averages ${formatPercent(kpis.forecastedMargin)}. Supply-side levers: compare ${formatCurrency(kpis.supplyCost)} to budget in Houston, then validate initiative ROI notes before market finance readout.`;
  }

  if (q.includes("revenue") || q.includes("npr") || q.includes("net patient")) {
    return `Close-month Net Patient Revenue for ${period} (${fyP}) is ${formatCurrency(kpis.netPatientRevenue)} across ${scoped.length} facility/service-line rows. Budget variance in-period is ${formatCurrency(kpis.budgetVariance)}. Use the Financial Dashboard filters to compare regions and facilities before board readout.`;
  }

  if (q.includes("denial") || q.includes("claim")) {
    return `System average claim denial rate for ${period} is ${formatPercent(kpis.denialRate)}. For supply chain finance review, denial noise is secondary — focus on ${formatPercent(surgicalDenial)} Surgical Supplies line denials tied to implant/consumable coding. Export filtered Houston rows from Finance Export Suite for your packet.`;
  }

  return `Operational intelligence for "${query}" (${period}, ${fyP}): NPR ${formatCurrency(kpis.netPatientRevenue)}, margin ${formatPercent(kpis.operatingMargin)} vs ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} target, ${scoped.length} close-month records in the synthetic ledger. Open Forecast & Walk for projection context or the full Copilot for a leadership brief.`;
}

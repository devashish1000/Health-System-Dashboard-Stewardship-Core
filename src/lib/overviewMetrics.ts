import type { FinanceRecord } from "../types/financeRecord";
import { calculateKpis } from "./financeCalculations";
import type { ReportingContext } from "./reportingPeriod";
import { STEWARDSHIP_TARGET_MARGIN } from "./stewardshipConfig";

export function computeOverviewHeroMetrics(records: FinanceRecord[], reporting: ReportingContext) {
  const closeRecords = records.filter(reporting.filterCloseMonth);
  const kpis = calculateKpis(closeRecords.length ? closeRecords : records);

  const unfavorableLabor = closeRecords.filter(
    (r) => r.overtime_utilization > 10 || r.denial_rate > 5
  );
  const denialLeakage = unfavorableLabor.reduce(
    (sum, r) => sum + Math.max(0, -r.budget_variance),
    0
  );
  const agencyOverspend = closeRecords
    .filter((r) => r.overtime_utilization > 8)
    .reduce((sum, r) => sum + r.labor_cost * 0.08, 0);

  return {
    targetMargin: STEWARDSHIP_TARGET_MARGIN,
    totalRevenue: kpis.netPatientRevenue,
    avgMargin: kpis.operatingMargin,
    denialLeakage: denialLeakage || Math.abs(kpis.budgetVariance) * 0.35,
    agencyOverspend: agencyOverspend || kpis.laborCost * 0.06,
    periodLabel: reporting.closeMonthLabel,
    fiscalLabel: `${reporting.fiscalYearLabel} ${reporting.periodLabel}`,
  };
}

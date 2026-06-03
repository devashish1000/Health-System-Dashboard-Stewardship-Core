import type { FinanceRecord } from "../types/financeRecord";
import {
  calendarYearMonths,
  formatDisplayDate,
  formatYearMonth,
  monthsThroughClose,
  parseYearMonth,
  quarterLabelForCloseMonth,
  forwardQuarterLabel,
  resolveCloseMonth as resolveCalendarCloseMonth,
  trendChartMonths as buildTrendChartMonths,
} from "./fiscalCalendar";
import { DEMO_AS_OF } from "../config/demoOrg";

/** Calendar-year fiscal model: P01 = January … P12 = December */
const FISCAL_YEAR_START_MONTH = 1;

export interface ReportingContext {
  closeMonth: string;
  closeYear: number;
  closeMonthNum: number;
  fiscalYearLabel: string;
  periodNumber: number;
  periodLabel: string;
  periodLongLabel: string;
  closeMonthLabel: string;
  closeMonthShort: string;
  calendarYear: number;
  asOfDate: Date;
  asOfDisplay: string;
  generatedAtDisplay: string;
  chartYearMonths: string[];
  /** KPI / service-line trend modals — actuals + in-flight month(s), not full-year projection. */
  trendChartMonths: string[];
  actualMonthsThroughClose: string[];
  workspaceTooltip: string;
  workspaceChipShort: string;
  projectionStreamLabel: string;
  currentQuarterLabel: string;
  forwardQuarterLabel: string;
  isProjectionMonth: (month: string) => boolean;
  isActualMonth: (month: string) => boolean;
  monthLabel: (month: string) => string;
  monthLabelWithYear: (month: string) => string;
  filterYtdThroughClose: (record: FinanceRecord) => boolean;
  filterCloseMonth: (record: FinanceRecord) => boolean;
  countActualMonthsThroughClose: (records: FinanceRecord[]) => number;
}

export function uniqueRecordMonths(records: FinanceRecord[]): string[] {
  return [...new Set(records.map((r) => r.month))].sort();
}

/**
 * Close month for UI: prior calendar month, capped to months present in records.
 */
export function resolveCloseMonth(
  availableMonths?: string[],
  asOf: Date = new Date()
): string {
  let candidate = resolveCalendarCloseMonth(asOf);

  if (!availableMonths?.length) return candidate;

  const sorted = [...availableMonths].sort();
  const latest = sorted[sorted.length - 1];
  const earliest = sorted[0];

  if (candidate > latest) candidate = latest;
  if (candidate < earliest) candidate = latest;

  return candidate;
}

export { formatYearMonth, parseYearMonth, monthsThroughClose } from "./fiscalCalendar";

export function getReportingContext(
  records: FinanceRecord[],
  asOf: Date = DEMO_AS_OF
): ReportingContext {
  const available = uniqueRecordMonths(records);
  const closeMonth = resolveCloseMonth(available, asOf);
  const { year: closeYear, month: closeMonthNum } = parseYearMonth(closeMonth);

  const fiscalYearLabel = `FY${String(closeYear).slice(-2)}`;
  const periodNumber =
    FISCAL_YEAR_START_MONTH === 1
      ? closeMonthNum
      : ((closeMonthNum - FISCAL_YEAR_START_MONTH + 12) % 12) + 1;
  const periodLabel = `P${String(periodNumber).padStart(2, "0")}`;
  const periodLongLabel = `Period ${String(periodNumber).padStart(2, "0")}`;

  const closeMonthShort = new Date(`${closeMonth}-15`).toLocaleString("default", {
    month: "long",
  });
  const closeMonthLabel = `${closeMonthShort} ${closeYear}`;

  const chartYearMonths = calendarYearMonths(closeYear);
  const trendChartMonths = buildTrendChartMonths(closeMonth, asOf);
  const actualMonthsThroughClose = monthsThroughClose(closeMonth);

  const workspaceTooltip = `CommonSpirit Baseline synthetic ledger · ${fiscalYearLabel} ${periodLongLabel} month-end review`;
  const workspaceChipShort = `${fiscalYearLabel} ${periodLabel} · Baseline`;
  const projectionStreamLabel = `${fiscalYearLabel} PROJECTION STREAM ACTIVE`;

  const monthLabel = (month: string) =>
    new Date(`${month}-15`).toLocaleString("default", { month: "short" });

  const monthLabelWithYear = (month: string) => {
    const { year } = parseYearMonth(month);
    return `${monthLabel(month)} ${year}`;
  };

  return {
    closeMonth,
    closeYear,
    closeMonthNum,
    fiscalYearLabel,
    periodNumber,
    periodLabel,
    periodLongLabel,
    closeMonthLabel,
    closeMonthShort,
    calendarYear: closeYear,
    asOfDate: asOf,
    asOfDisplay: formatDisplayDate(asOf),
    generatedAtDisplay: formatDisplayDate(asOf),
    chartYearMonths,
    trendChartMonths,
    actualMonthsThroughClose,
    workspaceTooltip,
    workspaceChipShort,
    projectionStreamLabel,
    currentQuarterLabel: quarterLabelForCloseMonth(closeMonth),
    forwardQuarterLabel: forwardQuarterLabel(closeMonth),
    isProjectionMonth: (m) =>
      trendChartMonths.includes(m) && m > closeMonth,
    isActualMonth: (m) => m <= closeMonth,
    monthLabel,
    monthLabelWithYear,
    filterYtdThroughClose: (r) => r.month <= closeMonth,
    filterCloseMonth: (r) => r.month === closeMonth,
    countActualMonthsThroughClose: (recs) =>
      actualMonthsThroughClose.filter((m) => recs.some((r) => r.month === m)).length ||
      actualMonthsThroughClose.length,
  };
}

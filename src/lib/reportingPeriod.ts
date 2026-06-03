import { SYNTHETIC_RECORDS, type FinanceRecord } from "../data/syntheticFinanceData";

/** Calendar-year fiscal model: P01 = January … P12 = December */
const FISCAL_YEAR_START_MONTH = 1;

export interface ReportingContext {
  /** Last closed ledger month (YYYY-MM) */
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
  /** Jan–Dec of the close calendar year (trend modals) */
  chartYearMonths: string[];
  /** Jan through close month in that year (dashboard history) */
  actualMonthsThroughClose: string[];
  workspaceTooltip: string;
  workspaceChipShort: string;
  projectionStreamLabel: string;
  isProjectionMonth: (month: string) => boolean;
  isActualMonth: (month: string) => boolean;
  monthLabel: (month: string) => string;
  monthLabelWithYear: (month: string) => string;
  filterYtdThroughClose: (record: FinanceRecord) => boolean;
  countActualMonthsThroughClose: (records: FinanceRecord[]) => number;
}

function padMonth(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}-${padMonth(month)}`;
}

export function parseYearMonth(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-").map(Number);
  return { year: y, month: m };
}

export function uniqueRecordMonths(records: FinanceRecord[]): string[] {
  return [...new Set(records.map((r) => r.month))].sort();
}

/**
 * Typical month-end close = prior calendar month, capped to synthetic ledger range.
 */
export function resolveCloseMonth(
  availableMonths?: string[],
  asOf: Date = new Date()
): string {
  const prior = new Date(asOf.getFullYear(), asOf.getMonth() - 1, 1);
  let candidate = formatYearMonth(prior.getFullYear(), prior.getMonth() + 1);

  if (!availableMonths?.length) return candidate;

  const sorted = [...availableMonths].sort();
  const latest = sorted[sorted.length - 1];
  const earliest = sorted[0];

  if (candidate > latest) candidate = latest;
  if (candidate < earliest) candidate = latest;

  return candidate;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function calendarYearMonths(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => formatYearMonth(year, i + 1));
}

function monthsThroughClose(closeMonth: string): string[] {
  const { year, month } = parseYearMonth(closeMonth);
  return Array.from({ length: month }, (_, i) => formatYearMonth(year, i + 1));
}

export function getReportingContext(
  records: FinanceRecord[] = SYNTHETIC_RECORDS,
  asOf: Date = new Date()
): ReportingContext {
  const available = uniqueRecordMonths(records);
  const closeMonth = resolveCloseMonth(available, asOf);
  const { year: closeYear, month: closeMonthNum } = parseYearMonth(closeMonth);

  const fiscalYearLabel = `FY${String(closeYear).slice(-2)}`;
  const periodNumber =
    FISCAL_YEAR_START_MONTH === 1
      ? closeMonthNum
      : ((closeMonthNum - FISCAL_YEAR_START_MONTH + 12) % 12) + 1;
  const periodLabel = `P${padMonth(periodNumber)}`;
  const periodLongLabel = `Period ${padMonth(periodNumber)}`;

  const closeMonthShort = new Date(`${closeMonth}-15`).toLocaleString("default", {
    month: "long",
  });
  const closeMonthLabel = `${closeMonthShort} ${closeYear}`;

  const chartYearMonths = calendarYearMonths(closeYear);
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
    actualMonthsThroughClose,
    workspaceTooltip,
    workspaceChipShort,
    projectionStreamLabel,
    isProjectionMonth: (m) => m > closeMonth,
    isActualMonth: (m) => m <= closeMonth,
    monthLabel,
    monthLabelWithYear,
    filterYtdThroughClose: (r) => r.month <= closeMonth,
    countActualMonthsThroughClose: (recs) =>
      actualMonthsThroughClose.filter((m) => recs.some((r) => r.month === m)).length ||
      actualMonthsThroughClose.length,
  };
}

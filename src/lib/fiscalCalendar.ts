export function padMonth(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatYearMonth(year: number, month: number): string {
  return `${year}-${padMonth(month)}`;
}

export function parseYearMonth(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-").map(Number);
  return { year: y, month: m };
}

/** Prior calendar month = typical finance close month. */
export function resolveCloseMonth(asOf: Date = new Date()): string {
  const prior = new Date(asOf.getFullYear(), asOf.getMonth() - 1, 1);
  return formatYearMonth(prior.getFullYear(), prior.getMonth() + 1);
}

export function monthsThroughClose(closeMonth: string): string[] {
  const { year, month } = parseYearMonth(closeMonth);
  return Array.from({ length: month }, (_, i) => formatYearMonth(year, i + 1));
}

export function calendarYearMonths(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => formatYearMonth(year, i + 1));
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function quarterForMonth(monthNum: number): number {
  return Math.ceil(monthNum / 3);
}

export function quarterLabelForCloseMonth(closeMonth: string): string {
  return `Q${quarterForMonth(parseYearMonth(closeMonth).month)}`;
}

export function forwardQuarterLabel(closeMonth: string): string {
  const q = quarterForMonth(parseYearMonth(closeMonth).month);
  return q >= 4 ? "Q1" : `Q${q + 1}`;
}

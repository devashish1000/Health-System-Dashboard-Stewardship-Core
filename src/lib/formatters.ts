/**
 * Centralized numeric presentation for KPIs, tables, and chart axes.
 * Policy: one formatter per semantic type; never mix $ and % on the same axis.
 */

export type CurrencyScale = "auto" | "full" | "millions" | "thousands";

export function formatCurrency(
  value: number,
  scale: CurrencyScale = "auto"
): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (scale === "millions" || (scale === "auto" && abs >= 1e6)) {
    return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  }
  if (scale === "thousands" || (scale === "auto" && abs >= 1e3)) {
    return `${sign}$${(abs / 1e3).toFixed(0)}K`;
  }
  if (scale === "full") {
    return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  return `${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/** Variance in dollars (always signed, compact). */
export function formatVarianceCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const prefix = value > 0 ? "+" : value < 0 ? "" : "";
  return `${prefix}${formatCurrency(value)}`;
}

/** Percent with optional sign for deltas. */
export function formatPercent(
  value: number,
  options?: { signed?: boolean; decimals?: number }
): string {
  if (!Number.isFinite(value)) return "—";
  const decimals = options?.decimals ?? 1;
  const rounded = value.toFixed(decimals);
  if (options?.signed && value > 0) return `+${rounded}%`;
  if (options?.signed && value < 0) return `${rounded}%`;
  return `${rounded}%`;
}

/** Margin / ratio change in percentage points (not percent of percent). */
export function formatPoints(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return "—";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(decimals)} pts`;
}

/** Chart axis: millions with $ prefix. */
export function formatAxisMillions(value: number): string {
  if (!Number.isFinite(value)) return "";
  return `$${value}M`;
}

/** Chart axis: percent. */
export function formatAxisPercent(value: number): string {
  if (!Number.isFinite(value)) return "";
  return `${value}%`;
}

/** Chart axis: thousands with $K. */
export function formatAxisThousands(value: number): string {
  if (!Number.isFinite(value)) return "";
  return `$${value}K`;
}

/** Integer counts (volume, days). */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US");
}

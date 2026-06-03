/**
 * IBCS-inspired series colors (semantic roles, not brand marketing colors).
 * Brand accent remains in UI chrome; charts use these for ACT / PLN / FC distinction.
 */

export const chartTheme = {
  actual: "#982f6a",
  plan: "#94a3b8",
  forecast: "#0d9488",
  positive: "#059669",
  negative: "#dc2626",
  neutral: "#64748b",
  grid: "#e2e8f0",
  gridDark: "#475569",
  axis: "#64748b",
  axisDark: "#cbd5e1",
  tooltipBg: "#ffffff",
  tooltipBgDark: "#1e293b",
  tooltipBorder: "#e2e8f0",
  tooltipBorderDark: "#475569",
} as const;

export const chartMargins = {
  default: { top: 12, right: 12, left: 0, bottom: 0 },
  compact: { top: 8, right: 8, left: -20, bottom: 0 },
} as const;

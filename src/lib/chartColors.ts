import { chartTheme } from "./chartTheme";

export type ChartPalette = {
  grid: string;
  axis: string;
  tick: string;
  legendColor: string;
};

/** Resolved chart chrome colors for light vs dark surfaces (ink-800 cards). */
export function resolveChartPalette(isDark: boolean): ChartPalette {
  if (isDark) {
    return {
      grid: chartTheme.gridDark,
      axis: "#94a3b8",
      tick: "#e2e8f0",
      legendColor: "#cbd5e1",
    };
  }
  return {
    grid: chartTheme.grid,
    axis: chartTheme.axis,
    tick: "#64748b",
    legendColor: "#475569",
  };
}

export const axisTickProps = (palette: ChartPalette, fontSize = 11) => ({
  stroke: palette.axis,
  tick: { fill: palette.tick, fontSize },
});

export const legendStyle = (palette: ChartPalette) => ({
  fontSize: 11,
  color: palette.legendColor,
});

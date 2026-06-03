import React from "react";
import {
  formatCurrency,
  formatPercent,
  formatAxisMillions,
  formatAxisPercent,
  formatAxisThousands,
} from "../../lib/formatters";

export type TooltipValueKind = "currency" | "percent" | "millions" | "thousands" | "count" | "raw";

type TooltipEntry = {
  name?: string;
  value?: number;
  color?: string;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  valueKind?: TooltipValueKind;
  labelFormatter?: (label: string) => string;
};

function formatValue(value: number, kind: TooltipValueKind): string {
  switch (kind) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return formatPercent(value, { decimals: 1 });
    case "millions":
      return formatAxisMillions(value);
    case "thousands":
      return formatAxisThousands(value);
    case "count":
      return value.toLocaleString("en-US");
    default:
      return String(value);
  }
}

export default function ChartTooltip({
  active,
  payload,
  label,
  valueKind = "raw",
  labelFormatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter && label != null ? labelFormatter(String(label)) : label;

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md dark:border-slate-600 dark:bg-slate-800"
      role="tooltip"
    >
      {displayLabel != null && (
        <p className="mb-1 font-medium text-slate-700 dark:text-slate-200">{displayLabel}</p>
      )}
      <ul className="space-y-0.5">
        {payload.map((entry, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {entry.value != null ? formatValue(Number(entry.value), valueKind) : "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

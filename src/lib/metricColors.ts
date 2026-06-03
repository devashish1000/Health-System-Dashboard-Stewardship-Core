/** Margin % coloring with readable contrast on light and dark cards. */
export function marginPercentClass(margin: number): string {
  if (margin >= 8) return "text-emerald-600 dark:text-emerald-400";
  if (margin < 1) return "text-rose-600 dark:text-rose-400";
  return "text-slate-700 dark:text-slate-200";
}

export function varianceClass(value: number): string {
  return value >= 0
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
}

export function dataPrimaryClass(): string {
  return "text-slate-800 dark:text-slate-100";
}

export function dataSecondaryClass(): string {
  return "text-slate-600 dark:text-slate-300";
}

export function captionClass(): string {
  return "text-slate-500 dark:text-slate-400";
}

export function chartSectionTitleClass(): string {
  return "text-slate-500 dark:text-slate-300 uppercase tracking-wider font-bold text-xs";
}

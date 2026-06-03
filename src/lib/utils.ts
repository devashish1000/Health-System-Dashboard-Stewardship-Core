/**
 * Combines CSS classes safely
 */
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      // should handle array recursively but simple string is fine
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}

/** @deprecated Import from ./formatters — re-exported for backward compatibility */
export {
  formatCurrency,
  formatPercent,
  formatVarianceCurrency,
  formatPoints,
  formatAxisMillions,
  formatAxisPercent,
  formatCount,
} from "./formatters";

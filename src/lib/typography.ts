/**
 * Consistent text colors for light + dark surfaces (ink-800 cards, slate-50 canvas).
 * Use these instead of raw text-slate-* so dark mode stays readable.
 */

/** Primary body copy on cards */
export const bodyText = "text-slate-700 dark:text-slate-200";

/** Secondary / descriptive copy */
export const bodyMuted = "text-slate-600 dark:text-slate-300";

/** Small captions, helper lines */
export const captionText = "text-slate-500 dark:text-slate-400";

/** Extra-small meta (mono-friendly) */
export const metaText = "text-slate-500 dark:text-slate-400";

/** Section labels (uppercase chart titles, etc.) */
export const sectionLabel = "text-slate-500 dark:text-slate-300 uppercase tracking-wider font-bold text-xs";

/** Page / card titles */
export const titleText = "text-slate-900 dark:text-slate-100";

/** Subtitles on cards */
export const subtitleText = "text-slate-800 dark:text-slate-100";

/** Form inputs on dark cards */
export const inputText =
  "text-slate-800 dark:text-slate-100 bg-white dark:bg-ink-900 border-slate-200 dark:border-white/10";

export const inputPlaceholder = "placeholder:text-slate-400 dark:placeholder:text-slate-500";

/** Warning / prohibited headings */
export const dangerTitle = "text-rose-800 dark:text-rose-300";

export const dangerMeta = "text-rose-600 dark:text-rose-400";

/** Brand accent inline */
export const brandText = "text-brand-700 dark:text-brand-300";

/** Sidebar / chrome (on ink-900) — already light */
export const sidebarMuted = "text-slate-400";

/** Progress / emphasis on dark panels */
export const emphasisBrand = "text-brand-600 dark:text-brand-400";

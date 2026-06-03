import React from "react";
import { FilterX } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
  periodLabel?: string;
}

export default function EmptyState({ onReset, periodLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-12 bg-white dark:bg-ink-800 text-center max-w-xl mx-auto my-8">
      <div className="p-4 bg-slate-50 dark:bg-ink-900 text-slate-400 dark:text-slate-400 rounded-full mb-4">
        <FilterX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        No Financial Records Match Your Criteria
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        We found 0 records with your selected filters
        {periodLabel ? ` for ${periodLabel}` : ""}. Try broadening month or facility criteria, or reset to the default close-month portfolio.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        Clear All Filters
      </button>
    </div>
  );
}

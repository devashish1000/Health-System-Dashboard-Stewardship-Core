import React from "react";
import { FilterX } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-12 bg-white text-center max-w-xl mx-auto my-8">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
        <FilterX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        No Financial Records Match Your Criteria
      </h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        We found 0 records with your selected filters. Try broadening your criteria or reset the filters to investigate the full synthetic health system.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-sm"
      >
        Clear All Filters
      </button>
    </div>
  );
}

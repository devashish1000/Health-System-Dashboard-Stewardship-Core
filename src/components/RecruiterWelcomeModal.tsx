import React from "react";
import { X, BookOpen, ArrowRight } from "lucide-react";
import {
  RECRUITER_CLICK_PATH,
  DISCLAIMER_SHORT,
  JOB_REQ_ID,
  DATA_HANDOFF_WORKBOOK_PATH,
  DATA_HANDOFF_WORKBOOK_FILENAME,
} from "../constants/recruiterHandoff";

interface RecruiterWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecruiterWelcomeModal({ isOpen, onClose }: RecruiterWelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl max-w-md w-full p-6 space-y-4"
        role="dialog"
        aria-labelledby="recruiter-welcome-title"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Applicant work sample · Req {JOB_REQ_ID}
            </p>
            <h2 id="recruiter-welcome-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              Sr Financial Analyst work sample (demo)
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-ink-700 text-slate-400 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          CommonSpirit-inspired finance control tower for interview review — variance, budget, forecast, and
          export workflows on synthetic multi-market data. {DISCLAIMER_SHORT}. Not affiliated with or endorsed
          by CommonSpirit Health.
        </p>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Suggested path (~5 min)
          </span>
          <ol className="list-decimal list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
            {RECRUITER_CLICK_PATH.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <a
          href={DATA_HANDOFF_WORKBOOK_PATH}
          download={DATA_HANDOFF_WORKBOOK_FILENAME}
          className="flex items-center gap-3 p-3 rounded-xl border border-brand-200 bg-brand-50/50 dark:bg-brand-900/20 hover:border-brand-300 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-brand-600 shrink-0" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Download Excel data dictionary (64 close-month rows)
          </span>
        </a>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          Start review
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { ProjectPage } from "../types";
import { TOUR_VARIANT_KEY } from "../constants/recruiterHandoff";

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: ProjectPage) => void;
  /** When true (e.g. `?reviewer=1`), skip chooser and use recruiter steps */
  forceRecruiterPath?: boolean;
}

interface TourStep {
  page: ProjectPage;
  title: string;
  blurb: string;
}

export const FULL_TOUR_STEPS: TourStep[] = [
  {
    page: "overview",
    title: "Executive Tower",
    blurb:
      "The 30-second story: the problem, the ROI, and how it fits your org.",
  },
  {
    page: "dashboard",
    title: "Financial Dashboard",
    blurb:
      "Filterable KPIs, budget-vs-actual, and margin trends across all facilities.",
  },
  {
    page: "serviceLines",
    title: "Service Lines",
    blurb:
      "Per-department margin, variance, and reviewer notes — spot the watchlist instantly.",
  },
  {
    page: "forecast",
    title: "Forecast & Walk",
    blurb:
      "Rolling margin projection and a driver waterfall showing what moved the number.",
  },
  {
    page: "copilot",
    title: "AI Finance Copilot",
    blurb:
      "Ask plain-English questions; get a board-ready brief grounded in the data.",
  },
  {
    page: "simulator",
    title: "Scenario Simulator",
    blurb:
      "Pull levers (labor, denials, volume) and watch projected margin react live.",
  },
  {
    page: "responsibleAi",
    title: "Responsible AI",
    blurb:
      "Guardrails, intended-use limits, and a synthetic-data statement for trust.",
  },
];

export const RECRUITER_STEPS: TourStep[] = [
  {
    page: "overview",
    title: "Recruiter overview",
    blurb:
      "Synthetic ledger and KPIs for portfolio review only — not endorsed by CommonSpirit Health and not operational data.",
  },
  {
    page: "dashboard",
    title: "Financial Dashboard",
    blurb:
      "Filterable KPIs, budget-vs-actual, and margin trends across Houston and comparison markets.",
  },
  {
    page: "serviceLines",
    title: "Service Lines",
    blurb:
      "Per-department margin, variance flags, and stewardship notes — the Sr Financial Analyst drill-down view.",
  },
  {
    page: "forecast",
    title: "Forecast & drivers",
    blurb:
      "Rolling margin projection and a driver waterfall for month-end storytelling to market finance leaders.",
  },
  {
    page: "dashboard",
    title: "Export & handoff",
    blurb:
      "Use Export in the top header to download CSV extracts or the Excel data dictionary for your review packet.",
  },
];

type TourVariant = "recruiter" | "full";

function readStoredVariant(): TourVariant | null {
  const v = localStorage.getItem(TOUR_VARIANT_KEY);
  return v === "recruiter" || v === "full" ? v : null;
}

export default function GuidedTour(props: GuidedTourProps) {
  const { isOpen, onClose, onNavigate, forceRecruiterPath = false } = props;
  const [stepIndex, setStepIndex] = useState(0);
  const [variant, setVariant] = useState<TourVariant | null>(() =>
    forceRecruiterPath ? "recruiter" : readStoredVariant()
  );
  const [showChooser, setShowChooser] = useState(false);

  const steps = useMemo(
    () => (variant === "full" ? FULL_TOUR_STEPS : RECRUITER_STEPS),
    [variant]
  );

  useEffect(() => {
    if (!isOpen) return;
    if (forceRecruiterPath) {
      localStorage.setItem(TOUR_VARIANT_KEY, "recruiter");
      setVariant("recruiter");
      setShowChooser(false);
      setStepIndex(0);
      return;
    }
    const stored = readStoredVariant();
    if (stored) {
      setVariant(stored);
      setShowChooser(false);
    } else {
      setShowChooser(true);
      setVariant(null);
    }
    setStepIndex(0);
  }, [isOpen, forceRecruiterPath]);

  const total = steps.length;
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  useEffect(() => {
    if (isOpen && variant && step) {
      onNavigate(step.page);
    }
  }, [isOpen, stepIndex, step?.page, onNavigate, variant]);

  if (!isOpen) return null;

  const pickVariant = (next: TourVariant) => {
    localStorage.setItem(TOUR_VARIANT_KEY, next);
    setVariant(next);
    setShowChooser(false);
    setStepIndex(0);
  };

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setStepIndex((i) => Math.min(i + 1, total - 1));
    }
  };

  const handleBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  if (showChooser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 p-6 shadow-sm">
          <button
            type="button"
            onClick={onClose}
            aria-label="Skip tour"
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-600">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                Choose your path
              </div>
              <div className="text-xs text-slate-400">Synthetic demo · not a live system</div>
            </div>
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">How much time do you have?</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recruiters and hiring managers usually take the 5-minute path. Add{" "}
            <code className="text-[10px] bg-slate-100 dark:bg-ink-700 px-1 rounded">?reviewer=1</code> to the URL
            to skip this screen next time.
          </p>
          <div className="mt-5 grid gap-2">
            <button
              type="button"
              onClick={() => pickVariant("recruiter")}
              className="w-full text-left p-4 rounded-xl border-2 border-brand-300 bg-brand-50/80 dark:bg-brand-900/20 hover:border-brand-500 cursor-pointer"
            >
              <span className="text-sm font-bold text-brand-800 dark:text-brand-200 block">
                Recruiter path (~5 min)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 mt-1 block">
                Overview → Dashboard → Service Lines → Forecast → Export. No simulator.
              </span>
            </button>
            <button
              type="button"
              onClick={() => pickVariant("full")}
              className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-ink-700 cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Full product tour</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                All seven areas including Copilot, Simulator, and Responsible AI.
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            Skip tour
          </button>
        </div>
      </div>
    );
  }

  if (!variant || !step) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 p-6 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          aria-label="Skip tour"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-100 dark:border-white/10 bg-brand-50 text-brand-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
              {variant === "recruiter" ? "Recruiter tour" : "Full tour"}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-400">
              Step {stepIndex + 1} of {total}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{step.title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.blurb}</p>

        <div className="mt-5 flex items-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={`${s.page}-${i}`}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex
                  ? "w-6 bg-brand-600"
                  : i < stepIndex
                    ? "w-1.5 bg-brand-300"
                    : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-400 transition hover:text-slate-600"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              disabled={isFirst}
              className="flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-100 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
            >
              {isLast ? "Finish" : "Next"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

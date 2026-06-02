import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { ProjectPage } from "../types";

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: ProjectPage) => void;
}

interface TourStep {
  page: ProjectPage;
  title: string;
  blurb: string;
}

const STEPS: TourStep[] = [
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
  {
    page: "visualRegression",
    title: "Pixel Auditor QA",
    blurb:
      "Engineering quality bar: visual regression, chaos, and accessibility checks.",
  },
];

export default function GuidedTour(props: GuidedTourProps) {
  const { isOpen, onClose, onNavigate } = props;
  const [stepIndex, setStepIndex] = useState(0);

  const total = STEPS.length;
  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  useEffect(() => {
    if (isOpen) {
      onNavigate(step.page);
    }
  }, [isOpen, stepIndex, step.page, onNavigate]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          aria-label="Skip tour"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              Guided Tour
            </div>
            <div className="text-xs text-slate-400">
              Step {stepIndex + 1} of {total}
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-800">{step.title}</h2>
        <p className="mt-1 text-sm text-slate-500">{step.blurb}</p>

        <div className="mt-5 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.page}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex
                  ? "w-6 bg-blue-600"
                  : i < stepIndex
                  ? "w-1.5 bg-blue-300"
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
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
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

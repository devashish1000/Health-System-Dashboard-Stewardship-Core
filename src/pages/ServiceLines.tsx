import React, { useState } from "react";
import {
  Heart, ShieldCheck, Hammer, Activity, PlusCircle, HelpCircle, FileSpreadsheet, Layers,
  AlertOctagon, CheckSquare, ListPlus, Send, Flag, CheckCircle, Award, User, AlertCircle
} from "lucide-react";
import { FinanceRecord } from "../data/syntheticFinanceData";
import { getServiceLineAggregates } from "../lib/financeCalculations";
import { sortServiceLinesForRecruiter } from "../constants/recruiterHandoff";
import {
  formatCurrency,
  formatPercent,
  formatVarianceCurrency,
} from "../lib/formatters";
import {
  captionClass,
  dataPrimaryClass,
  dataSecondaryClass,
  marginPercentClass,
  varianceClass,
} from "../lib/metricColors";
import PagePurpose from "../components/PagePurpose";
import PageHeader from "../components/PageHeader";

interface ServiceLinesProps {
  records: FinanceRecord[];
  onTriggerToast: (text: string, type: "success" | "info" | "warning") => void;
  onUpdateRecord: (updated: FinanceRecord) => void;
}

interface ServiceCardDetail {
  name: string;
  icon: any;
  driver: string;
  volumeChangePct: number;
}

const SERVICE_META: Record<string, ServiceCardDetail> = {
  Neurology: {
    name: "Neurology",
    icon: Activity,
    driver: "Slight labor expense pressure due to specialized nurse staffing requirement. Active recruitment open.",
    volumeChangePct: -4.5
  },
  Cardiology: {
    name: "Cardiology",
    icon: Heart,
    driver: "Favorable volume recovery. High complexity implant codes locked in under contract pricing.",
    volumeChangePct: +8.2
  },
  Orthopedics: {
    name: "Orthopedics",
    icon: Hammer,
    driver: "Strong private insurer mix and robust outpatient spine/joint volume. Favorable variance sustained.",
    volumeChangePct: +12.4
  },
  Emergency: {
    name: "Emergency",
    icon: AlertOctagon,
    driver: "Heavy trauma surge in charity care. Intense contract labor reliance to handle boarding patients.",
    volumeChangePct: +15.8
  },
  "Primary Care": {
    name: "Primary Care",
    icon: ShieldCheck,
    driver: "Telehealth optimization and preventative care clinics driving steady outpatient volumes.",
    volumeChangePct: +3.0
  },
  Imaging: {
    name: "Imaging",
    icon: FileSpreadsheet,
    driver: "Diagnostics volume surge from high specialist MRI/CT scan referral coordination.",
    volumeChangePct: +18.4
  },
  "Revenue Cycle": {
    name: "Revenue Cycle",
    icon: ListPlus,
    driver: "Denial clearinghouse technical upgrades delayed cash reconciliation. Active appeals ongoing.",
    volumeChangePct: 0.0
  },
  "Surgical Supplies": {
    name: "Surgical Supplies",
    icon: Hammer,
    driver: "Implant and OR supply spend tracking against GPO benchmarks; variance review with Supply Chain Finance.",
    volumeChangePct: +6.2
  },
  "Pharmacy Distribution": {
    name: "Pharmacy Distribution",
    icon: ShieldCheck,
    driver: "340B and formulary mix shifts affecting expense predictability; budget reforecast in progress.",
    volumeChangePct: +4.1
  },
  "Medical Devices": {
    name: "Medical Devices",
    icon: Activity,
    driver: "Capital device utilization and maintenance contracts reviewed for Houston market standardization.",
    volumeChangePct: +2.8
  }
};

export default function ServiceLines({
  records,
  onTriggerToast,
  onUpdateRecord
}: ServiceLinesProps) {
  const aggs = React.useMemo(() => {
    const raw = getServiceLineAggregates(records);
    return sortServiceLinesForRecruiter(raw.map((a) => a.serviceLine)).map(
      (name) => raw.find((a) => a.serviceLine === name)!
    );
  }, [records]);

  // Workflow actions state to simulate local change tracking
  const [markedReviewed, setMarkedReviewed] = useState<Record<string, boolean>>({});
  const [flaggedServices, setFlaggedServices] = useState<Record<string, boolean>>({});
  const [addingNoteFor, setAddingNoteFor] = useState<string | null>(null);
  const [inputNote, setInputNote] = useState("");

  const handleMarkReviewComplete = () => {
    onTriggerToast("Month-end financial stewardship review packet compiled and marked complete.", "success");
  };

  const handleSaveExecutiveSummary = () => {
    onTriggerToast("Executive financial summary cached and synced to system cloud database.", "success");
  };

  const handleGenerateReviewPacket = () => {
    onTriggerToast("Compilation successful. PDF review workbook delivered to leadership board portal.", "info");
  };

  const toggleFlag = (serviceLine: string) => {
    const isFlagged = !flaggedServices[serviceLine];
    setFlaggedServices(prev => ({ ...prev, [serviceLine]: isFlagged }));
    onTriggerToast(
      isFlagged 
        ? `${serviceLine} flagged for senior director analytical variance inspection.` 
        : `${serviceLine} flag removed.`,
      isFlagged ? "warning" : "info"
    );
  };

  const saveQuickNote = (serviceLine: string) => {
    // Find first matching record to inject the note locally
    const matchingRec = records.find(r => r.service_line === serviceLine);
    if (matchingRec) {
      const updated: FinanceRecord = {
        ...matchingRec,
        variance_note: inputNote,
        last_updated: new Date().toISOString().split("T")[0]
      };
      onUpdateRecord(updated);
      onTriggerToast(`variance note logged successfully for ${serviceLine}.`, "success");
    }
    setAddingNoteFor(null);
    setInputNote("");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Favorable":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/50";
      case "Watchlist":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-800/50";
      case "Unfavorable":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800/50";
      default:
        return "bg-slate-50 dark:bg-ink-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-white/10 font-sans";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      
      <PageHeader
        title="Service Line Performance Hub"
        subtitle="Review departmental margin contributions, patient volume variances, and execute compliance workflows."
        icon={Layers}
        trailing={
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveExecutiveSummary}
            className="px-3.5 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Save Executive Summary
          </button>
          <button
            onClick={handleGenerateReviewPacket}
            className="px-3.5 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Generate Review Packet
          </button>
          <button
            onClick={handleMarkReviewComplete}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-brand-50/50 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Mark Month-End Review Complete
          </button>
        </div>
        }
      />

      <PagePurpose
        title="Why this page matters"
        what="Per-department margin, variance, and reviewer notes in one view."
        value="Spot watchlist service lines before they erode the margin."
        stat={{ label: "Illustrative denial flag", value: `~${formatCurrency(1_800_000)}` }}
        icon={ShieldCheck}
      />

      <div className="rounded-2xl border border-brand-200/80 bg-brand-50/60 dark:bg-brand-950/30 dark:border-brand-800/50 px-4 py-3">
        <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">
          Sr Financial Analyst focus — supply initiative variance
        </p>
        <p className="text-[11px] text-brand-700/90 dark:text-brand-300/90 mt-0.5">
          Supply chain lines are sorted first for Houston market review; use variance notes to tie spend to GPO and initiative drivers.
        </p>
      </div>

      {/* 7 Required Service Line Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aggs.map((agg) => {
          const meta = SERVICE_META[agg.serviceLine] || {
            name: agg.serviceLine,
            icon: Activity,
            driver: "Operational targets within standardized baselines.",
            volumeChangePct: 0.0
          };
          
          const IconComponent = meta.icon;
          const isFlagged = flaggedServices[agg.serviceLine];
          const hasOwnNote = records.find(r => r.service_line === agg.serviceLine)?.variance_note;

          return (
            <div
              key={agg.serviceLine}
              className={`bg-white dark:bg-ink-800 rounded-3xl p-5 border shadow-xs transition-all flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md ${isFlagged ? "border-amber-300 ring-2 ring-amber-50" : "border-slate-100 dark:border-white/10"}`}
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-50 dark:border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-ink-900 rounded-xl text-brand-600">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{agg.serviceLine}</h3>
                    <span className={`text-[10px] block font-medium ${captionClass()}`}>Assigned to {agg.owner}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-sm text-[9px] font-bold border ${getStatusStyle(agg.status)}`}>
                    {agg.status}
                  </span>
                  <button
                    onClick={() => toggleFlag(agg.serviceLine)}
                    className={`p-1.5 rounded-full border transition-colors ${isFlagged ? "bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400" : "bg-slate-50 dark:bg-ink-900 border-slate-100 dark:border-white/10 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
                    title="Flag for audit"
                  >
                    <Flag className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 py-4">
                <div>
                  <span className={`text-[10px] block ${captionClass()}`}>Net Revenue</span>
                  <span className={`text-sm font-bold block mt-0.5 font-mono tabular-nums ${dataPrimaryClass()}`}>
                    {formatCurrency(agg.netRevenue)}
                  </span>
                </div>
                <div>
                  <span className={`text-[10px] block ${captionClass()}`}>Operating Margin</span>
                  <span className={`text-sm font-bold block mt-0.5 font-mono tabular-nums ${marginPercentClass(agg.operatingMargin)}`}>
                    {formatPercent(agg.operatingMargin)}
                  </span>
                </div>
                <div>
                  <span className={`text-[10px] block ${captionClass()}`}>Budget Variance</span>
                  <span className={`text-sm font-bold block mt-0.5 font-mono tabular-nums ${varianceClass(agg.budgetVariance)}`}>
                    {formatVarianceCurrency(agg.budgetVariance)}
                  </span>
                </div>
                <div>
                  <span className={`text-[10px] block ${captionClass()}`}>Volume Variation</span>
                  <span className={`text-sm font-bold block mt-0.5 font-mono tabular-nums ${varianceClass(meta.volumeChangePct)}`}>
                    {formatPercent(meta.volumeChangePct, { signed: true })} vs target
                  </span>
                </div>
              </div>

              {/* Key Driver Notes */}
              <div className="bg-slate-50/60 dark:bg-ink-900 rounded-xl p-3 border border-slate-100/50 dark:border-white/10 mt-1 mb-4 flex-grow">
                <span className={`text-[10px] font-bold uppercase tracking-wide block mb-1 ${captionClass()}`}>
                  Primary Stewardship Driver:
                </span>
                <p className={`text-[11px] leading-relaxed font-medium ${dataSecondaryClass()}`}>
                  {hasOwnNote || meta.driver}
                </p>
              </div>

              {/* Workflow Actions footer of card */}
              <div className="border-t border-slate-50 dark:border-white/10 pt-3 flex items-center justify-between text-xs">
                <span className={`text-[10px] font-mono ${captionClass()}`}>
                  State: <strong className={`font-semibold ${dataPrimaryClass()}`}>{agg.reviewStatus}</strong>
                </span>

                {addingNoteFor === agg.serviceLine ? (
                  <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-ink-800 p-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl z-20 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-slate-700 dark:text-slate-100">Add Variance Note for {agg.serviceLine}</h4>
                      <button onClick={() => setAddingNoteFor(null)} className="text-slate-400 text-xs">✕</button>
                    </div>
                    <textarea
                      value={inputNote}
                      onChange={(e) => setInputNote(e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-slate-200 dark:border-white/10 dark:bg-ink-900 rounded-lg p-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-500"
                      placeholder="Input the core driver variance data..."
                    />
                    <button
                      onClick={() => saveQuickNote(agg.serviceLine)}
                      className="w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      Save Note
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingNoteFor(agg.serviceLine);
                      setInputNote(hasOwnNote || "");
                    }}
                    className="text-[10px] font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Variance Note
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stewardship Checklist Card */}
      <div className="bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-500 animate-pulse" /> Unified Director Audit Program
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ensure you review outlier service line ratios (e.g. Cardiology claim rejections and Emergency premium nursing overages) before certifying the month-end packet for the active close period.
          </p>
        </div>
        <button
          onClick={() => {
            onTriggerToast("System variance workbook compiled successfully. Active audits aligned.", "success");
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl shrink-0 transition-colors cursor-pointer"
        >
          Verify Payer Claims Audit
        </button>
      </div>

    </div>
  );
}

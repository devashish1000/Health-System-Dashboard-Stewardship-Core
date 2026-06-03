import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, TrendingUp, Calendar, User, Save, FileText, Share2 } from "lucide-react";
import { FinanceRecord } from "../data/syntheticFinanceData";
import { SUPPLY_CHAIN_SERVICE_LINES } from "../constants/recruiterHandoff";
import { captionText } from "../lib/typography";

interface ServiceLineDrawerProps {
  record: FinanceRecord | null;
  onClose: () => void;
  onSaveRecord: (updated: FinanceRecord) => void;
  onTriggerToast: (text: string, type: "success" | "info" | "warning") => void;
}

export default function ServiceLineDrawer({
  record,
  onClose,
  onSaveRecord,
  onTriggerToast
}: ServiceLineDrawerProps) {
  if (!record) return null;

  const [note, setNote] = useState(record.variance_note);
  const [reviewStatus, setReviewStatus] = useState(record.review_status);

  const handleSave = () => {
    const updated: FinanceRecord = {
      ...record,
      variance_note: note,
      review_status: reviewStatus,
      last_updated: new Date().toISOString().split("T")[0]
    };
    onSaveRecord(updated);
    onTriggerToast(`Successfully updated review status and saved note for ${record.service_line} at ${record.facility}.`, "success");
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Favorable":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle className="w-3.5 h-3.5" /> Favorable
          </span>
        );
      case "Watchlist":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <AlertTriangle className="w-3.5 h-3.5" /> Watchlist
          </span>
        );
      case "Unfavorable":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5" /> High Risk Variance
          </span>
        );
      default:
        return null;
    }
  };

  const netMargin = ((record.net_patient_revenue - record.operating_expense) / record.net_patient_revenue) * 100;
  const isSupplyChainLine = (SUPPLY_CHAIN_SERVICE_LINES as readonly string[]).includes(
    record.service_line
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="relative w-screen max-w-lg bg-white dark:bg-ink-800 h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
        {/* Header */}
        <div className="p-6 bg-ink-900 text-white border-b border-slate-800 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">
              Service Line Detail View
            </span>
            <h2 className="text-xl font-semibold mt-0.5">{record.service_line}</h2>
            <p className="text-xs text-slate-300 mt-1">{record.facility} • {record.region}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Indicators */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-400 block">Performance Status</span>
              <div className="mt-1">{getStatusBadge(record.variance_status)}</div>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-400 block text-right">Budget Variance</span>
              <span className={`text-sm font-semibold block mt-1 text-right ${record.budget_variance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {record.budget_variance >= 0 ? "+" : ""}{(record.budget_variance / 1000).toFixed(0)}K
              </span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3 block">
              Financial Performance Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-400 dark:text-slate-400 block">Net Patient Revenue</span>
                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1 block">
                  ${(record.net_patient_revenue / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-400 dark:text-slate-400 block">Operating Expense</span>
                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1 block">
                  ${(record.operating_expense / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-400 dark:text-slate-400 block">Operating Margin</span>
                <span className={`text-lg font-semibold mt-1 block ${netMargin >= 5 ? "text-emerald-600" : (netMargin < 0 ? "text-rose-600" : "text-slate-700")}`}>
                  {netMargin.toFixed(2)}%
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                <span className="text-xs text-slate-400 dark:text-slate-400 block">Patient Volume</span>
                <span className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1 block">
                  {record.patient_volume.toLocaleString()} cases
                </span>
              </div>
            </div>
          </div>

          {/* Under-the-hood cost factors */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3 block">
              Operational Cost Drivers
            </h3>
            <div className="space-y-3 bg-white dark:bg-ink-800 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between text-sm py-1">
                <span className={captionText}>Clinical Labor cost</span>
                <span className="font-semibold text-slate-700">${(record.labor_cost / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className={captionText}>Medical supplies expense</span>
                <span className="font-semibold text-slate-700">${(record.supply_cost / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className={captionText}>Overtime usage ratio</span>
                <span className="font-semibold text-slate-700">{record.overtime_utilization}%</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1 animate-fade-in">
                <span className={captionText}>Claims Denial rate</span>
                <span className={`font-semibold ${record.denial_rate > 4 ? "text-rose-600" : "text-slate-700"}`}>{record.denial_rate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1">
                <span className={captionText}>Reimbursement delay (days AR)</span>
                <span className="font-semibold text-slate-700">{record.reimbursement_delay_days} days</span>
              </div>
            </div>
          </div>

          {/* Review workflow and notes */}
          <div className="border-t border-slate-100 dark:border-white/10 pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Leadership Stewardship Workflow
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium block mb-1.5 flex items-center gap-1 ${captionText}`}>
                  <User className="w-3.5 h-3.5" /> Assigned Owner
                </label>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-100 bg-slate-50 dark:bg-ink-900 px-3 py-2 rounded-xl border border-slate-100 dark:border-white/10">
                  {record.owner}
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium block mb-1.5 flex items-center gap-1 ${captionText}`}>
                  <TrendingUp className="w-3.5 h-3.5" /> Leadership Review Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as any)}
                  className="w-full text-sm bg-white dark:bg-ink-900 border border-slate-200 dark:border-white/10 hover:border-slate-300 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-brand-100 text-slate-700 dark:text-slate-100 font-medium transition-all"
                >
                  <option value="New">New</option>
                  <option value="Analyst Review">Analyst Review</option>
                  <option value="Director Review">Director Review</option>
                  <option value="Executive Ready">Executive Ready</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-medium block mb-1.5 flex items-center gap-1 ${captionText}`}>
                  <FileText className="w-3.5 h-3.5" /> Financial Driver Variance Explanations
                </label>
                {isSupplyChainLine && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-2">
                    Tie the note to GPO tier compliance, supply initiative targets, and contract renegotiation timing—not isolated unit-cost spikes.
                  </p>
                )}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full text-sm bg-white dark:bg-ink-900 border border-slate-200 dark:border-white/10 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-brand-100 text-slate-700 dark:text-slate-100 font-medium transition-all"
                  placeholder="Summarize underlying reasons for the budget variance and record stewardship recovery actions..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 dark:bg-ink-900 border-t border-slate-100 dark:border-white/10 flex items-center gap-3">
          <button
            onClick={() => {
              onTriggerToast(`Document packet prepared for ${record.service_line}. Review pending.`, "info");
            }}
            className="flex-1 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-ink-800 text-slate-600 dark:text-slate-100 px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Packet
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
          >
            <Save className="w-4 h-4" /> Save Findings
          </button>
        </div>
      </div>
    </div>
  );
}

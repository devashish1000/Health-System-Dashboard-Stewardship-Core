import React, { useMemo } from "react";
import { X, FileSpreadsheet, FileCode, Printer, HelpCircle } from "lucide-react";
import { FinanceRecord } from "../types";
import {
  formatCount,
  formatCurrency,
  formatPercent,
  formatVarianceCurrency,
} from "../lib/formatters";

import type { ReportingContext } from "../lib/reportingPeriod";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredRecords: FinanceRecord[];
  signoffs: any[];
  reporting: ReportingContext;
  onTriggerToast: (text: string, type: "success" | "info" | "warning") => void;
}

export default function ExportDataModal({
  isOpen,
  onClose,
  filteredRecords,
  signoffs,
  reporting,
  onTriggerToast
}: ExportDataModalProps) {
  const exportSummary = useMemo(() => {
    if (filteredRecords.length === 0) {
      return {
        totalNpr: 0,
        totalExpense: 0,
        avgMargin: 0,
        totalSupply: 0,
        netVariance: 0,
      };
    }
    const totalNpr = filteredRecords.reduce((sum, r) => sum + r.net_patient_revenue, 0);
    const totalExpense = filteredRecords.reduce((sum, r) => sum + r.operating_expense, 0);
    const totalSupply = filteredRecords.reduce((sum, r) => sum + r.supply_cost, 0);
    const avgMargin =
      filteredRecords.reduce((sum, r) => sum + r.operating_margin, 0) / filteredRecords.length;
    const netVariance = filteredRecords.reduce((sum, r) => sum + r.budget_variance, 0);
    return { totalNpr, totalExpense, totalSupply, avgMargin, netVariance };
  }, [filteredRecords]);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    try {
      const headers = [
        "ID", "Month", "Facility", "Region", "Service Line", 
        "Net Patient Revenue", "Operating Expense", "Labor Cost", "Supply Cost",
        "Operating Margin %", "Budget Variance", "Patient Volume",
        "Denial Rate %", "Reimbursement Delay Days", "Overtime %", 
        "Variance Status", "Payer Type", "Review Status", "Variance Note", "Owner"
      ];

      const rows = filteredRecords.map(r => [
        r.id,
        r.month,
        `"${r.facility || ""}"`,
        `"${r.region || ""}"`,
        `"${r.service_line || ""}"`,
        r.net_patient_revenue,
        r.operating_expense,
        r.labor_cost,
        r.supply_cost,
        r.operating_margin,
        r.budget_variance,
        r.patient_volume,
        r.denial_rate,
        r.reimbursement_delay_days,
        r.overtime_utilization,
        r.variance_status,
        r.payer_type,
        r.review_status,
        `"${(r.variance_note || "").replace(/"/g, '""')}"`,
        `"${r.owner || ""}"`
      ]);

      const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const periodTag = `${reporting.fiscalYearLabel}_${reporting.periodLabel}`.replace(/\s+/g, "");
      link.download = `CommonSpirit_Finance_${periodTag}_${reporting.closeMonth}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onTriggerToast(
        `Exported ${filteredRecords.length} rows (${reporting.closeMonthLabel}) to CSV.`,
        "success"
      );
    } catch (err: any) {
      console.error("CSV Export failure:", err);
      onTriggerToast("Failed to generate CSV export file.", "warning");
    }
  };

  const handleExportLedgerJSON = () => {
    try {
      if (signoffs.length === 0) {
        onTriggerToast("No certified reviews are currently registered in the local Ledger database.", "info");
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signoffs, null, 2));
      const link = document.createElement("a");
      link.href = dataStr;
      link.download = `CommonSpirit_Certified_Ledger_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onTriggerToast("Certified certification ledger exported successfully.", "success");
    } catch (err) {
      onTriggerToast("Failed to generate ledger JSON file.", "warning");
    }
  };

  const handlePrintDraft = () => {
    onTriggerToast("Optimizing layout for print. Initializing print pipeline...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      {/* Container Card */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-xl max-w-lg w-full overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="bg-ink-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-400" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-100">
              Finance Export Suite
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed space-y-1.5">
            <p>
              CommonSpirit Finance export formats for synthetic stewardship demos. Files reflect your
              current dashboard filters and close-month period — not production system data.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-400">
              Export scope: **{formatCount(filteredRecords.length)}** filtered rows · ledger close **{reporting.closeMonthLabel}** ({reporting.fiscalYearLabel} {reporting.periodLabel}).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-ink-900">
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Net patient revenue</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-800 dark:text-slate-100">
                {formatCurrency(exportSummary.totalNpr)}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Supply chain cost</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-800 dark:text-slate-100">
                {formatCurrency(exportSummary.totalSupply)}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Operating expense</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-800 dark:text-slate-100">
                {formatCurrency(exportSummary.totalExpense)}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Avg operating margin</span>
              <span className="text-sm font-bold font-mono tabular-nums text-brand-700">
                {formatPercent(exportSummary.avgMargin, { decimals: 1 })}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Net budget variance</span>
              <span className="text-sm font-bold font-mono tabular-nums text-slate-800 dark:text-slate-100">
                {formatVarianceCurrency(exportSummary.netVariance)}
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Box 1: CSV */}
            <button
              onClick={handleExportCSV}
              className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-brand-200 hover:bg-brand-50/20 text-left flex items-start gap-4 transition-all cursor-pointer group"
            >
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">Export filtered ledger (CSV)</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-400 leading-snug">
                  Close-month rows with NPR, labor, supply chain cost, margin, variance notes, and finance owner — ready for Strata-style review in Excel or Google Sheets.
                </span>
              </div>
            </button>

            {/* Box 2: JSON ledger */}
            <button
              onClick={handleExportLedgerJSON}
              className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-brand-200 hover:bg-brand-50/20 text-left flex items-start gap-4 transition-all cursor-pointer group"
            >
              <div className="p-2.5 rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0">
                <FileCode className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">Export Sign-off Ledger (JSON)</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-400 leading-snug">
                  Provides a cryptographically hash-audited ledger in raw JSON detailing past certified session cycles, timestamped signatories, and comment blocks.
                </span>
              </div>
            </button>

            {/* Box 3: Print */}
            <button
              onClick={handlePrintDraft}
              className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-brand-200 hover:bg-brand-50/20 text-left flex items-start gap-4 transition-all cursor-pointer group"
            >
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">Print Operational Briefing</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-400 leading-snug">
                  Formats the active viewport layout for physical distribution or standard PDF driver rendering, discarding control buttons and sidebars.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-ink-900 px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-400 font-medium">
          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Files contain dummy synthetic performance values for clinical demonstration only.</span>
        </div>

      </div>
    </div>
  );
}

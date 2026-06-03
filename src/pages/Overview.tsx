import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Cpu, BarChart3, HelpCircle, Activity, Globe, Heart,
  Sparkles, CheckCircle2, ChevronRight, Lock,
  Zap, Clock, ShieldCheck, Database, Users, RefreshCcw,
  Briefcase, FileSpreadsheet, ArrowRight, Download
} from "lucide-react";
import { ProjectPage, FinanceRecord } from "../types";
import { BrandSweep, SparkMark } from "../components/BrandMotif";
import {
  formatCurrency,
  formatPercent,
  formatCount,
} from "../lib/formatters";
import { useReportingPeriod } from "../lib/useReportingPeriod";
import { computeOverviewHeroMetrics } from "../lib/overviewMetrics";
import {
  DATA_HANDOFF_WORKBOOK_FILENAME,
  DATA_HANDOFF_WORKBOOK_PATH,
} from "../constants/dataHandoff";

interface OverviewProps {
  onNavigate: (page: ProjectPage) => void;
  records: FinanceRecord[];
  checklistCompleted: Record<string, boolean>;
  onToggleChecklist: (key: string, val: boolean) => void;
  onStartReviewerPath?: () => void;
}

export default function Overview({ 
  onNavigate,
  records,
  checklistCompleted,
  onToggleChecklist,
  onStartReviewerPath,
}: OverviewProps) {
  const reporting = useReportingPeriod(records);
  const hero = React.useMemo(
    () => computeOverviewHeroMetrics(records, reporting),
    [records, reporting]
  );

  // Dynamic Validation checks matched to genuine record instances
  const surgicalSuppliesRef = records.find(
    (r) =>
      r.service_line === "Surgical Supplies" &&
      r.facility === "Baylor St. Luke's Medical Center"
  );
  const isSupplyLineAnnotated = !!(surgicalSuppliesRef?.variance_note?.trim());

  // Task checks
  const task1 = isSupplyLineAnnotated || checklistCompleted.denials;
  const task2 = checklistCompleted.copilot;
  const task3 = checklistCompleted.signoff;
  const task4 = checklistCompleted.simulator;

  const completedCount = (task1 ? 1 : 0) + (task2 ? 1 : 0) + (task3 ? 1 : 0) + (task4 ? 1 : 0);
  const completionPercent = completedCount * 25;

  const jobMapRows: {
    duty: string;
    destination: string;
    page?: ProjectPage;
    hint?: string;
  }[] = [
    { duty: "Variance reports", destination: "Financial Dashboard", page: "dashboard" },
    { duty: "Budget support", destination: "Forecast & Walk", page: "forecast" },
    { duty: "Supply chain insight", destination: "Service Lines", page: "serviceLines" },
    { duty: "Recommendations to market finance", destination: "Finance Copilot", page: "copilot" },
    {
      duty: "Cross-functional reporting",
      destination: "Export Suite",
      hint: "Use Export in the app header",
    },
  ];

  const tasksList = [
    {
      id: "denials",
      checked: task1,
      label: "Review Surgical Supplies supply chain variance at Baylor St. Luke's",
      desc: isSupplyLineAnnotated
        ? "Complete — supply chain variance notes logged in Service Line reviewer."
        : surgicalSuppliesRef
          ? "Pending — inspect Surgical Supplies budget variance and add explanatory notes."
          : "Pending — open Service Lines and review supply chain expense drivers.",
      link: "serviceLines" as ProjectPage,
      toggleable: !isSupplyLineAnnotated
    },
    {
      id: "copilot",
      checked: task2,
      label: "Query AI Finance Copilot for supply chain decision support",
      desc: task2
        ? "Complete — briefing compiled for market finance alignment."
        : "Pending — ask about supply expense predictability or budget variance.",
      link: "copilot" as ProjectPage,
      toggleable: true
    },
    {
      id: "signoff",
      checked: task3,
      label: "Review illustrative close certification (demo only)",
      desc: task3
        ? "Complete — illustrative demo sign-off recorded for this checklist item."
        : `Pending — explore Market Finance pre-flight sign-off flow (${reporting.fiscalYearLabel} ${reporting.periodLabel}).`,
      link: "serviceLines" as ProjectPage,
      toggleable: false,
      lockRequired: true,
    },
    {
      id: "simulator",
      checked: task4,
      label: "Optional: explore scenario sandbox (not required for recruiter review)",
      desc: task4
        ? "Complete — sensitivity sandbox explored."
        : "Skip unless you want extra what-if modeling beyond the core work sample.",
      link: "simulator" as ProjectPage,
      toggleable: true,
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Hero Welcome Unit */}
      <div className="relative rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700 text-white p-8 md:p-12 shadow-xl overflow-hidden">
        {/* Signature CommonSpirit sweep */}
        <BrandSweep tone="dark" className="absolute inset-0 w-full h-full pointer-events-none" />
        {/* Subtle decorative grid/mesh in the background */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-200 border border-brand-400/20">
            <SparkMark size={16} /> Executive Intelligence Control Panel
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-tight">
            Healthcare Financial Performance <br className="hidden md:block"/>Control Tower
          </h1>
          
          <p className="text-md md:text-lg text-slate-200 font-normal leading-relaxed">
            CommonSpirit-inspired scenario for Sr Financial Analyst interview sample. Review service-line variance, run sandbox simulations, query AI intelligence, and certify fiscal periods securely.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Review the{" "}
              <a
                href={DATA_HANDOFF_WORKBOOK_PATH}
                download={DATA_HANDOFF_WORKBOOK_FILENAME}
                className="font-semibold text-brand-200 underline decoration-brand-300/60 underline-offset-2 hover:text-white"
              >
                data workbook
              </a>{" "}
              to see every field the control tower uses.
            </p>
            <a
              href={DATA_HANDOFF_WORKBOOK_PATH}
              download={DATA_HANDOFF_WORKBOOK_FILENAME}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel dictionary
            </a>
          </div>
          
          {/* Quick Stats Panel inside hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
            <div>
              <span className="text-xs text-slate-300 block">Operating Target</span>
              <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{formatPercent(hero.targetMargin)} Margin</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">NPR ({hero.periodLabel})</span>
              <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{formatCurrency(hero.totalRevenue)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Close-month rows</span>
              <span className="text-xl font-bold font-mono tabular-nums mt-0.5 block">{formatCount(records.filter(reporting.filterCloseMonth).length)} Records</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Mission Focus</span>
              <span className="text-xl font-bold font-mono mt-0.5 block">Stewardship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement Band */}
      <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-teal-600 text-white p-6 md:p-8 shadow-md flex items-start gap-4">
        <div className="p-2.5 bg-white/15 rounded-xl shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-100">The Problem We Solve</span>
          <p className="text-base md:text-xl font-semibold leading-snug">
            Finance teams spend days each month reconciling margin variance across facilities in spreadsheets. This control tower surfaces it — and the drivers behind it — in seconds.
          </p>
        </div>
      </div>

      {/* Maps to this job */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-6 md:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-600" /> Maps to this job
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sr Financial Analyst posting duties mapped to prototype pages — synthetic multi-market finance sample.
            </p>
          </div>
          {onStartReviewerPath ? (
            <button
              type="button"
              onClick={onStartReviewerPath}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
            >
              Start here for reviewers
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/10 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
          {jobMapRows.map((row) => (
            <div
              key={row.duty}
              className="flex items-center justify-between gap-4 px-4 py-3.5 bg-slate-50/50 dark:bg-ink-900/40 hover:bg-brand-50/40 dark:hover:bg-brand-900/10 transition-colors"
            >
              <div className="space-y-0.5 min-w-0">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{row.duty}</span>
                {row.hint ? (
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400">{row.hint}</span>
                ) : null}
              </div>
              {row.page ? (
                <button
                  type="button"
                  onClick={() => onNavigate(row.page!)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 hover:border-brand-200 hover:bg-brand-50 text-[10px] font-bold text-slate-600 hover:text-brand-600 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {row.destination}
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 text-[10px] font-bold text-slate-500 whitespace-nowrap shrink-0">
                  <FileSpreadsheet className="w-3 h-3" />
                  {row.destination}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ROI Callouts */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Illustrative ROI impact
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
              Directional estimates for demo storytelling only — not operational benchmarks or audited savings.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-100">
            Illustrative only
          </span>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { label: "Month-end variance review", value: "~5 days → <1 day", icon: Clock, accent: "brand", numeric: false },
            { label: "Denial leakage surfaced", value: `~${formatCurrency(hero.denialLeakage)} / ${hero.periodLabel}`, icon: TrendingUp, accent: "teal", numeric: true },
            { label: "Premium agency-labor overspend flagged", value: `~${formatCurrency(hero.agencyOverspend)}`, icon: BarChart3, accent: "amber", numeric: true },
            { label: "Time-to-board-ready brief", value: "hours → minutes", icon: Sparkles, accent: "brand", numeric: false },
          ].map((stat) => {
            const accentMap: Record<string, string> = {
              brand: "bg-brand-50 text-brand-600",
              teal: "bg-teal-50 text-teal-600",
              amber: "bg-amber-50 text-amber-600",
            };
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
                }}
                className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 w-fit rounded-xl ${accentMap[stat.accent]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                    Illustrative
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className={`block text-lg font-extrabold text-slate-800 dark:text-slate-100 ${stat.numeric ? "font-mono tabular-nums" : ""}`}>{stat.value}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 leading-snug">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <p className="text-[10px] text-slate-400 text-center">
          Illustrative ROI from synthetic close-month data ({hero.fiscalLabel}) · {formatPercent(hero.avgMargin, { decimals: 1 })} avg margin · not audited performance.
        </p>
      </div>

      {/* How This Works At Your Org */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-600" /> How This Works At Your Org
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Plugs into",
              icon: Database,
              accent: "bg-brand-50 text-brand-600",
              items: ["Epic / Cerner", "Strata / GL (Workday)", "Supply chain data feeds", "Payer claims (835 / EDI)"],
            },
            {
              title: "Used by",
              icon: Users,
              accent: "bg-teal-50 text-teal-600",
              items: ["Market finance leaders", "Supply chain finance analysts", "Service-line directors", "Finance compliance"],
            },
            {
              title: "Replaces",
              icon: RefreshCcw,
              accent: "bg-brand-50 text-brand-600",
              items: ["Manual spreadsheet consolidation", "Slow denial & variance chasing", "Static month-end decks"],
            },
          ].map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 w-fit rounded-xl ${group.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{group.title}</h3>
                </div>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Integration Note */}
        <div className="border-t border-slate-100 dark:border-white/10 pt-5 flex items-start gap-3 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Prototype on synthetic data. In production this connects to your EHR, GL, and claims feeds via read-only APIs — no PHI leaves your environment.
          </p>
        </div>
      </div>

      {/* Stewardship Positioning Note */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6 flex gap-4 text-amber-800">
        <Heart className="w-6 h-6 shrink-0 text-amber-600 mt-1" />
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-amber-900">Mission-Driven Positioning Statement</h4>
          <p className="text-xs leading-relaxed text-amber-800">
            Unlike commercial market trading platforms or investor dashboards, our Healthcare Financial Control Tower operates under a stewardship construct. Margin target realization is tracked not for corporate profit maximization, but to safeguard clinical services delivery and sustain care availability for all community participants, including underserved populations.
          </p>
        </div>
      </div>

      {/* Month-End Readiness progress widget */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left column: stats and progress bar */}
        <div className="p-8 bg-slate-50 dark:bg-ink-900 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/10 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100 uppercase uppercase">
              Compliance Tracking
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Stewardship Readiness</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
              Before submitting {reporting.closeMonthLabel} results to corporate accounting, complete these
              core checkpoints for {reporting.fiscalYearLabel} {reporting.periodLongLabel}.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline text-xs font-bold text-slate-700 dark:text-slate-100">
              <span>Period Closed Progress</span>
              <span className="font-mono tabular-nums text-brand-600 dark:text-brand-400 font-extrabold text-sm">{formatPercent(completionPercent, { decimals: 0 })}</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 shrink-0" />
              <span>{formatCount(completedCount)} of {formatCount(4)} regulatory actions signed.</span>
            </div>
          </div>
        </div>

        {/* Right 2 columns: Task List */}
        <div className="md:col-span-2 p-6 md:p-8 space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">Required Month-End Diagnostics</h4>
          
          <div className="space-y-3">
            {tasksList.map((task) => (
              <div 
                key={task.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3.5 justify-between transition-all ${
                  task.checked 
                    ? "border-emerald-100 dark:border-emerald-800/40 bg-emerald-50/80 dark:bg-emerald-950/30" 
                    : "border-slate-100 bg-white dark:bg-ink-800/80 dark:border-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    disabled={!task.toggleable}
                    onClick={() => onToggleChecklist(task.id, !task.checked)}
                    className={`mt-0.5 p-0.5 rounded transition-all cursor-pointer ${
                      task.checked 
                        ? "text-emerald-600 bg-emerald-50" 
                        : task.toggleable 
                          ? "text-slate-300 hover:text-brand-500 hover:bg-slate-50"
                          : "text-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${task.checked ? "fill-emerald-100" : ""}`} />
                  </button>
                  <div className="space-y-0.5">
                    <span className={`block text-xs font-bold ${task.checked ? "text-slate-600 dark:text-slate-400 line-through decoration-slate-400" : "text-on-surface"}`}>
                      {task.label}
                    </span>
                    <span className="block text-[10px] text-muted-surface leading-normal">{task.desc}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(task.link)}
                  className="p-1 px-2.5 rounded-lg border border-slate-100 dark:border-white/10 hover:border-brand-200 hover:bg-brand-50 text-[10px] font-bold text-slate-500 hover:text-brand-600 flex items-center gap-0.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  {task.lockRequired && !task.checked ? <Lock className="w-2.5 h-2.5 mr-0.5" /> : null}
                  Go <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Three Primary Programmatic Pillars */}

      <div>
        <h2 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-600" /> Prototype Capabilities Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-brand-50 text-brand-600 w-fit rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-md">1. Budget-to-Actual Visibility</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Provides deep operational granularity across regions and clinics, tracking Net Patient Revenue (NPR), Expense Watchlists, and operating variance ratios without compromising data security.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-teal-50 text-teal-600 w-fit rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-md">2. Financial Driver Intelligence</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Decomposes cost structures into critical clinical factors like premium nurse registry utilization, medical implants supply chain inflation, and claims insurance denial rates.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white dark:bg-ink-800 rounded-2xl p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-brand-50 text-brand-600 w-fit rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-md">3. Executive Financial Storytelling</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Leverages large language models (featuring safe server-side proxy integration) to generate leadership-ready briefs that translate raw analytical tables into coherent actions.
            </p>
          </div>
        </div>
      </div>

      {/* Guided CTA Navigation Section */}
      <div className="border-t border-slate-100 dark:border-white/10 pt-8">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider block">
          Select Your Analytical Workspace Entrypoint:
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800 dark:text-slate-100">View Financial Dashboard</span>
              <span className="block font-normal text-xs text-slate-500 dark:text-slate-400 text-wrap pr-4">Analyze KPIs, charts, and facility record filters</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => onNavigate("serviceLines")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800 dark:text-slate-100">Open Service-Line View</span>
              <span className="block font-normal text-xs text-slate-500 dark:text-slate-400 text-wrap pr-4">Oversee specific departments and annotate notes</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => onNavigate("copilot")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 dark:text-slate-100 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800 dark:text-slate-100">Ask Finance Copilot</span>
              <span className="block font-normal text-xs text-slate-500 dark:text-slate-400 text-wrap pr-4">Query financial variables using Gemini AI support</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-brand-600 group-hover:text-white transition-colors">
              <Cpu className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { 
  Landmark, TrendingUp, Cpu, BarChart3, HelpCircle, Activity, Globe, Heart,
  CheckSquare, Sparkles, CheckCircle2, ChevronRight, Lock
} from "lucide-react";
import { ProjectPage, FinanceRecord } from "../types";

interface OverviewProps {
  onNavigate: (page: ProjectPage) => void;
  records: FinanceRecord[];
  checklistCompleted: Record<string, boolean>;
  onToggleChecklist: (key: string, val: boolean) => void;
}

export default function Overview({ 
  onNavigate,
  records,
  checklistCompleted,
  onToggleChecklist
}: OverviewProps) {

  // Dynamic Validation checks matched to genuine record instances
  const cardiologyRef = records.find(r => r.service_line === "Cardiology" && r.facility === "St. Joseph Medical Center");
  const isCardiologyAnnotated = !!(cardiologyRef?.variance_note?.trim());

  // Task checks
  const task1 = isCardiologyAnnotated || checklistCompleted.denials;
  const task2 = checklistCompleted.simulator;
  const task3 = checklistCompleted.copilot;
  const task4 = checklistCompleted.signoff;

  const completedCount = (task1 ? 1 : 0) + (task2 ? 1 : 0) + (task3 ? 1 : 0) + (task4 ? 1 : 0);
  const completionPercent = completedCount * 25;

  const tasksList = [
    {
      id: "denials",
      checked: task1,
      label: "Audit Cardiology Prior Authorization outliers",
      desc: isCardiologyAnnotated 
        ? "Complete — variance notes logged in Service Line reviewer." 
        : "Pending — review high denials and write explanatory comments.",
      link: "serviceLines" as ProjectPage,
      toggleable: !isCardiologyAnnotated
    },
    {
      id: "simulator",
      checked: task2,
      label: "Run strategic margin sensitivity simulator models",
      desc: task2 
        ? "Complete — staff-to-reimbursement slider delta analyzed." 
        : "Pending — adjust simulation options inside the sandbox console.",
      link: "simulator" as ProjectPage,
      toggleable: true
    },
    {
      id: "copilot",
      checked: task3,
      label: "Query AI Finance Copilot for decision-support insights",
      desc: task3 
        ? "Complete — briefing compiled and structured for team alignment." 
        : "Pending — ask co-pilot about margin target constraints.",
      link: "copilot" as ProjectPage,
      toggleable: true
    },
    {
      id: "signoff",
      checked: task4,
      label: "Digitally sign and seal finalized cycle ledger certificate",
      desc: task4 
        ? "Complete — cryptographically verified ledger block registered!" 
        : "Pending — requires CFO profile sign-off to close reporting period.",
      link: "serviceLines" as ProjectPage, // links to header trigger or reviews page
      toggleable: false,
      lockRequired: true
    }
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Hero Welcome Unit */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#334155] text-white p-8 md:p-12 shadow-xl overflow-hidden">
        {/* Subtle decorative grid/mesh in the background */}
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(#e0f2fe_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/20">
            <Landmark className="w-3.5 h-3.5 text-blue-400" /> Executive Intelligence Control Panel
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
            Healthcare Financial Performance <br className="hidden md:block"/>Control Tower
          </h1>
          
          <p className="text-md md:text-lg text-slate-200 font-normal leading-relaxed">
            AI-assisted financial control tower mapped to CommonSpirit Health stewardship baselines. Review service-line variance, run sandbox simulations, query AI intelligence, and certify fiscal periods securely.
          </p>
          
          {/* Quick Stats Panel inside hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-700/60">
            <div>
              <span className="text-xs text-slate-300 block">Operating Target</span>
              <span className="text-xl font-bold font-mono mt-0.5 block">8.5% Margin</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Total Revenue Managed</span>
              <span className="text-xl font-bold font-mono mt-0.5 block">$48.7M</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Clinics Audited</span>
              <span className="text-xl font-bold font-mono mt-0.5 block">37 Records</span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Mission Focus</span>
              <span className="text-xl font-bold font-mono mt-0.5 block">Stewardship</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stewardship Positioning Note */}
      <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6 flex gap-4 text-amber-850">
        <Heart className="w-6 h-6 shrink-0 text-amber-600 mt-1" />
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-amber-900">Mission-Driven Positioning Statement</h4>
          <p className="text-xs leading-relaxed text-amber-800">
            Unlike commercial market trading platforms or investor dashboards, our Healthcare Financial Control Tower operates under a stewardship construct. Margin target realization is tracked not for corporate profit maximization, but to safeguard clinical services delivery and sustain care availability for all community participants, including underserved populations.
          </p>
        </div>
      </div>

      {/* Month-End Readiness progress widget */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left column: stats and progress bar */}
        <div className="p-8 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase uppercase">
              Compliance Tracking
            </span>
            <h3 className="text-lg font-bold text-slate-800">Stewardship Readiness</h3>
            <p className="text-xs text-slate-450 leading-relaxed">
              Before submitting monthly results to corporate accounting, complete these core checkpoints.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline text-xs font-bold text-slate-700">
              <span>Period Closed Progress</span>
              <span className="font-mono text-blue-600 font-extrabold text-sm">{completionPercent}%</span>
            </div>
            {/* Visual Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{completedCount} of 4 regulatory actions signed.</span>
            </div>
          </div>
        </div>

        {/* Right 2 columns: Task List */}
        <div className="md:col-span-2 p-6 md:p-8 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Required Month-End Diagnostics</h4>
          
          <div className="space-y-3">
            {tasksList.map((task) => (
              <div 
                key={task.id}
                className={`p-3.5 rounded-2xl border flex items-start gap-3.5 justify-between transition-all ${
                  task.checked 
                    ? "border-emerald-100 bg-emerald-50/10" 
                    : "border-slate-100 bg-white"
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
                          ? "text-slate-300 hover:text-blue-500 hover:bg-slate-50" 
                          : "text-slate-200 cursor-not-allowed"
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${task.checked ? "fill-emerald-100" : ""}`} />
                  </button>
                  <div className="space-y-0.5">
                    <span className={`block text-xs font-bold ${task.checked ? "text-slate-700 line-through decoration-slate-400" : "text-slate-800"}`}>
                      {task.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 leading-normal">{task.desc}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(task.link)}
                  className="p-1 px-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-[10px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-0.5 transition-all cursor-pointer whitespace-nowrap"
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
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" /> Prototype Capabilities Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-blue-50 text-blue-600 w-fit rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-md">1. Budget-to-Actual Visibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provides deep operational granularity across regions and clinics, tracking Net Patient Revenue (NPR), Expense Watchlists, and operating variance ratios without compromising data security.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-teal-50 text-teal-600 w-fit rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-md">2. Financial Driver Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decomposes cost structures into critical clinical factors like premium nurse registry utilization, medical implants supply chain inflation, and claims insurance denial rates.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:translate-y-[-2px] transition-all duration-300 space-y-4">
            <div className="p-3 bg-purple-50 text-purple-600 w-fit rounded-xl">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-md">3. Executive Financial Storytelling</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Leverages large language models (featuring safe server-side proxy integration) to generate leadership-ready briefs that translate raw analytical tables into coherent actions.
            </p>
          </div>
        </div>
      </div>

      {/* Guided CTA Navigation Section */}
      <div className="border-t border-slate-100 pt-8">
        <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider block">
          Select Your Analytical Workspace Entrypoint:
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800">View Financial Dashboard</span>
              <span className="block font-normal text-xs text-slate-500 text-wrap pr-4">Analyze KPIs, charts, and facility record filters</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => onNavigate("serviceLines")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800">Open Service-Line View</span>
              <span className="block font-normal text-xs text-slate-500 text-wrap pr-4">Oversee specific departments and annotate notes</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={() => onNavigate("copilot")}
            className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 text-left transition-all duration-200 group group-hover:border-slate-300 text-slate-800 font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="space-y-1">
              <span className="block text-slate-800">Ask Finance Copilot</span>
              <span className="block font-normal text-xs text-slate-500 text-wrap pr-4">Query financial variables using Gemini AI support</span>
            </span>
            <span className="p-2 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Cpu className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

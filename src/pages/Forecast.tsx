import React from "react";
import {
  TrendingUp, TrendingDown, HelpCircle, Activity, Landmark, Calendar,
  ArrowUpRight, ArrowDownRight, Users, Info, ShieldAlert, Cpu
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell
} from "recharts";
import { FinanceRecord } from "../data/syntheticFinanceData";
import { calculateKpis, getMonthlyHistory, calculateWaterfallSteps } from "../lib/financeCalculations";
import { formatCurrency } from "../lib/utils";
import PagePurpose from "../components/PagePurpose";

interface ForecastProps {
  records: FinanceRecord[];
}

export default function Forecast({ records }: ForecastProps) {
  const currentKpis = calculateKpis(records);
  const monthlyHistory = getMonthlyHistory(records);
  const waterfallSteps = calculateWaterfallSteps(currentKpis);

  // Grouped contribution coordinates
  const driverContributions = [
    { name: "Labor Cost Ratio Impact", value: "-1.4 pts", label: "Registry nursing premiums", status: "unfavorable", icon: TrendingDown },
    { name: "Payer Mix Index Impact", value: "-0.7 pts", label: "Medicare elective proportion", status: "unfavorable", icon: TrendingDown },
    { name: "Denial Rates Impact", value: "-0.4 pts", label: "Commercial claim pre-auths", status: "unfavorable", icon: TrendingDown },
    { name: "Patient Case Volume", value: "+0.8 pts", label: "Strong diagnostic CT/MRI referrals", status: "favorable", icon: TrendingUp },
    { name: "Reimbursement AR Timing", value: "-0.3 pts", label: "Technical billing backlogs", status: "unfavorable", icon: TrendingDown }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* Overview Intro Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Forecast & Variance Driver Modeling
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Continuous operating margin projection, variance walk, and driver impact attribution modeling.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Last Calibrated: June 2, 2026
        </div>
      </div>

      <PagePurpose
        title="Why this page matters"
        what="Rolling margin projection plus a driver waterfall."
        value="Shows leadership exactly what moved the number — and why."
        stat={{ label: "Operating target", value: "8.5%" }}
        icon={TrendingUp}
      />

      {/* Two core visual models row (Trend Forecast and Waterfall Variance Drivers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Monthly Margin Forecast chart with shaded target */}
        <div className="bg-white dark:bg-ink-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Margin Shaded Baseline Forecast (%)
            </h3>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block mt-1">Target Operating Margin Target Alignment (8.5%)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyHistory} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[0, 15]} stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {/* Benchmark line representing minimum viable health system safety margin */}
                <Line type="monotone" dataKey="targetMargin" name="Target Floor (8.5%)" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="actualMargin" name="Actual Margin %" stroke="#982f6a" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="forecastMargin" name="Projected Smooth Forecast %" stroke="#A78BFA" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400">
            Trend reflects continuous historical walk from January through May and maps a 3-month rolling prediction model based on claim velocities.
          </p>
        </div>

        {/* 2. Visual Waterfall bridge of variance drivers */}
        <div className="bg-white dark:bg-ink-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operational Variance Driver Waterfall (%)
            </h3>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block mt-1">Marginal Bridge: Target 8.5% down to Actual {currentKpis.operatingMargin}%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallSteps} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" fontSize={8} stroke="#94a3b8" interval={0} />
                <YAxis domain={[0, 12]} fontSize={11} stroke="#94a3b8" />
                <Tooltip formatter={(value) => `${Number(value) > 0 ? "+" : ""}${value}%`} />
                <Bar dataKey="value" fill="#38BDF8" radius={[4, 4, 0, 0]}>
                  {waterfallSteps.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.isCumulative ? "#982f6a" : (entry.value >= 0 ? "#2DD4BF" : "#EF4444")} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-slate-400">
            Favorable drivers increment green bars, unfavorable drivers decrease red bars. Cumulative anchors are dark charcoal.
          </p>
        </div>

      </div>

      {/* Driver Contributions Checklist */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 block">
          Explainable Financial Driver Contributions
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {driverContributions.map((contr) => {
            const Icon = contr.icon;
            const isFavorable = contr.status === "favorable";

            return (
              <div
                key={contr.name}
                className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-2xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg shrink-0 ${isFavorable ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-xs font-bold font-mono ${isFavorable ? "text-emerald-600" : "text-rose-600"}`}>
                    {contr.value}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {contr.name.replace(" Impact", "")}
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-tight mt-1 font-medium">
                    {contr.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI-Assisted Finance Narrative Explanation Panel */}
      <div className="bg-gradient-to-r from-brand-500/5 via-sky-500/5 to-teal-500/5 border border-slate-100 dark:border-white/10 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-200/10 rounded-full blur-2xl" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
              <span>What Changed This Month?</span>
              <span className="text-[10px] bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">AI Narrative</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100 block">Executive Summary</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                “Operating margin declined primarily due to higher labor cost ratio, unfavorable payer mix, and increased denial activity in two service lines.”
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100 block">Key Drivers</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                “Labor cost contributed the largest unfavorable variance, followed by payer mix and reimbursement timing of commercial provider billings.”
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100 block">Recommended Financial Review</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                “Validate labor variance, review reimbursement timing, compare actual service-line volume against forecast, and assess denial trends.”
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[10px] text-slate-400 italic">
            <span>Decision-Support Note: All figures are synthetic and intended to demonstrate financial analytics workflow design.</span>
            <span>Grounding Scope: Flash System Baseline</span>
          </div>
        </div>
      </div>

    </div>
  );
}

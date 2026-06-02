import React from "react";
import { 
  X, TrendingUp, Sparkles, Target, Coins, Activity, AlertCircle, ArrowUpRight, BarChart4, DollarSign, Users, ShieldAlert
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, LineChart, Line
} from "recharts";
import { FinanceRecord } from "../types";
import { calculateKpis } from "../lib/financeCalculations";
import { formatCurrency } from "../lib/utils";

interface KpiTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiType: "npr" | "opex" | "margin" | "variance" | "labor" | "forecast";
  records: FinanceRecord[];
}

export default function KpiTrendModal({
  isOpen,
  onClose,
  kpiType,
  records
}: KpiTrendModalProps) {
  if (!isOpen) return null;

  const months = [
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", 
    "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"
  ];

  // Map 12 months to actuals and projections
  const monthlyData = months.map((m) => {
    // Current actual files reside in months 2026-01 through 2026-05
    const monthDocs = records.filter(r => r.month === m);
    const kpis = calculateKpis(monthDocs);

    const isProjected = m > "2026-05";

    if (!isProjected && monthDocs.length > 0) {
      const laborRatio = kpis.netPatientRevenue > 0 ? (kpis.laborCost / kpis.netPatientRevenue) * 100 : 0;
      return {
        month: m,
        monthLabel: new Date(m + "-02").toLocaleString("default", { month: "short" }),
        npr: parseFloat((kpis.netPatientRevenue / 1e6).toFixed(2)),
        opex: parseFloat((kpis.operatingExpense / 1e6).toFixed(2)),
        margin: parseFloat(kpis.operatingMargin.toFixed(2)),
        variance: parseFloat((kpis.budgetVariance / 1e6).toFixed(2)),
        labor: parseFloat(laborRatio.toFixed(1)),
        forecast: parseFloat(kpis.forecastedMargin.toFixed(2)),
        isProjected: false
      };
    } else {
      // Create a sensible projection from the average of YTD actual filtered records
      const ytdDocs = records.filter(r => r.month <= "2026-05");
      const ytdKpis = calculateKpis(ytdDocs);
      const avgNpr = ytdKpis.netPatientRevenue > 0 ? (ytdKpis.netPatientRevenue / 5) : 9740000;
      const avgOpex = ytdKpis.operatingExpense > 0 ? (ytdKpis.operatingExpense / 5) : 8980000;
      const avgVariance = ytdKpis.budgetVariance / 5;
      const avgLabor = ytdKpis.netPatientRevenue > 0 ? (ytdKpis.laborCost / ytdKpis.netPatientRevenue) * 100 : 42.6;
      const avgMargin = ytdKpis.operatingMargin;

      // Seasonal modifiers for the projections
      const modifiers: Record<string, { npr: number; opex: number; margin: number; labor: number }> = {
        "2026-06": { npr: 1.01, opex: 1.00, margin: 0.20, labor: -0.20 },
        "2026-07": { npr: 1.03, opex: 1.02, margin: 0.40, labor: -0.50 },
        "2026-08": { npr: 0.99, opex: 1.01, margin: -0.10, labor: 0.30 },
        "2026-09": { npr: 1.05, opex: 1.03, margin: 0.80, labor: -0.80 },
        "2026-10": { npr: 1.07, opex: 1.04, margin: 1.10, labor: -1.10 },
        "2026-11": { npr: 1.08, opex: 1.05, margin: 1.30, labor: -1.30 },
        "2026-12": { npr: 1.12, opex: 1.06, margin: 1.60, labor: -1.70 },
      };

      const mod = modifiers[m] || { npr: 1, opex: 1, margin: 0, labor: 0 };
      const projectedNpr = avgNpr * mod.npr;
      const projectedOpex = avgOpex * mod.opex;
      const projectedMargin = avgMargin + mod.margin;
      const projectedVariance = avgVariance + (projectedNpr - projectedOpex - avgVariance) * 0.15;
      const projectedLabor = Math.max(30, avgLabor + mod.labor);

      return {
        month: m,
        monthLabel: new Date(m + "-02").toLocaleString("default", { month: "short" }),
        npr: parseFloat((projectedNpr / 1e6).toFixed(2)),
        opex: parseFloat((projectedOpex / 1e6).toFixed(2)),
        margin: parseFloat(projectedMargin.toFixed(2)),
        variance: parseFloat((projectedVariance / 1e6).toFixed(2)),
        labor: parseFloat(projectedLabor.toFixed(1)),
        forecast: parseFloat((projectedMargin + 0.15).toFixed(2)),
        isProjected: true
      };
    }
  });

  const getKpiMeta = () => {
    switch (kpiType) {
      case "npr":
        return {
          title: "Net Patient Revenue (NPR)",
          desc: "Total incoming clinical collections from third-party commercial payers and CMS channels.",
          key: "npr",
          unit: "$M",
          color: "#982f6a",
          fill: "rgba(152, 47, 106, 0.1)",
          target: 9.8,
          targetLabel: "Budgeted Target ($9.8M)",
          isCurrency: true
        };
      case "opex":
        return {
          title: "Operating Expense (Opex)",
          desc: "Full service-line operating expenses encompassing physical supply chains, equipment, and raw clinical inputs.",
          key: "opex",
          unit: "$M",
          color: "#D97706",
          fill: "rgba(217, 119, 6, 0.1)",
          target: 9.0,
          targetLabel: "Target Cap ($9.0M)",
          isCurrency: true
        };
      case "margin":
        return {
          title: "Operating Margin Ratio",
          desc: "Core clinical healthcare profit margins, indicating the operational remaining balance of all collections.",
          key: "margin",
          unit: "%",
          color: "#10B981",
          fill: "rgba(16, 185, 129, 0.1)",
          target: 8.5,
          targetLabel: "System Goal (8.5%)",
          isCurrency: false
        };
      case "variance":
        return {
          title: "Budget Variance Drift",
          desc: "The dollar-value delta between board-budgeted expectations and real clinical spending/revenue outcome levels.",
          key: "variance",
          unit: "$M",
          color: "#EC4899",
          fill: "rgba(236, 72, 153, 0.1)",
          target: 0.1,
          targetLabel: "Favorable Floor (+$0.1M)",
          isCurrency: true
        };
      case "labor":
        return {
          title: "Labor Cost Ratio",
          desc: "The percentage of net clinical revenues consumed by staffing, direct nursing hours, and contract physician overtime.",
          key: "labor",
          unit: "%",
          color: "#8B5CF6",
          fill: "rgba(139, 92, 246, 0.1)",
          target: 40.0,
          targetLabel: "Stewardship Target (40.0%)",
          isCurrency: false
        };
      case "forecast":
        return {
          title: "Month-End Margin Forecast",
          desc: "Statistical run-rate forecast modeling the closing operating margin based on current admission cycles.",
          key: "forecast",
          unit: "%",
          color: "#06B6D4",
          fill: "rgba(6, 182, 212, 0.1)",
          target: 8.5,
          targetLabel: "Target Closed Margin (8.5%)",
          isCurrency: false
        };
    }
  };

  const meta = getKpiMeta();
  const actualMonths = monthlyData.filter(d => !d.isProjected);
  const avgYtdValue = actualMonths.reduce((sum, d: any) => sum + d[meta.key], 0) / (actualMonths.length || 1);

  const getKpiInterval = (type: string) => {
    switch (type) {
      case "npr": return 0.6;
      case "opex": return 0.5;
      case "margin": return 1.8;
      case "variance": return 0.4;
      case "labor": return 2.2;
      case "forecast": return 1.8;
      default: return 1.0;
    }
  };

  const interval = getKpiInterval(kpiType);

  const chartData = monthlyData.map((d, index) => {
    const val = d[meta.key] as number;
    const currentInterval = d.isProjected ? interval * (1 + (index - 4) * 0.12) : interval;
    return {
      ...d,
      kpiValue: val,
      confidenceRange: [
        parseFloat(Math.max(0, val - currentInterval).toFixed(2)),
        parseFloat((val + currentInterval).toFixed(2))
      ]
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-fade-in">

        {/* Header Title */}
        <div className="bg-ink-900 text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-brand-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-slate-100">
                {meta.title} Performance Cycle
              </h3>
              <p className="text-[10px] text-slate-400">
                12-Month Historical Review & Corporate Target Indexing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Diagnostic overview box */}
          <div className="bg-slate-50 dark:bg-ink-900 p-4.5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wide">Metric Significance</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                {meta.desc} Controlled against active filters, current workspace average reflects standard **{meta.isCurrency ? formatCurrency(avgYtdValue * 1e6) : `${avgYtdValue.toFixed(1)}${meta.unit}`}** across historical YTD months.
              </p>
            </div>
          </div>

          {/* Line Chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10.5px] font-extrabold text-slate-700 dark:text-slate-100 uppercase tracking-widest">
                MONTHLY TREND ({meta.unit})
              </span>
              <div className="flex gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: meta.color }} />
                  Historical YTD
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 opacity-60" style={{ border: `1px dashed ${meta.color}` }} />
                  Projection Period
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3.5 h-2 bg-slate-200 rounded-xs" style={{ backgroundColor: meta.color, opacity: 0.15 }} />
                  Volatility Bounds
                </span>
                <span className="flex items-center gap-1.5 text-red-500">
                  <span className="w-3.5 h-0.5 border-t-2 border-red-500" strokeDasharray="3 3" />
                  Target Baseline
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-50/50 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`gradient-${kpiType}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={meta.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={meta.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="monthLabel" 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    tickLine={false}
                    tickFormatter={(tick) => meta.isCurrency ? `$${tick}M` : `${tick}%`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const val = data.kpiValue;
                        const lowRange = data.confidenceRange[0];
                        const highRange = data.confidenceRange[1];
                        return (
                          <div className="bg-ink-900 text-white p-3 rounded-xl border border-slate-800 text-[11px] shadow-lg font-sans space-y-1">
                            <div className="flex justify-between items-baseline gap-4 border-b border-slate-800 pb-1">
                              <span className="font-bold uppercase text-slate-300">{data.monthLabel} 2026</span>
                              <span className={`px-1 rounded text-[8px] font-bold ${data.isProjected ? "text-indigo-400 bg-indigo-500/10" : "text-emerald-400 bg-emerald-500/10"}`}>
                                {data.isProjected ? "PROJ" : "YTD ACTUAL"}
                              </span>
                            </div>
                            <div className="pt-1 flex flex-col gap-1">
                              <div className="flex justify-between gap-4">
                                <span className="text-slate-400 font-medium">Recorded Value:</span>
                                <span className="font-bold text-white font-mono">
                                  {meta.isCurrency ? `$${val}M` : `${val}%`}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                                <span>Volatility Bounds:</span>
                                <span className="font-semibold font-mono text-slate-300">
                                  {meta.isCurrency ? `$${lowRange}M - $${highRange}M` : `${lowRange}% - ${highRange}%`}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine 
                    y={meta.target} 
                    stroke="#EF4444" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{ value: meta.targetLabel, position: 'top', fill: '#EF4444', fontSize: '9px', fontWeight: 'bold' }} 
                  />
                  {/* Shaded baseline representation of the confidence interval */}
                  <Area
                    type="monotone"
                    dataKey="confidenceRange"
                    stroke="none"
                    fill={meta.color}
                    fillOpacity={0.12}
                    name="Volatility Range"
                  />
                  {/* Standard trend lines */}
                  <Area
                    type="monotone"
                    dataKey="kpiValue"
                    stroke={meta.color}
                    strokeWidth={2.5}
                    fill={`url(#gradient-${kpiType})`}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.isProjected) {
                        return (
                          <circle cx={cx} cy={cy} r={3.5} fill="#FFFFFF" stroke={meta.color} strokeWidth={1} strokeDasharray="2 2" key={payload.month} />
                        );
                      }
                      return (
                        <circle cx={cx} cy={cy} r={4} fill={meta.color} stroke="#FFFFFF" strokeWidth={1.5} key={payload.month} />
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-medium text-slate-400 pt-2 font-mono">
            <span>Stewardship Metrics Suite</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace Active Connection
            </span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 dark:bg-ink-900 border-t border-slate-100 dark:border-white/10 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-ink-800 text-slate-700 dark:text-slate-100 bg-white dark:bg-ink-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
}

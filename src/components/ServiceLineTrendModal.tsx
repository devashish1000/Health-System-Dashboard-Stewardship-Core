import React from "react";
import { 
  X, TrendingUp, Sparkles, Target, Coins, Activity, CheckCircle2, AlertCircle, Eye, HelpCircle, ArrowUpRight
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend
} from "recharts";
import { FinanceRecord } from "../types";

interface ServiceLineTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceLine: string;
  records: FinanceRecord[];
  onOpenAnnotation: () => void;
}

export default function ServiceLineTrendModal({
  isOpen,
  onClose,
  serviceLine,
  records,
  onOpenAnnotation
}: ServiceLineTrendModalProps) {
  if (!isOpen) return null;

  const months = [
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", 
    "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11", "2026-12"
  ];

  // Derive monthly trend data
  const monthlyData = months.map((m) => {
    const monthDocs = records.filter(r => r.service_line === serviceLine && r.month === m);
    
    if (monthDocs.length > 0) {
      let totalRev = 0;
      let totalExp = 0;
      let totalVol = 0;
      let totalDenials = 0;
      monthDocs.forEach(rec => {
        totalRev += rec.net_patient_revenue;
        totalExp += rec.operating_expense;
        totalVol += rec.patient_volume;
        totalDenials += rec.denial_rate;
      });
      const margin = totalRev > 0 ? ((totalRev - totalExp) / totalRev) * 100 : 0;
      return {
        month: m,
        monthLabel: new Date(m + "-02").toLocaleString("default", { month: "short" }),
        margin: parseFloat(margin.toFixed(2)),
        revenue: parseFloat((totalRev / 1e6).toFixed(2)), // $M
        volume: totalVol,
        denials: parseFloat((totalDenials / monthDocs.length).toFixed(1)),
        isProjected: false,
        target: 8.5
      };
    } else {
      // Calculate average baseline of existing actual docs
      const actualDocs = records.filter(r => r.service_line === serviceLine);
      let totalRev = 0;
      let totalExp = 0;
      let totalVol = 0;
      actualDocs.forEach(rec => {
        totalRev += rec.net_patient_revenue;
        totalExp += rec.operating_expense;
        totalVol += rec.patient_volume;
      });
      
      const avgMargin = totalRev > 0 ? ((totalRev - totalExp) / totalRev) * 100 : 7.2;
      const avgVol = actualDocs.length > 0 ? totalVol / actualDocs.length : 1500;
      
      // Deterministic variations for projecting future months
      const trendFactors: Record<string, { marginOffset: number; volumeOffset: number }> = {
        "2026-06": { marginOffset: 0.15, volumeOffset: 40 },
        "2026-07": { marginOffset: 0.35, volumeOffset: 90 },
        "2026-08": { marginOffset: 0.20, volumeOffset: -20 },
        "2026-09": { marginOffset: 0.55, volumeOffset: 140 },
        "2026-10": { marginOffset: 0.80, volumeOffset: 200 },
        "2026-11": { marginOffset: 1.05, volumeOffset: 270 },
        "2026-12": { marginOffset: 1.30, volumeOffset: 380 },
      };

      const factor = trendFactors[m] || { marginOffset: 0, volumeOffset: 0 };
      const simulatedMargin = avgMargin + factor.marginOffset;
      const simulatedVol = Math.round(avgVol + factor.volumeOffset);

      return {
        month: m,
        monthLabel: new Date(m + "-02").toLocaleString("default", { month: "short" }),
        margin: parseFloat(simulatedMargin.toFixed(2)),
        revenue: parseFloat(((simulatedVol * (totalRev / (totalVol || 1))) / 1e6).toFixed(2)),
        volume: simulatedVol,
        denials: parseFloat(Math.max(1.5, 3.1 - (factor.marginOffset * 0.4)).toFixed(1)),
        isProjected: true,
        target: 8.5
      };
    }
  });

  // Calculate current aggregates
  const actualMonths = monthlyData.filter(d => !d.isProjected);
  const avgActualMargin = actualMonths.reduce((sum, d) => sum + d.margin, 0) / (actualMonths.length || 1);
  const totalYtdRevenue = actualMonths.reduce((sum, d) => sum + d.revenue, 0);
  const totalYtdVolume = actualMonths.reduce((sum, d) => sum + d.volume, 0);
  const avgActualDenials = actualMonths.reduce((sum, d) => sum + d.denials, 0) / (actualMonths.length || 1);

  const getServiceColorTheme = () => {
    switch (serviceLine) {
      case "Cardiology":
        return { stroke: "#E11D48", fill: "rgba(225, 29, 72, 0.15)", bg: "text-rose-600 bg-rose-50 border-rose-100" };
      case "Neurology":
        return { stroke: "#982f6a", fill: "rgba(152, 47, 106, 0.15)", bg: "text-brand-600 bg-brand-50 border-brand-100" };
      case "Orthopedics":
        return { stroke: "#0D9488", fill: "rgba(13, 148, 136, 0.15)", bg: "text-teal-600 bg-teal-50 border-teal-100" };
      case "Emergency":
        return { stroke: "#EA580C", fill: "rgba(234, 88, 12, 0.15)", bg: "text-orange-600 bg-orange-50 border-orange-100" };
      case "Primary Care":
        return { stroke: "#0284C7", fill: "rgba(2, 132, 199, 0.15)", bg: "text-sky-600 bg-sky-50 border-sky-100" };
      default:
        return { stroke: "#982f6a", fill: "rgba(152, 47, 106, 0.15)", bg: "text-brand-600 bg-brand-50 border-brand-100" };
    }
  };

  const theme = getServiceColorTheme();
  const currentLead = records.find(r => r.service_line === serviceLine)?.owner || "Strategic Analyst";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-2xl max-w-4xl w-full overflow-hidden my-8 animate-fade-in">

        {/* Header Block */}
        <div className="bg-ink-900 text-white px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${theme.bg}`}>
              {serviceLine}
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-slate-100">
                12-Month Performance Trend
              </h3>
              <p className="text-[10px] text-slate-400">
                Historical YTD performance paired with model projectings for Q3-Q4
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

        {/* Content Panel */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Service Line KPIs Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-50/70 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 block uppercase tracking-wider">Average YTD Margin</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-mono font-extrabold ${avgActualMargin >= 8.5 ? "text-emerald-600" : (avgActualMargin < 1.0 ? "text-rose-600" : "text-slate-800")}`}>
                  {avgActualMargin.toFixed(2)}%
                </span>
                <span className="text-[9px] text-slate-400 font-semibold font-mono">baseline</span>
              </div>
            </div>

            <div className="bg-slate-50/70 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 block uppercase tracking-wider">YTD Collected Revenue</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-mono font-extrabold text-slate-800 dark:text-slate-100">
                  ${totalYtdRevenue.toFixed(1)}M
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">usd</span>
              </div>
            </div>

            <div className="bg-slate-50/70 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 block uppercase tracking-wider">Accumulated Volume</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-mono font-extrabold text-slate-800 dark:text-slate-100">
                  {totalYtdVolume.toLocaleString()}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">cases</span>
              </div>
            </div>

            <div className="bg-slate-50/70 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 block uppercase tracking-wider">Average Claim Denials</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-mono font-extrabold ${avgActualDenials > 3.0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {avgActualDenials.toFixed(1)}%
                </span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">rate</span>
              </div>
            </div>

          </div>

          {/* Recharts 12-Month Operating Margin Trend Chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-600" />
                Operating Margin Cycle (%)
              </span>
              <div className="flex gap-4 text-[10px] font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: theme.stroke }} />
                  Historical YTD
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-xs border border-dashed" style={{ borderColor: theme.stroke, backgroundColor: theme.fill }} />
                  Model Projected
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-4 h-0.5 border-t-2 border-red-500" />
                  Stewardship Target (8.5%)
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-50 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={theme.stroke} stopOpacity={0.0}/>
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
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    tickLine={false}
                    tickFormatter={(tick) => `${tick}%`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-ink-900 text-white p-3.5 rounded-xl border border-slate-800 text-[11px] shadow-lg font-sans space-y-1">
                            <div className="flex justify-between items-baseline gap-4 border-b border-slate-800 pb-1.5">
                              <span className="font-bold uppercase text-slate-300">{data.monthLabel} 2026</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold border ${data.isProjected ? "bg-brand-500/15 border-brand-400 text-brand-300" : "bg-emerald-500/15 border-emerald-400 text-emerald-300"}`}>
                                {data.isProjected ? "PROJECTION" : "HISTORICAL"}
                              </span>
                            </div>
                            <div className="space-y-0.5 pt-1">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Operating Margin:</span>
                                <span className="font-bold text-white font-mono">{data.margin}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Net Revenue:</span>
                                <span className="font-bold text-white font-mono">${data.revenue}M</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Patient Cases:</span>
                                <span className="font-semibold text-slate-200 font-mono">{data.volume}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Claims Denials:</span>
                                <span className="font-semibold text-amber-300 font-mono">{data.denials}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine 
                    y={8.5} 
                    stroke="#EF4444" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{ value: 'Stewardship Goal', position: 'top', fill: '#EF4444', fontSize: '9px', fontWeight: 'bold' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="margin" 
                    stroke={theme.stroke} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#trendGradient)" 
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.isProjected) {
                        return (
                          <circle cx={cx} cy={cy} r={3} fill="#FFFFFF" stroke={theme.stroke} strokeWidth={1} strokeDasharray="2 2" key={payload.month} />
                        );
                      }
                      return (
                        <circle cx={cx} cy={cy} r={4} fill={theme.stroke} stroke="#FFFFFF" strokeWidth={1.5} key={payload.month} />
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
            
            {/* Takeaways / Insights */}
            <div className="md:col-span-7 bg-slate-50/40 dark:bg-ink-900 p-5 rounded-2xl border border-slate-100 dark:border-white/10 flex gap-4">
              <Sparkles className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">AI Strategy Outlook</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  Our projection models indicate **{serviceLine}** margin will appreciate over Q3, driven by volume recovery and standardizing contract nurse registry pathways. Regional oversight targets should prioritize capping commercial claim denial rates below 2.0% to unlock restricted month-end capital.
                </p>
                <div className="pt-2 text-[10px] text-slate-400 font-medium font-mono">
                  Managed by Senior Lead: <span className="text-slate-600 font-semibold">{currentLead}</span>
                </div>
              </div>
            </div>

            {/* CTAs / Action Hub */}
            <div className="md:col-span-5 bg-brand-50/20 p-5 rounded-2xl border border-brand-100/40 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="block text-xs font-extrabold text-brand-900 uppercase">Audit & Stewardship Actions</span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Variance comments and audits are synchronized to month-end close reports.
                </span>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenAnnotation();
                  }}
                  className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold text-center cursor-pointer transition-colors shadow-3xs flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Annotate Variance Note
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-ink-900 border-t border-slate-100 dark:border-white/10 px-6 py-3 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            CommonSpirit Financial Strategy Suite v1.0
          </span>
          <span>FY26 PROJECTION STREAM ACTIVE</span>
        </div>

      </div>
    </div>
  );
}

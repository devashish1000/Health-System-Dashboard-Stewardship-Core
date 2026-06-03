import React from "react";
import { TrendingUp, TrendingDown, Cpu } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell
} from "recharts";
import { FinanceRecord } from "../data/syntheticFinanceData";
import { calculateKpis, getMonthlyHistory, calculateWaterfallSteps } from "../lib/financeCalculations";
import { formatPercent, formatPoints, formatAxisPercent } from "../lib/formatters";
import { chartTheme, chartMargins } from "../lib/chartTheme";
import { axisTickProps, legendStyle, resolveChartPalette } from "../lib/chartColors";
import { seriesLabels, illustrativeNote } from "../lib/chartSemantics";
import { captionClass, chartSectionTitleClass, dataPrimaryClass } from "../lib/metricColors";
import { useTheme } from "../lib/useTheme";
import ChartTooltip from "../components/charts/ChartTooltip";
import PagePurpose from "../components/PagePurpose";
import PageHeader from "../components/PageHeader";

interface ForecastProps {
  records: FinanceRecord[];
}

const TARGET_OPERATING_MARGIN = 8.5;

function symmetricPercentDomain(values: number[]): [number, number] {
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 0.5);
  return [-maxAbs, maxAbs];
}

export default function Forecast({ records }: ForecastProps) {
  const { theme } = useTheme();
  const chartPalette = resolveChartPalette(theme === "dark");
  const currentKpis = calculateKpis(records);
  const monthlyHistory = getMonthlyHistory(records);
  const waterfallSteps = calculateWaterfallSteps(currentKpis);
  const driverYDomain = symmetricPercentDomain(waterfallSteps.map((s) => s.value));

  const driverContributions = [
    { name: "Labor Cost Ratio Impact", value: formatPoints(-1.4), label: "Registry nursing premiums", status: "unfavorable", icon: TrendingDown },
    { name: "Payer Mix Index Impact", value: formatPoints(-0.7), label: "Medicare elective proportion", status: "unfavorable", icon: TrendingDown },
    { name: "Denial Rates Impact", value: formatPoints(-0.4), label: "Commercial claim pre-auths", status: "unfavorable", icon: TrendingDown },
    { name: "Patient Case Volume", value: formatPoints(0.8), label: "Strong diagnostic CT/MRI referrals", status: "favorable", icon: TrendingUp },
    { name: "Reimbursement AR Timing", value: formatPoints(-0.3), label: "Technical billing backlogs", status: "unfavorable", icon: TrendingDown }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">

      <PageHeader
        title="Forecast & Variance Driver Modeling"
        subtitle="Continuous operating margin projection, variance walk, and driver impact attribution modeling."
        icon={TrendingUp}
        trailing={
          <div className="text-xs font-mono text-muted-surface tabular-nums">
            Last Calibrated: June 2, 2026
          </div>
        }
      />

      <PagePurpose
        title="Why this page matters"
        what="Rolling margin projection plus a margin driver bridge."
        value="Shows leadership exactly what moved the number — and why."
        stat={{ label: "Operating target", value: formatPercent(TARGET_OPERATING_MARGIN) }}
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-ink-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          <div>
            <h3 className={chartSectionTitleClass()}>
              Monthly Margin Shaded Baseline Forecast (%)
            </h3>
            <span className={`text-sm font-semibold block mt-1 tabular-nums ${dataPrimaryClass()}`}>
              Target Operating Margin Alignment ({formatPercent(TARGET_OPERATING_MARGIN)})
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyHistory} margin={chartMargins.compact}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartPalette.grid} />
                <XAxis dataKey="name" {...axisTickProps(chartPalette, 11)} />
                <YAxis
                  domain={["auto", "auto"]}
                  {...axisTickProps(chartPalette, 11)}
                  tickFormatter={formatAxisPercent}
                />
                <Tooltip content={(props) => <ChartTooltip {...props} valueKind="percent" />} />
                <Legend wrapperStyle={legendStyle(chartPalette)} />
                <Line
                  type="monotone"
                  dataKey="targetMargin"
                  name={`Target Floor (${formatPercent(TARGET_OPERATING_MARGIN)})`}
                  stroke={chartTheme.negative}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="actualMargin"
                  name={seriesLabels.actual}
                  stroke={chartTheme.actual}
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="forecastMargin"
                  name={seriesLabels.forecast}
                  stroke={chartTheme.forecast}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-[10px] ${captionClass()}`}>
            Trend reflects continuous historical walk from January through May and maps a 3-month rolling prediction model based on claim velocities.
          </p>
        </div>

        <div className="bg-white dark:bg-ink-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
          <div>
            <h3 className={chartSectionTitleClass()}>
              Margin Driver Bridge (%)
            </h3>
            <span className={`text-sm font-semibold block mt-1 tabular-nums ${dataPrimaryClass()}`}>
              Target {formatPercent(TARGET_OPERATING_MARGIN)} down to Actual {formatPercent(currentKpis.operatingMargin)}
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallSteps} margin={chartMargins.compact}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartPalette.grid} />
                <XAxis dataKey="label" interval={0} {...axisTickProps(chartPalette, 8)} />
                <YAxis
                  domain={driverYDomain}
                  {...axisTickProps(chartPalette, 11)}
                  tickFormatter={formatAxisPercent}
                />
                <Tooltip content={(props) => <ChartTooltip {...props} valueKind="percent" />} />
                <Bar dataKey="value" fill={chartTheme.neutral} radius={[4, 4, 0, 0]}>
                  {waterfallSteps.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={
                        entry.isCumulative
                          ? chartTheme.actual
                          : entry.value >= 0
                            ? chartTheme.positive
                            : chartTheme.negative
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-[10px] ${captionClass()}`}>
            Favorable drivers increment green bars, unfavorable drivers decrease red bars. Cumulative anchors use actual series color. {illustrativeNote}
          </p>
        </div>

      </div>

      <div>
        <h3 className={`${chartSectionTitleClass()} mb-4 block`}>
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
                  <span className={`text-xs font-bold font-mono tabular-nums ${isFavorable ? "text-emerald-600" : "text-rose-600"}`}>
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
              <p className="text-xs text-muted-surface leading-relaxed">
                “Labor cost contributed the largest unfavorable variance, followed by payer mix and reimbursement timing of commercial provider billings.”
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-100 block">Recommended Financial Review</span>
              <p className="text-xs text-muted-surface leading-relaxed">
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

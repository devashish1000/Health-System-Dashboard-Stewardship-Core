import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Landmark, ShieldAlert, BadgeInfo, Eye, HelpCircle,
  Briefcase, Calendar, MapPin, Building, ToggleLeft, Layers, Wallet, Users, Info, Sparkles, Cpu
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { FinanceRecord } from "../data/syntheticFinanceData";
import { ControlTowerFilters } from "../types";
import { calculateKpis, getMonthlyHistory, getServiceLineAggregates } from "../lib/financeCalculations";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../lib/utils";
import ServiceLineTrendModal from "../components/ServiceLineTrendModal";
import KpiTrendModal from "../components/KpiTrendModal";
import PagePurpose from "../components/PagePurpose";

interface DashboardProps {
  records: FinanceRecord[];
  filters: ControlTowerFilters;
  onChangeFilters: (filters: ControlTowerFilters) => void;
  onSelectRow: (record: FinanceRecord) => void;
  onResetFilters: () => void;
}

interface KPIExplanation {
  title: string;
  definition: string;
  performanceText: string;
  driverText: string;
  recommendation: string;
}

const KPI_EXPLAINER_DATA: Record<string, KPIExplanation> = {
  npr: {
    title: "Net Patient Revenue (NPR)",
    definition: "Total collection revenue generated for clinical services rendered, net of insurance contractual adjustments, charity care, administrative discounts, and structural write-offs.",
    performanceText: "Current actual is $48.7M, which is +3.2% ($1.5M) favorable against our budget. Outpatient specialties recovered at a higher-than-expected rate.",
    driverText: "Driven primarily by diagnostic Imaging surges at Lakeside and CHI Immanuel, along with strong elective joint replacements in Orthopedics during the mid-quarter window.",
    recommendation: "Ensure outpatient billing departments clear the scheduling backlog promptly. Allocate additional diagnostic clinic slots to accommodate commercial insurance referrals."
  },
  opex: {
    title: "Operating Expense (OpEx)",
    definition: "All expenses incurred in running clinics and clinical departments, including nursing salaries, clinical supply chains, prosthetic material purchases, and regional logistics.",
    performanceText: "Actual expense is $45.1M, representing an unfavorable variance of +4.8% vs budget. System is placed on tight OpEx watch.",
    driverText: "Unplanned registry contract nurse utilization to address severe clinical nursing vacancies within emergency services and trauma clinics, combined with unnegotiated supply markup for specialized surgical implants.",
    recommendation: "Enforce standard surgical supplier pathways to limit high-cost implant procurement. Mobilize the regional clinical float pool to replace temporary nursing contractors."
  },
  margin: {
    title: "Operating Margin Ratio (%)",
    definition: "A primary metric for nonprofit hospital financial survivability. Calculated as (Net Revenue - Expense) divided by Net Revenue, converted to a percentage.",
    performanceText: "Operating Margin is 7.4%, which sits below our system target of 8.5% by exactly -1.1 percentage points.",
    driverText: "Specialized labor inflation is the primary margin depressant. Our labor ratio rose to 42.6% due to premium registry rates, offsetting the favorable net patient revenue growth.",
    recommendation: "Establish daily nurse staffing management oversight boards. Re-evaluate length-of-stay targets to optimize inpatient bed turnover cycles."
  },
  variance: {
    title: "Budget Variance",
    definition: "The net dollar difference between budgeted margins and actual operating outcomes. Identifies the magnitude of budget deviation.",
    performanceText: "Budget Variance is currently -$1.8M (Unfavorable), placing the system under elevated executive scrutiny.",
    driverText: "Heavy emergency department boarding and high clinical complexity cases that exceeded standard DRG reimbursement baselines.",
    recommendation: "Deploy senior coders to audit underperforming St. Joseph programs. Target and audit high-priority commercial billing denials immediately."
  },
  labor: {
    title: "Labor Cost Ratio",
    definition: "The percentage of net patient revenue consumed by clinical salaries, nurse contract registry, benefits, and registry premium costs.",
    performanceText: "Operating at 42.6%, which is +2.4 percentage points higher than our financial budget baseline of 40.2%.",
    driverText: "Intense local clinical labor shortages, resulting in emergency room registry premium shifts and significant overtime utilization up to 14.2% in some facilities.",
    recommendation: "Review regional float schedules. Offer localized nursing shift incentive packages, which present lower long-term liability than traveling registry contracts."
  },
  forecast: {
    title: "Forecasted Month-End Margin",
    definition: "AI-assisted margin projection for the close of the current fiscal period, utilizing exponential smoothing models grounded in historical collection and denial cycles.",
    performanceText: "Projected month-end operating margin stands at 6.8%, remaining beneath budget expectations (Watchlist status).",
    driverText: "Persistent claims denials backlogs and continued high-premium clinical registry contracts in Mountain and Pacific regions.",
    recommendation: "Accelerate the technical integration of EDI clearance. Deploy audit teams to address commercial payer prior authorization rules."
  }
};

export default function Dashboard({
  records,
  filters,
  onChangeFilters,
  onSelectRow,
  onResetFilters
}: DashboardProps) {
  const kpiCardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
  };

  const [activeExplainKey, setActiveExplainKey] = useState<string | null>(null);
  const [selectedTrendServiceLine, setSelectedTrendServiceLine] = useState<string | null>(null);
  const [selectedKpiTrend, setSelectedKpiTrend] = useState<"npr" | "opex" | "margin" | "variance" | "labor" | "forecast" | null>(null);

  // Compute metrics based on records
  const currentKpis = calculateKpis(records);
  const monthlyHistory = getMonthlyHistory(records);
  const serviceLineAggs = getServiceLineAggregates(records);

  // Lists for unique filter selections
  const uniqueFacilities = Array.from(new Set(records.map(r => r.facility)));
  const uniqueRegions = Array.from(new Set(records.map(r => r.region)));
  const uniqueServiceLines = Array.from(new Set(records.map(r => r.service_line)));
  const uniqueMonths = Array.from(new Set(records.map(r => r.month)));
  const uniqueOwners = Array.from(new Set(records.map(r => r.owner)));

  // Grouped comparative chart data (Budget vs Actual)
  const budgetVsActualData = [
    { name: "Net Rev ($M)", Budget: (currentKpis.netPatientRevenue / 1e6) * 0.97, Actual: currentKpis.netPatientRevenue / 1e6 },
    { name: "Labor Cost ($M)", Budget: (currentKpis.laborCost / 1e6) * 0.94, Actual: currentKpis.laborCost / 1e6 },
    { name: "Supply Cost ($M)", Budget: (currentKpis.supplyCost / 1e6) * 0.96, Actual: currentKpis.supplyCost / 1e6 },
    { name: "Total OpEx ($M)", Budget: (currentKpis.operatingExpense / 1e6) * 0.95, Actual: currentKpis.operatingExpense / 1e6 },
  ];

  // Pie chart Payer Mix Data
  const payerDistribution: Record<string, number> = {};
  records.forEach(r => {
    payerDistribution[r.payer_type] = (payerDistribution[r.payer_type] || 0) + r.net_patient_revenue;
  });
  const pieColors = ["#982f6a", "#38BDF8", "#2DD4BF", "#F59E0B", "#A78BFA"];
  const payerPieData = Object.entries(payerDistribution).map(([name, val]) => ({
    name,
    value: Math.round(val / 1000)
  }));

  // Volume-to-Revenue Bridge data (Waterfall simulation for chart display)
  const revenueBridgeData = [
    { stage: "Budgeted Rev", value: 47200, cumulative: 47200 },
    { stage: "Volume Shift", value: 1200, cumulative: 48400 },
    { stage: "Payer Mix", value: -400, cumulative: 48000 },
    { stage: "Denials Penalty", value: -250, cumulative: 47750 },
    { stage: "Timing AR", value: 950, cumulative: 48700 },
    { stage: "Actual Rev", value: 48700, cumulative: 48700 }
  ];

  const handleFilterChange = (key: keyof ControlTowerFilters, val: string) => {
    onChangeFilters({
      ...filters,
      [key]: val
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Favorable":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Watchlist":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Unfavorable":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* 8-Filter Stewardship Control Deck */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            <h2 className="text-sm font-bold text-ink-900 dark:text-slate-100 uppercase tracking-wide">
              Stewardship Filter Control Deck
            </h2>
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Facility Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Facility
            </label>
            <select
              value={filters.facility}
              onChange={(e) => handleFilterChange("facility", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Facilities</option>
              {uniqueFacilities.filter(Boolean).map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Region
            </label>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Regions</option>
              {uniqueRegions.filter(Boolean).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Service Line Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Service Line
            </label>
            <select
              value={filters.serviceLine}
              onChange={(e) => handleFilterChange("serviceLine", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Service Lines</option>
              {uniqueServiceLines.filter(Boolean).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Month
            </label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Months</option>
              {uniqueMonths.filter(Boolean).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Payer Type Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Primary Payer
            </label>
            <select
              value={filters.payerType}
              onChange={(e) => handleFilterChange("payerType", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Payers</option>
              <option value="Commercial">Commercial</option>
              <option value="Medicare">Medicare</option>
              <option value="Medicaid">Medicaid</option>
              <option value="Self-Pay">Self-Pay</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Review Status Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <ToggleLeft className="w-3.5 h-3.5" /> Review Status
            </label>
            <select
              value={filters.reviewStatus}
              onChange={(e) => handleFilterChange("reviewStatus", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Review Statuses</option>
              <option value="New">New</option>
              <option value="Analyst Review">Analyst Review</option>
              <option value="Director Review">Director Review</option>
              <option value="Executive Ready">Executive Ready</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Finance Lead
            </label>
            <select
              value={filters.owner}
              onChange={(e) => handleFilterChange("owner", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Leads</option>
              {uniqueOwners.filter(Boolean).map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Variance Status Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> Performance Status
            </label>
            <select
              value={filters.varianceStatus}
              onChange={(e) => handleFilterChange("varianceStatus", e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-hidden font-medium"
            >
              <option value="">All Statuses</option>
              <option value="Favorable">Favorable</option>
              <option value="Watchlist">Watchlist</option>
              <option value="Unfavorable">Unfavorable</option>
            </select>
          </div>
        </div>
      </div>

      <PagePurpose
        title="Why this page matters"
        what="Filterable KPIs, budget-vs-actual, and margin trends across every facility."
        value="Replaces static month-end decks with live, drill-down financials."
        stat={{ label: "Facilities tracked", value: "37 records" }}
        icon={Layers}
      />

      {/* If records array is empty (due to over-aggressive filtering), render empty state */}
      {records.length === 0 ? (
        <EmptyState onReset={onResetFilters} />
      ) : (
        <>
          {/* Main KPIs Row */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-6 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.07 } }
            }}
          >

            {/* KPI 1 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("npr")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-brand-500 transition-colors">
                  Net Patient Revenue
                </span>
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 mt-1 block">
                  {formatCurrency(currentKpis.netPatientRevenue)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                  +3.2% vs budget
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("npr");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> Explain
                </button>
              </div>
            </motion.div>

            {/* KPI 2 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("opex")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-amber-500 transition-colors">
                  Operating Expense
                </span>
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 mt-1 block">
                  {formatCurrency(currentKpis.operatingExpense)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                  +4.8% vs budget
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("opex");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Explain
                </button>
              </div>
            </motion.div>

            {/* KPI 3 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("margin")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-emerald-500 transition-colors">
                  Operating Margin
                </span>
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 mt-1 block">
                  {currentKpis.operatingMargin}%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                  -1.1 pts target
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("margin");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Explain
                </button>
              </div>
            </motion.div>

            {/* KPI 4 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("variance")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-rose-500 transition-colors">
                  Budget Variance
                </span>
                <span className={`text-xl font-bold font-sans mt-1 block ${currentKpis.budgetVariance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {currentKpis.budgetVariance >= 0 ? "+" : ""}{(currentKpis.budgetVariance / 1e6).toFixed(1)}M
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm">
                  High Priority
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("variance");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Explain
                </button>
              </div>
            </motion.div>

            {/* KPI 5 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("labor")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-purple-500 transition-colors">
                  Labor Cost Ratio
                </span>
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 mt-1 block">
                  {currentKpis.netPatientRevenue > 0 ? ((currentKpis.laborCost / currentKpis.netPatientRevenue) * 100).toFixed(1) + "%" : "0%"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                  +2.4 pts budget
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("labor");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" /> Explain
                </button>
              </div>
            </motion.div>

            {/* KPI 6 */}
            <motion.div
              variants={kpiCardVariants}
              onClick={() => setSelectedKpiTrend("forecast")}
              className="bg-white dark:bg-ink-800 rounded-2xl p-4 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200 transition-all duration-300 relative flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block group-hover:text-cyan-500 transition-colors">
                  Month-End Forecast
                </span>
                <span className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100 mt-1 block">
                  {currentKpis.forecastedMargin}%
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-50 dark:border-white/10 pt-2.5">
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                  Below target
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveExplainKey("forecast");
                  }}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
                >
                  <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> Explain
                </button>
              </div>
            </motion.div>

          </motion.div>

          {/* Interactive KPI Intelligence Drawer (Render in-line when active) */}
          {activeExplainKey && KPI_EXPLAINER_DATA[activeExplainKey] && (
            <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-sky-100 relative shadow-xs animate-fade-in flex flex-col sm:flex-row gap-4 items-start">
              <div className="p-3 bg-white rounded-xl text-sky-600 shrink-0 shadow-xs border border-sky-100">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2 flex-grow">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>AI Driver Explanation: {KPI_EXPLAINER_DATA[activeExplainKey].title}</span>
                  <span className="text-[10px] bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full font-bold">Interactive Copilot</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Concept:</strong> {KPI_EXPLAINER_DATA[activeExplainKey].definition}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Primary Deviation Drivers</span>
                    <p className="text-slate-600 leading-relaxed">{KPI_EXPLAINER_DATA[activeExplainKey].driverText}</p>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-700 block mb-0.5">Recommended Stewardship Focus</span>
                    <p className="text-slate-600 leading-relaxed">{KPI_EXPLAINER_DATA[activeExplainKey].recommendation}</p>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 italic pt-2 border-t border-slate-200/50">
                  Disclaimer: This explanation showcases decision-support simulation design using fully synthetic performance baselines.
                </p>
              </div>
              <button
                onClick={() => setActiveExplainKey(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* Dashboard Charts - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart A: Budget vs Actual Variance */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Budget vs Actual Variance ($ Millions)
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">By Key Driver Categories</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                    <YAxis fontSize={11} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Actual" fill="#982f6a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart B: Monthly Margin Target vs Actual vs Forecast */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Operating Margin Ratio (%) and Forecast
                </h3>
                <span className="text-[10px] px-2 py-0.5 font-bold rounded-sm bg-brand-50 text-brand-700">8.5% Target Baseline</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                    <YAxis domain={[0, 18]} fontSize={11} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="actualMargin" name="Historical Margin %" stroke="#2DD4BF" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="targetMargin" name="Budget Target" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="forecastMargin" name="Margin Forecast %" stroke="#A78BFA" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Dashboard Charts - Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Chart D: Volume-to-Revenue Bridge */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  NPR Change Volume-to-Revenue Bridge ($ Thousand)
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">Waterfall Drivers Walk</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueBridgeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="stage" fontSize={10} stroke="#94a3b8" />
                    <YAxis domain={[40000, 50000]} fontSize={10} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="cumulative" name="Cumulative Value" fill="#38BDF8">
                      {revenueBridgeData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.value >= 0 ? "#982f6a" : "#EF4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart G: Payer Mix Distribution Donut */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Primary Payer Mix NPR Distribution ($K)
                </h3>
                <span className="text-[10px] text-slate-500 font-medium">Direct Claims Allocation</span>
              </div>
              <div className="h-64 flex flex-col sm:flex-row items-center justify-around gap-2">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={payerPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {payerPieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}K`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 text-xs">
                  {payerPieData.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                      <span className="text-slate-500">{entry.name}:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">${entry.value.toLocaleString()}K</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Month-End Close Summary Narrative Panel & Labor Trend Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Panel H: Month-End Close Narrative Summary */}
            <div className="col-span-1 md:col-span-2 bg-ink-900 border border-ink-800 text-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-ink-800 pb-3">
                <BadgeInfo className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-sm text-brand-300 uppercase tracking-wider">
                  Analyst Observation: Month-End Close Narrative
                </h3>
              </div>
              <div className="text-xs leading-relaxed space-y-3">
                <p>
                  Our healthcare system demonstrated strong outpatient collection recovery overall, leading to net patient revenue of <strong>{formatCurrency(currentKpis.netPatientRevenue)}</strong> (+3.2% vs budget). Elective Orthopedics volume was a principal contributor, accelerating throughout the Mountain portion.
                </p>
                <p>
                  However, actual operating margins finished at <strong>7.4%</strong> vs the 8.5% target. This compression is heavily linked to clinical labor cost pressures, where contract registry premium nursing accounted for <strong>-$1.2M</strong> of budget variance owing to emergency department boarding surges.
                </p>
                <p>
                  <strong>Stewardship Key Recommendation:</strong> Review St. Joseph prior authorization denial workflows immediately to address the Cardiology <strong>6.2% denial spike</strong>. Transition underutilized shift templates down to localized incentive schedules to lower registry liability.
                </p>
              </div>
              <div className="pt-3 border-t border-sky-400/20 flex justify-between items-center text-[10px] text-slate-300 font-mono">
                <span>Forecast Confidence Level: High (±0.4%)</span>
                <span>System Health Index: Stable</span>
              </div>
            </div>

            {/* Weekly Labor Ratio Trend Card */}
            <div className="bg-white dark:bg-ink-800 rounded-2xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Labor cost vs Target Trend
                </h3>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">System Weekly Labor Cost Ratio %</span>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  Labor ratio average registered at 42.6%, exceeding the safe maximum threshold limit of 40%.
                </p>
              </div>
              <div className="h-28 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyHistory} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" fontSize={9} />
                    <YAxis domain={[35, 45]} fontSize={9} />
                    <Tooltip />
                    <Area type="monotone" dataKey="actualMargin" stroke="#FEF3C7" fill="#FEF3C7" opacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-center font-bold text-rose-500 bg-rose-50 p-2 rounded-xl border border-rose-100">
                Action Watchlist: Heavy Registry Reliance
              </div>
            </div>

          </div>

          {/* Table of Service Lines Performance Matrix - Click Row to Open */}
          <div className="bg-white dark:bg-ink-800 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
                  Service Line Performance Audit Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Select and click any Service Line row to annotate variance findings, reassign workflows, or adjust status.
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                {serviceLineAggs.length} Services Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table id="service-line-performance-table" className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-3 px-4">Service Line</th>
                    <th className="py-3 px-4 text-right">Net Patient Revenue</th>
                    <th className="py-3 px-4 text-right">Operating Expense</th>
                    <th className="py-3 px-4 text-right">Margin %</th>
                    <th className="py-3 px-4 text-right">Var Actual vs Budget</th>
                    <th className="py-3 px-4">Finance Lead</th>
                    <th className="py-3 px-4">Review Status</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {serviceLineAggs.map((agg) => {
                    const rowRecord = records.find(r => r.service_line === agg.serviceLine);
                    const rowId = `row-${agg.serviceLine.toLowerCase().replace(/\s+/g, "-")}`;

                    return (
                      <tr
                        key={agg.serviceLine}
                        id={rowId}
                        title={`Click row to view 12-month margin trend for ${agg.serviceLine}`}
                        onClick={() => {
                          setSelectedTrendServiceLine(agg.serviceLine);
                        }}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-bold text-ink-900 dark:text-slate-100 group-hover:text-brand-600 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span>{agg.serviceLine}</span>
                            <TrendingUp className="w-3.5 h-3.5 text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-700">{formatCurrency(agg.netRevenue)}</td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-500">{formatCurrency(agg.operatingExpense)}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-semibold">
                          <span className={agg.operatingMargin >= 8 ? "text-emerald-600" : (agg.operatingMargin < 1 ? "text-rose-600" : "text-slate-700")}>
                            {agg.operatingMargin.toFixed(1)}%
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${agg.budgetVariance >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {agg.budgetVariance >= 0 ? "+" : ""}{(agg.budgetVariance / 1000).toFixed(0)}K
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">{agg.owner}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-semibold bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full">
                            {agg.reviewStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-bold border ${getStatusColor(agg.status)}`}>
                            {agg.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (rowRecord) onSelectRow(rowRecord);
                            }}
                            className="text-slate-400 hover:text-sky-600 transition-colors cursor-pointer p-1"
                          >
                            <Eye className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedTrendServiceLine && (
        <ServiceLineTrendModal
          isOpen={!!selectedTrendServiceLine}
          onClose={() => setSelectedTrendServiceLine(null)}
          serviceLine={selectedTrendServiceLine}
          records={records}
          onOpenAnnotation={() => {
            const match = records.find(r => r.service_line === selectedTrendServiceLine);
            if (match) onSelectRow(match);
          }}
        />
      )}

      {selectedKpiTrend && (
        <KpiTrendModal
          isOpen={!!selectedKpiTrend}
          onClose={() => setSelectedKpiTrend(null)}
          kpiType={selectedKpiTrend}
          records={records}
        />
      )}

    </div>
  );
}

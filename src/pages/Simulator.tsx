import React, { useState } from "react";
import {
  Sliders, TrendingUp, HelpCircle, Activity, Landmark, ShieldCheck,
  Percent, Sparkles, RefreshCw, AlertCircle, Heart, DollarSign, Calendar,
  CheckCircle
} from "lucide-react";
import { calculateKpis } from "../lib/financeCalculations";
import { FinanceRecord } from "../data/syntheticFinanceData";
import {
  formatCurrency,
  formatPercent,
  formatPoints,
  formatVarianceCurrency,
  formatCount,
} from "../lib/formatters";
import PagePurpose from "../components/PagePurpose";

interface SimulatorProps {
  records: FinanceRecord[];
  onChecklistTrigger?: () => void;
  onTriggerToast?: (msg: string, type: "success" | "info" | "warning") => void;
}

const TARGET_MARGIN = 8.5;

export default function Simulator({ records, onChecklistTrigger, onTriggerToast }: SimulatorProps) {
  const currentKpis = calculateKpis(records);

  // Core Slider variables
  const [laborImprovement, setLaborImprovement] = useState(0); // 0 to 10%
  const [denialReduction, setDenialReduction] = useState(0);   // 0 to 5%
  const [volumeIncrease, setVolumeIncrease] = useState(0);     // -5% to +15%
  const [payerMixImprovement, setPayerMixImprovement] = useState(0); // 0 to 10%
  const [reimbursementReduction, setReimbursementReduction] = useState(0); // 0 to 20 days

  // Baseline variables from synthetic dataset
  const baseMargin = 7.4;
  const baseNpr = 48700000;
  const baseVariance = -1800000;

  // Track event changes
  const handleSliderChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    if (onChecklistTrigger) {
      onChecklistTrigger();
    }
  };

  // Calculators using deterministic formulas to demonstrate directional shifts:
  // 1. Labor cost savings: Labor is roughly 42.6% of NPR or $20.7M. Improving efficiency by laborImprovement% recovers money.
  const laborSavings = (baseNpr * 0.426) * (laborImprovement / 100);

  // 2. Denial recovery: Denials are around 3.8% of NPR. Reducing denial rate immediately converts locked claims to active collection.
  const denialRecovery = baseNpr * (denialReduction / 100) * 0.8;

  // 3. Volume impact: Clinic NPR increases by volumeIncrease% (at roughly 65% contribution margin due to variable clinical costs)
  const volumeImpactRevenue = baseNpr * (volumeIncrease / 100);
  const volumeImpactContribution = volumeImpactRevenue * 0.65;

  // 4. Payer mix shift: Shifting medicare to commercial improves blended pricing index.
  const payerMixImpact = baseNpr * (payerMixImprovement / 100) * 0.4;

  // 5. AR cash flow buffer from reimbursement reduction: reduces cash float latency. Simulated as interest or cycle variance.
  const arInterestBuffer = (baseNpr * (reimbursementReduction / 365) * 0.05);

  // Cumulative outcomes
  const totalFinancialRecovery = laborSavings + denialRecovery + volumeImpactContribution + payerMixImpact + arInterestBuffer;
  const simulatedNpr = baseNpr + volumeImpactRevenue + (payerMixImpact * 0.4);
  const simulatedVariance = baseVariance + totalFinancialRecovery;
  
  // Simulated Operating Margin %
  const simulatedMargin = parseFloat((((simulatedNpr - (simulatedNpr * (1 - (baseMargin / 100)) - laborSavings)) / simulatedNpr) * 100).toFixed(2));
  const forecastedMargin = parseFloat((simulatedMargin * 0.95).toFixed(2));

  // Determine service line risk indicator
  const totalDriversSimulatedSum = laborImprovement + denialReduction + volumeIncrease + payerMixImprovement + reimbursementReduction;
  const riskStatus = totalDriversSimulatedSum > 20 
    ? "Low Risk Portfolio" 
    : (totalDriversSimulatedSum > 8 ? "Moderate Support" : "Elevated Strain Watchlist");

  const handleResetSimulator = () => {
    setLaborImprovement(0);
    setDenialReduction(0);
    setVolumeIncrease(0);
    setPayerMixImprovement(0);
    setReimbursementReduction(0);
    if (onTriggerToast) {
      onTriggerToast("Simulation sliders reset to historic clinical levels.", "info");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-slate-800 dark:text-slate-100">
            Strategic Scenario Simulator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hypothetical sensitivity analysis modeling. Pivot operations variables dynamically to project operating margin recoverability.
          </p>
        </div>
        
        <button
          onClick={handleResetSimulator}
          className="px-3 py-1.5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset Variables
        </button>
      </div>

      <PagePurpose
        title="Why this page matters"
        what="Pull levers — labor, denials, volume — and watch margin react live."
        value="Pressure-test decisions before committing real budget."
        stat={{ label: "Live levers", value: formatCount(5) }}
        icon={Sliders}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Sliders Deck Area (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-ink-800 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 dark:border-white/10 pb-3">
            <Sliders className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm uppercase tracking-wider">
              Sensitivity Operations Variables
            </h3>
          </div>

          <div className="space-y-6">
            {/* Slider 1: Labor Efficiency */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100">Improve Labor Cost Efficiency</span>
                <span className="font-mono tabular-nums text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-sm">
                  {formatPercent(laborImprovement, { signed: true })} savings
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={laborImprovement}
                onChange={(e) => handleSliderChange(setLaborImprovement, parseFloat(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-100 dark:bg-ink-900 rounded-lg cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Baseline Allocation</span>
                <span>Optimized Staffing Scheduling Limit (10%)</span>
              </div>
            </div>

            {/* Slider 2: Denial reduction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100">Reduce Claims Denial Rate</span>
                <span className="font-mono tabular-nums text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-sm">
                  -{formatPercent(denialReduction)} reduction
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.25"
                value={denialReduction}
                onChange={(e) => handleSliderChange(setDenialReduction, parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-100 dark:bg-ink-900 rounded-lg cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Current Denial Index (3.8%)</span>
                <span>Claim Error Prevention Limit (-5%)</span>
              </div>
            </div>

            {/* Slider 3: Patient volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100">Increase Patient Volume (Case Growth)</span>
                <span className="font-mono tabular-nums text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                  {formatPercent(volumeIncrease, { signed: true })} case delta
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="15"
                step="1"
                value={volumeIncrease}
                onChange={(e) => handleSliderChange(setVolumeIncrease, parseInt(e.target.value))}
                className="w-full accent-emerald-600 h-1.5 bg-slate-100 dark:bg-ink-900 rounded-lg cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Winter Retraction (-5%)</span>
                <span>Service Capacity Threshold (15%)</span>
              </div>
            </div>

            {/* Slider 4: Payer Mix Improvement */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100">Improve Blended Commercial Payer Mix</span>
                <span className="font-mono tabular-nums text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-sm">
                  {formatPercent(payerMixImprovement, { signed: true })} commercial proportion
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={payerMixImprovement}
                onChange={(e) => handleSliderChange(setPayerMixImprovement, parseFloat(e.target.value))}
                className="w-full accent-sky-600 h-1.5 bg-slate-100 dark:bg-ink-900 rounded-lg cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Baseline government payer standard</span>
                <span>Referral optimization benchmark Limit (10%)</span>
              </div>
            </div>

            {/* Slider 5: Reimbursement Delay Days */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-100">Reduce Payment Reimbursement Latency</span>
                <span className="font-mono tabular-nums text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-sm">
                  -{formatCount(reimbursementReduction)} Days AR delay
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={reimbursementReduction}
                onChange={(e) => handleSliderChange(setReimbursementReduction, parseInt(e.target.value))}
                className="w-full accent-brand-600 h-1.5 bg-slate-100 dark:bg-ink-900 rounded-lg cursor-ew-resize"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Baseline payment duration (49 AR days)</span>
                <span>Integrated clearance acceleration Limit (-20 days)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Outputs Cards (1 col) */}
        <div className="space-y-6">
          <div className="bg-ink-900 border border-slate-800 text-white rounded-3xl p-6 shadow-lg space-y-4">

            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Landmark className="w-5 h-5 text-brand-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-300">
                Simulated Stewardship Impact
              </h3>
            </div>

            {/* Projected Margin Card */}
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">OPERATING MARGIN MODELING & HEALTH GAPS</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white font-mono tabular-nums">{formatPercent(simulatedMargin)}</span>
                <span className="text-xs text-brand-400 font-bold font-mono tabular-nums">
                  ({formatPoints(simulatedMargin - baseMargin, 2)})
                </span>
              </div>
              
              {/* Dynamic comparison progress bar with target thresholds */}
              <div className="space-y-2 mt-4 pt-3 border-t border-slate-800">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Target Thresholds</span>
                  <span>Margins</span>
                </div>
                
                {/* Target Gap 1: CommonSpirit board requirement (8.5%) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 uppercase tracking-wide">CommonSpirit Goal ({formatPercent(TARGET_MARGIN, { decimals: 2 })})</span>
                    <span className={`font-mono tabular-nums font-bold ${simulatedMargin >= TARGET_MARGIN ? "text-emerald-400" : "text-amber-400"}`}>
                      {simulatedMargin >= TARGET_MARGIN 
                        ? `SURPASSED (${formatPoints(simulatedMargin - TARGET_MARGIN, 2)})` 
                        : `SHORTFALL (${formatPoints(TARGET_MARGIN - simulatedMargin, 2)} gap)`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${simulatedMargin >= TARGET_MARGIN ? "bg-emerald-400" : "bg-amber-400"}`}
                      style={{ width: `${Math.min(100, (simulatedMargin / TARGET_MARGIN) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Target Gap 2: System Historic Baseline (7.4%) */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 uppercase tracking-wide">Historic Baseline ({formatPercent(baseMargin, { decimals: 2 })})</span>
                    <span className={`font-mono tabular-nums font-bold ${simulatedMargin >= baseMargin ? "text-emerald-400" : "text-rose-400"}`}>
                      {simulatedMargin >= baseMargin 
                        ? `EXCEEDED (${formatPoints(simulatedMargin - baseMargin, 2)})` 
                        : `DEPRECIATED (${formatPoints(simulatedMargin - baseMargin, 2)} below)`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${simulatedMargin >= baseMargin ? "bg-brand-400" : "bg-rose-400"}`}
                      style={{ width: `${Math.min(100, (simulatedMargin / baseMargin) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>
              <p className="text-[10.5px] text-slate-300 mt-3 flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <AlertCircle className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Safe target achieved: {simulatedMargin >= TARGET_MARGIN ? `Yes (${formatPercent(TARGET_MARGIN, { decimals: 1 })} margin cleared)` : "No (requires further optimizations)"}</span>
              </p>
            </div>

            {/* Total Recovered Capital Card */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block">Budget Variance Recovery</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-emerald-400 font-mono tabular-nums">{formatVarianceCurrency(totalFinancialRecovery)}</span>
              </div>
              <p className="text-[10px] text-slate-300">Net recovered operating capital</p>
            </div>

            {/* Simulated NPR */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-300 block">Simulated Net Revenue</span>
                <span className="text-sm font-bold font-mono tabular-nums mt-0.5 block">
                  {formatCurrency(simulatedNpr)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-300 block">System Risk index</span>
                <span className="text-xs font-bold text-emerald-300 mt-1 block">
                  {riskStatus}
                </span>
              </div>
            </div>

            {/* Month End Target Forecast */}
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-semibold text-brand-300">
              <span>Projected Close Level:</span>
              <span className="font-mono tabular-nums">{formatPercent(forecastedMargin)} Margin</span>
            </div>
          </div>

          {/* Simulated Disclaimer Node Required by user request */}
          <div className="bg-slate-50 dark:bg-ink-900 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed shadow-3xs">
            <span className="font-bold text-slate-700 dark:text-slate-100 block mb-1">Stewardship Note</span>
            “Simulation uses synthetic assumptions to demonstrate decision-support logic. Results are directional only and require validation against real finance and operational data.”
          </div>

        </div>

      </div>

    </div>
  );
}

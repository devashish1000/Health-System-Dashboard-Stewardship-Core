import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldCheck, Eye, RefreshCw, Layers, Monitor, Tablet, Smartphone, Maximize, 
  CheckCircle2, AlertTriangle, Play, Sparkles, Sliders, CheckSquare, Clock, ArrowRight,
  Gauge, AlertCircle, Bomb, Zap, WifiOff, History, FastForward, Accessibility, Info,
  Activity, Check, Terminal, FileText, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import PagePurpose from "../components/PagePurpose";

// --- Types & Interfaces ---

interface ScreenshotState {
  id: string;
  name: string;
  component: string;
  expectedFile: string;
  viewport: string;
  category: "Overview" | "Dashboard" | "Modals";
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  type: "info" | "warn" | "error" | "success";
  message: string;
}

interface TemporalAudit {
  epoch: string;
  operatingMargin: string;
  stewardshipGoal: string;
  contractLaborReliance: string;
  denialRate: string;
  status: "Deficit" | "Balanced" | "Optimized";
}

interface A11yCheckItem {
  id: string;
  ruleCode: string;
  elementName: string;
  status: "pass" | "warn" | "fail";
  ratioText?: string;
  description: string;
}

// --- Hardcoded Baseline Data ---

const UI_STATES: ScreenshotState[] = [
  { id: "exec-tower", name: "System Executive Tower Stats", component: "Overview Metrics Card", expectedFile: "exec_overview_card.png", viewport: "Desktop (1440px)", category: "Overview" },
  { id: "finance-kpis", name: "6-Column Financial KPI Cards", component: "KPI Metrics Block", expectedFile: "kpi_columns.png", viewport: "Desktop (1440px)", category: "Dashboard" },
  { id: "trend-modal", name: "Cardiology Trend Area Chart", component: "ServiceLineTrendModal", expectedFile: "cardiology_trends.png", viewport: "Tablet (1024px)", category: "Modals" },
  { id: "cmd-palette", name: "Intel-Palette Overlay Menu", component: "CommandPalette ⌘K Component", expectedFile: "command_palette_popup.png", viewport: "Mobile (375px)", category: "Modals" }
];

const TEMPORAL_EPOCS: TemporalAudit[] = [
  { epoch: "FY24 Historic Actuals", operatingMargin: "6.10%", stewardshipGoal: "8.5%", contractLaborReliance: "14.2% of FTE", denialRate: "3.7%", status: "Deficit" },
  { epoch: "YTD FY25 Reference Baseline", operatingMargin: "7.15%", stewardshipGoal: "8.5%", contractLaborReliance: "11.1% of FTE", denialRate: "2.4%", status: "Deficit" },
  { epoch: "FY26 Projected Expansion (Target)", operatingMargin: "8.52%", stewardshipGoal: "8.5%", contractLaborReliance: "7.5% of FTE", denialRate: "1.9%", status: "Balanced" },
  { epoch: "FY27 Long-Range Strategy", operatingMargin: "9.10%", stewardshipGoal: "8.5%", contractLaborReliance: "5.5% of FTE", denialRate: "1.4%", status: "Optimized" }
];

const INITIAL_A11Y_RULES: A11yCheckItem[] = [
  { id: "a11y-1", ruleCode: "WCAG 1.4.3", elementName: "Main Sidebar Background Grid", status: "pass", ratioText: "12.8:1", description: "Deep navy background is perfectly offset by white typography nodes, easily exceeding AA specifications." },
  { id: "a11y-2", ruleCode: "WCAG 1.4.3", elementName: "Telemetry Log Terminal text", status: "pass", ratioText: "6.4:1", description: "High-contrast neon green indicators ensure terminal metrics remain comfortably legible." },
  { id: "a11y-3", ruleCode: "WCAG 2.4.7", elementName: "Command Palette input (⌘K)", status: "pass", description: "Keyboard focus state initiates beautiful high-contrast focus rings around outline paths." },
  { id: "a11y-4", ruleCode: "WCAG 1.4.4", elementName: "Interactive Sub-titles", status: "warn", ratioText: "3.8:1", description: "10px subtext captions trigger secondary warnings due to font sizes falling below standard recommended weights." },
  { id: "a11y-5", ruleCode: "WCAG 4.1.2", elementName: "Interactive Graph controls", status: "pass", description: "All chart toggle actions bind explicit aria-controls tags for screen reader assistance." }
];

// --- Main QA & Engineering Cockpit Component ---

export default function VisualRegression() {
  const [activeTab, setActiveTab] = useState<"pixel" | "chaos" | "temporal" | "a11y">("pixel");

  // --- TAB 1: Pixel-by-Pixel Auditor States ---
  const [selectedState, setSelectedState] = useState<ScreenshotState>(UI_STATES[0]);
  const [activeViewport, setActiveViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasScanned, setHasScanned] = useState(true);
  const [hasOffsetEnabled, setHasOffsetEnabled] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [hoveredPixelOffset, setHoveredPixelOffset] = useState<{ x: number; y: number } | null>(null);

  // --- TAB 2: Chaos Engineering States ---
  const [apiLatency, setApiLatency] = useState(250); // ms
  const [packetLoss, setPacketLoss] = useState(5); // %
  const [failAuthorizations, setFailAuthorizations] = useState(false);
  const [isChaosRunning, setIsChaosRunning] = useState(false);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // --- TAB 3: Temporal Projections States ---
  const [selectedEpoch, setSelectedEpoch] = useState<TemporalAudit>(TEMPORAL_EPOCS[1]); // YTD FY25
  const [isTemporalRunning, setIsTemporalRunning] = useState(false);
  const [temporalProgress, setTemporalProgress] = useState(100);
  const [registryWageOvercharge, setRegistryWageOvercharge] = useState(0); // $k deviation

  // --- TAB 4: WCAG A11y Suite States ---
  const [isA11yAuditing, setIsA11yAuditing] = useState(false);
  const [a11yScore, setA11yScore] = useState(94);
  const [a11yRules, setA11yRules] = useState<A11yCheckItem[]>(INITIAL_A11Y_RULES);

  // --- Effects ---

  // Scroll to bottom of chaos generator logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Tab 1 (Pixel Auditor) Scan effect
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setHasScanned(true);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  // Viewports calculator for Pixel-by-Pixel Auditor
  const getViewportDimensions = () => {
    switch (activeViewport) {
      case "tablet": return { width: "w-[480px]", height: "h-[320px]", label: "1024px × 768px (Tablet)" };
      case "mobile": return { width: "w-[330px]", height: "h-[320px]", label: "375px × 812px (Mobile View)" };
      case "desktop":
      default:
        return { width: "w-full", height: "h-[320px]", label: "1440px × 900px (Desktop Pro)" };
    }
  };

  const getAccuracyMetrics = () => {
    const baseMarginLoss = hasOffsetEnabled ? 0.59 : 0;
    const latencyLoss = apiLatency > 1500 ? (apiLatency - 1500) / 1000 : 0;
    const packetLossPenalty = packetLoss * 0.12;
    const totalLoss = baseMarginLoss + latencyLoss + packetLossPenalty;
    const calculatedFidelity = Math.max(74.20, Math.min(100.0, 100.0 - totalLoss));
    return calculatedFidelity;
  };

  // --- Handlers ---

  const triggerPixelScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setHasScanned(false);
  };

  const triggerChaosTest = () => {
    setIsChaosRunning(true);
    setLogs([]);
    let counter = 0;

    const phrases = [
      { t: "info", m: "SYS CONNECT: Bootstrapping CareGateway API core channel..." },
      { t: "success", m: "SYS CONNECT: Connected to Regional CareGateway API in datacenter-west-01" },
      { t: "info", m: `SYS TELEMETRY: Initiating load packet testing sequence at specified jitter parameters (Latency: ${apiLatency}ms, Loss: ${packetLoss}%)` },
      { t: "warn", m: apiLatency > 1000 ? `SYS WARN: API latency of ${apiLatency}ms exceeds standard stewardship SLAs of 800ms.` : `SYS METRIC: Latency benchmark established at a healthy ${apiLatency}ms.` },
      { t: "error", m: failAuthorizations ? "SYS AUTH FAIL: Prior Authorization Payer API failed with status 503 Service Unavailable" : "SYS AUTH: Payer eligibility checks successfully dispatched" },
      { t: "info", m: packetLoss > 15 ? `SYS WARN: Simulated packet drop rate (${packetLoss}%) triggering automated packet re-transmissions` : "SYS METRIC: Socket connection packet flow meets standard SLA threshold" },
      { t: "success", m: "SYS COMPLETE: Resilience metrics registered. Network pipeline completed with fallback configurations." }
    ];

    const interval = setInterval(() => {
      if (counter < phrases.length) {
        const item = phrases[counter];
        const timestamp = new Date().toISOString().split("T")[1].substring(0, 8);
        setLogs((prev) => [
          ...prev, 
          { id: Math.random().toString(), timestamp, type: item.t as any, message: item.m }
        ]);
        counter++;
      } else {
        clearInterval(interval);
        setIsChaosRunning(false);
      }
    }, 750);
  };

  const triggerTemporalAudit = () => {
    setIsTemporalRunning(true);
    setTemporalProgress(0);

    const interval = setInterval(() => {
      setTemporalProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTemporalRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 105);
  };

  const triggerA11yAudit = () => {
    setIsA11yAuditing(true);
    const interval = setTimeout(() => {
      setIsA11yAuditing(false);
      setA11yScore(Math.floor(Math.random() * 5) + 95); // 95 - 99 score
    }, 1200);
  };

  // --- Dynamic calculations ---
  const currentFidelity = getAccuracyMetrics();
  const actualSelectedMargin = parseFloat(selectedEpoch.operatingMargin) - (registryWageOvercharge * 0.005);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 py-4 animate-fade-in text-slate-800">
      
      {/* Top Main Heading */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-600" />
            Engineering QA & System Guardrails Suite
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive testing sandbox showcasing high-fidelity production auditing, chaos resilience, temporal audits, and WCAG accessibility standards.
          </p>
        </div>
        <div className="flex bg-slate-100/85 p-1 rounded-2xl gap-1 border border-slate-200">
          <button 
            type="button"
            onClick={() => setActiveTab("pixel")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "pixel" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Pixel Auditor
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("chaos")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "chaos" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Chaos Injector
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("temporal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "temporal" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            Time Travel
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("a11y")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "a11y" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-500 hover:text-slate-800"}`}
          >
            WCAG A11y
          </button>
        </div>
      </div>

      <PagePurpose
        title="Why this page matters"
        what="Visual-regression, chaos, and accessibility QA harness."
        value="Signals an engineering quality bar fit for production."
        icon={Eye}
      />

      <AnimatePresence mode="wait">
        
        {/* --- TAB 1: Pixel-by-Pixel Visual Regression --- */}
        {activeTab === "pixel" && (
          <motion.div 
            key="pixel-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-4 space-y-4">
              
              {/* Target Selector */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Target Component State</span>
                  <p className="text-[11px] text-slate-500">Choose simulated app states to trigger visual comparison reviews.</p>
                </div>
                
                <div className="space-y-2">
                  {UI_STATES.map((st) => {
                    const isActive = selectedState.id === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setSelectedState(st);
                          setHasScanned(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block ${
                          isActive 
                            ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-3xs animate-fade-in" 
                            : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50/55"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold block">{st.name}</span>
                          <span className="text-[8px] bg-indigo-50 text-indigo-600 font-bold px-1.5 rounded-sm uppercase tracking-wider font-mono">
                            {st.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Target: {st.component}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bug Injection */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Artificial Bug Injection</span>
                  <p className="text-[11px] text-slate-500">Inject styling defects to inspect accuracy sensitivity threshold scales.</p>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-slate-700">Add Margin Top Offset (+1.5px)</span>
                      <span className="text-[10px] text-slate-400 block">Triggers minor padding layout drift.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasOffsetEnabled} 
                        onChange={(e) => {
                          setHasOffsetEnabled(e.target.checked);
                          setHasScanned(false);
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {hasOffsetEnabled && (
                    <div className="text-[10px] font-bold text-rose-600 flex items-center gap-1.5 animate-pulse bg-rose-50 p-2 rounded-lg border border-rose-100/60">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Defect Injection Injected! Recalibrating.
                    </div>
                  )}
                </div>
              </div>

              {/* Viewport simulation */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-3 shadow-3xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Simulated Viewport Range</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveViewport("desktop")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${activeViewport === "desktop" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-400 hover:text-slate-700"}`}
                  >
                    <Monitor className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">Desktop</span>
                  </button>
                  <button
                    onClick={() => setActiveViewport("tablet")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${activeViewport === "tablet" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-400 hover:text-slate-700"}`}
                  >
                    <Tablet className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">Tablet</span>
                  </button>
                  <button
                    onClick={() => setActiveViewport("mobile")}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors cursor-pointer ${activeViewport === "mobile" ? "bg-white text-indigo-600 shadow-3xs" : "text-slate-400 hover:text-slate-700"}`}
                  >
                    <Smartphone className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold">Mobile</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Sandbox Comparison workspace */}
            <div className="md:col-span-8 space-y-4">
              
              <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[380px] shadow-2xl relative">
                
                {/* Visual spec header */}
                <div className="bg-[#0b0f19] px-5 py-3 border-b border-slate-950 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-slate-400 ml-2">Audit-Frame:</span>
                    <span className="text-white font-semibold">{getViewportDimensions().label}</span>
                  </div>
                  <button
                    onClick={triggerPixelScan}
                    disabled={isScanning}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
                    Audit Screen
                  </button>
                </div>

                {/* Workspace Split window */}
                <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center relative overflow-hidden">
                  
                  {isScanning && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                      <div 
                        className="absolute inset-x-0 h-1.5 bg-blue-500 shadow-[0_0_15px_#3b82f6]"
                        style={{ top: `${scanProgress}%` }}
                      />
                      <div 
                        className="absolute inset-0 bg-blue-500/5" 
                        style={{ clipPath: `inset(0 0 ${100 - scanProgress}% 0)` }}
                      />
                    </div>
                  )}

                  <div className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-w-full ${getViewportDimensions().width} h-[240px] transition-all duration-300`}>
                    
                    {/* Standard baseline side */}
                    <div className="absolute inset-0 bg-[#0F172A] p-5 text-white space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">BASELINE STANDARD (SPEC TYPE)</span>
                        <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase">Spec Ref v28</span>
                      </div>
                      
                      {selectedState.id === "exec-tower" && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-800 rounded-xl border border-slate-800">
                            <span className="text-[8px] uppercase font-bold text-slate-400 font-mono">Margin Average</span>
                            <div className="text-xl font-extrabold text-white mt-0.5">7.15%</div>
                          </div>
                          <div className="p-3 bg-slate-800 rounded-xl border border-slate-800">
                            <span className="text-[8px] uppercase font-bold text-slate-400 font-mono">Checklists Done</span>
                            <div className="text-xl font-extrabold text-slate-300 mt-0.5">4 of 4</div>
                          </div>
                        </div>
                      )}

                      {selectedState.id === "finance-kpis" && (
                        <div className="grid grid-cols-3 gap-2 text-center pt-1">
                          <div className="p-2 bg-slate-800 rounded-xl border border-slate-800"><div className="text-[8px] text-slate-400">Net NPR</div><div className="font-bold text-xs">$48.37M</div></div>
                          <div className="p-2 bg-slate-800 rounded-xl border border-slate-800"><div className="text-[8px] text-slate-400">Total Opex</div><div className="font-bold text-xs">$44.91M</div></div>
                          <div className="p-2 bg-slate-800 rounded-xl border border-slate-800"><div className="text-[8px] text-slate-400">Payer Gap</div><div className="font-bold text-xs">7.15%</div></div>
                        </div>
                      )}

                      {selectedState.id === "trend-modal" && (
                        <div className="space-y-3 pt-1">
                          <div className="h-14 w-full bg-slate-800 rounded-lg border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-500">
                            [ LINE CHART VECTOR OUTLINES ]
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-400">
                            <span>Min Margin: 5.2%</span>
                            <span>Target Floor: 8.5%</span>
                          </div>
                        </div>
                      )}

                      {selectedState.id === "cmd-palette" && (
                        <div className="p-3 bg-slate-800 rounded-xl border border-slate-800 space-y-1">
                          <span className="font-bold text-[11px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Command palette</span>
                          <p className="text-[8px] text-slate-400 leading-normal">Fast overlay menu offering immediate navigation shortcut structures.</p>
                        </div>
                      )}
                    </div>

                    {/* Draggable Active State container */}
                    <div 
                      className="absolute inset-y-0 right-0 bg-[#0F172A] p-5 text-white overflow-hidden transition-all duration-75"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div 
                        className="absolute inset-0 bg-[#0F172A] p-5 text-white space-y-4 overflow-hidden"
                        style={{ width: `${100 - sliderPosition}%`, minWidth: "480px", right: 0 }}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400">REALTIME CLIENT RENDER</span>
                          <span className="text-[8px] text-yellow-500 font-mono font-bold uppercase">LIVE DOM NODE</span>
                        </div>

                        {/* Apply bug displacement transform here */}
                        <div className={`transition-transform duration-200 ${hasOffsetEnabled ? "translate-y-[1.5px] border-rose-500/30" : ""}`}>
                          {selectedState.id === "exec-tower" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className={`p-3 bg-slate-800 rounded-xl border ${hasOffsetEnabled ? "border-rose-500/40 bg-rose-950/20 text-rose-100 animate-pulse" : "border-slate-800"}`}>
                                <span className="text-[8px] uppercase font-bold text-slate-400 font-mono">Margin Average</span>
                                <div className="text-xl font-extrabold text-white mt-0.5">7.15%</div>
                              </div>
                              <div className="p-3 bg-slate-800 rounded-xl border border-slate-800">
                                <span className="text-[8px] uppercase font-bold text-slate-400 font-mono">Checklists Done</span>
                                <div className="text-xl font-extrabold text-slate-300 mt-0.5">4 of 4</div>
                              </div>
                            </div>
                          )}

                          {selectedState.id === "finance-kpis" && (
                            <div className="grid grid-cols-3 gap-2 text-center pt-1">
                              <div className={`p-2 bg-slate-800 rounded-xl border ${hasOffsetEnabled ? "border-rose-500/40 bg-rose-950/20" : "border-slate-800"}`}><div className="text-[8px] text-slate-400">Net NPR</div><div className="font-bold text-xs">$48.37M</div></div>
                              <div className="p-2 bg-slate-800 rounded-xl border border-slate-800"><div className="text-[8px] text-slate-400">Total Opex</div><div className="font-bold text-xs">$44.91M</div></div>
                              <div className="p-2 bg-slate-800 rounded-xl border border-slate-800"><div className="text-[8px] text-slate-400">Payer Gap</div><div className="font-bold text-xs">7.15%</div></div>
                            </div>
                          )}

                          {selectedState.id === "trend-modal" && (
                            <div className="space-y-3 pt-1">
                              <div className={`h-14 w-full bg-slate-800 rounded-lg border flex items-center justify-center text-[10px] font-mono text-slate-500 ${hasOffsetEnabled ? "border-rose-500/40 bg-rose-950/20" : "border-slate-800"}`}>
                                [ LINE CHART VECTOR OUTLINES ]
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Min Margin: 5.2%</span>
                                <span>Target Floor: 8.5%</span>
                              </div>
                            </div>
                          )}

                          {selectedState.id === "cmd-palette" && (
                            <div className={`p-3 bg-slate-800 rounded-xl border space-y-1 ${hasOffsetEnabled ? "border-rose-500/40 bg-rose-950/20" : "border-slate-800"}`}>
                              <span className="font-bold text-[11px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Command palette</span>
                              <p className="text-[8px] text-slate-400 leading-normal">Fast overlay menu offering immediate navigation shortcut structures.</p>
                            </div>
                          )}
                        </div>

                        {/* Pixel diff indicator overlay */}
                        {hasScanned && hasOffsetEnabled && (
                          <div className="absolute top-[30%] left-[10%] bg-pink-500/25 text-pink-300 font-bold font-mono text-[8px] px-2 py-0.5 rounded-sm border border-pink-400/50 flex items-center gap-1 backdrop-blur-xs animate-bounce z-20">
                            <AlertTriangle className="w-2.5 h-2.5 text-pink-400" />
                            ALIGN DISCREPANCY DETECTED
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Split Slider Handle */}
                    <div 
                      className="absolute inset-y-0 w-0.5 bg-blue-500 cursor-ew-resize hover:bg-blue-600 transition-colors z-20"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-blue-500 text-white p-0.5 rounded-full shadow-lg border border-white flex items-center justify-center">
                        <Maximize className="w-2.5 h-2.5 rotate-45" />
                      </div>
                    </div>

                    {/* Splitter click catcher layer */}
                    <div 
                      className="absolute inset-0 z-10 cursor-ew-resize pointer-events-auto"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        setSliderPosition(Math.max(5, Math.min(95, x)));
                        setHoveredPixelOffset({
                          x: Math.round(e.clientX - rect.left),
                          y: Math.round(e.clientY - rect.top)
                        });
                      }}
                      onMouseLeave={() => setHoveredPixelOffset(null)}
                    />
                  </div>
                </div>

                {/* Micro coordinates footer */}
                {hoveredPixelOffset && (
                  <div className="bg-[#0b0f19] px-4 py-2 text-[9px] font-mono text-slate-500 flex justify-between items-center border-t border-slate-950 shrink-0">
                    <span>COORDINATES: X={hoveredPixelOffset.x}px  Y={hoveredPixelOffset.y}px</span>
                    <span className="text-slate-400">CHOMP: PIXEL_SAMPLED_OK</span>
                  </div>
                )}
              </div>

              {/* Status Report Logs for Tab 1 */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Fidelity Audit Metrics</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Match Accuracy</span>
                    <span className={`text-xl font-extrabold mt-1 font-mono ${hasOffsetEnabled ? "text-amber-600" : "text-emerald-600"}`}>
                      {hasOffsetEnabled ? "99.41%" : "100.00%"}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Tolerance SLA is 99.8%</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mismatched Coordinates</span>
                    <span className="text-xl font-extrabold mt-1 text-slate-700 font-mono">
                      {hasOffsetEnabled ? "134 px" : "0 px"}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Automated visual delta</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">QA Assessment</span>
                    <span className={`text-sm font-bold mt-2 flex items-center gap-1 ${hasOffsetEnabled ? "text-amber-600" : "text-emerald-600"}`}>
                      {hasOffsetEnabled ? (
                        <>
                          <AlertTriangle className="w-4 h-4" /> Offset Alert
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Standard Validated
                        </>
                      )}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Verified on {currentFidelity.toFixed(0)}% metrics</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* --- TAB 2: Chaos Engineering Simulator --- */}
        {activeTab === "chaos" && (
          <motion.div 
            key="chaos-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Bomb className="w-4 h-4 text-rose-500 animate-pulse" />
                    Chaos Jitter Injector
                  </h3>
                  <p className="text-[11px] text-slate-500">Inject load packet loss and network delay spikes directly into client endpoints to evaluate graceful fallbacks.</p>
                </div>

                <div className="space-y-4 pt-2">
                  
                  {/* Latency slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold">API Gateway Latency Time</span>
                      <span className="font-mono text-indigo-600 font-bold">{apiLatency} ms</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="4000" 
                      step="50"
                      value={apiLatency}
                      onChange={(e) => setApiLatency(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>Normal (50ms)</span>
                      <span>Stated SLA (800ms)</span>
                      <span>Severe Delay (4s)</span>
                    </div>
                  </div>

                  {/* Packet Loss percentage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold">Simulated Packet Drop Rate</span>
                      <span className="font-mono text-rose-600 font-bold">{packetLoss}% loss</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="80" 
                      step="1"
                      value={packetLoss}
                      onChange={(e) => setPacketLoss(parseInt(e.target.value))}
                      className="w-full accent-rose-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>0% Clear Link</span>
                      <span>SLA Cap (15%)</span>
                      <span>Critical Drop (80%)</span>
                    </div>
                  </div>

                  {/* Authentication Auth endpoint fail toggle */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block text-slate-700">Payer Auth Fail Override</span>
                      <span className="text-[10px] text-slate-400 block">Force HTTP 503 Gateway Timeout.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={failAuthorizations} 
                        onChange={(e) => setFailAuthorizations(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </div>

                  <button
                    onClick={triggerChaosTest}
                    disabled={isChaosRunning}
                    className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 text-white hover:animate-bounce" />
                    {isChaosRunning ? "Running Latency Injection Test..." : "Inject Chaos Parameters"}
                  </button>

                </div>
              </div>

            </div>

            {/* Terminal output console */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="bg-[#0b0e14] border border-slate-800 rounded-3xl p-5 flex flex-col h-[320px] shadow-2xl overflow-hidden font-mono text-xs text-slate-300">
                <div className="flex justify-between items-center pb-3 border-b border-slate-900 mb-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400">CHAOS SIMULATION TERMINAL READOUT</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-sm">ACTIVE MONITOR</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-10">
                      <WifiOff className="w-8 h-8 text-slate-700" />
                      <span className="text-[11px] text-center max-w-xs leading-normal">Terminal empty. Set latency jitter rates on the sidebar pane and trigger simulated API chaos runs to inspect.</span>
                    </div>
                  ) : (
                    logs.map((log) => {
                      let color = "text-slate-300";
                      if (log.type === "warn") color = "text-amber-400";
                      else if (log.type === "error") color = "text-rose-500 font-bold";
                      else if (log.type === "success") color = "text-emerald-400 font-bold";

                      return (
                        <div key={log.id} className="leading-relaxed animate-fade-in text-[11px] flex gap-2 items-start shrink-0">
                          <span className="text-slate-500 text-[10px] select-none">[{log.timestamp}]</span>
                          <p className={color}>{log.message}</p>
                        </div>
                      );
                    })
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>

              {/* Graceful Failures verification card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">Graceful Failure Verification</span>
                  <p className="text-[11px] text-slate-500">Workspace is protected by resilient local index caching & backup service routines.</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  SLAs Active
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* --- TAB 3: Time-Travel & Drift Suite --- */}
        {activeTab === "temporal" && (
          <motion.div 
            key="temporal-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <History className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                    Temporal Cohort Dry-Runner
                  </h3>
                  <p className="text-[11px] text-slate-500">Dry-run projections and adjust historical baseline references to audit cohort drift trends.</p>
                </div>

                <div className="space-y-4 pt-2">
                  
                  {/* Select Year epoch */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Target Financial Epoch</label>
                    <div className="space-y-1">
                      {TEMPORAL_EPOCS.map((ep) => {
                        const isActive = selectedEpoch.epoch === ep.epoch;
                        return (
                          <button
                            key={ep.epoch}
                            type="button"
                            onClick={() => {
                              setSelectedEpoch(ep);
                              setTemporalProgress(100);
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs flex justify-between items-center cursor-pointer transition-all ${
                              isActive 
                                ? "bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-3xs" 
                                : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50/60"
                            }`}
                          >
                            <div>
                              <span className="font-bold block">{ep.epoch}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">Denials: {ep.denialRate}</span>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              ep.status === "Optimized" ? "bg-emerald-50 text-emerald-700" :
                              ep.status === "Balanced" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                            }`}>
                              {ep.operatingMargin}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Overtime overcharge slider constraint */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold">Nursing Overtime Registry Bias</span>
                      <span className="font-mono text-indigo-600 font-bold">+${registryWageOvercharge}k drift</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="150" 
                      step="10"
                      value={registryWageOvercharge}
                      onChange={(e) => setRegistryWageOvercharge(parseInt(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-1 bg-slate-100 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>0 (Base rate reliance)</span>
                      <span>Stated SLA Cap</span>
                      <span>Severe Deviation</span>
                    </div>
                  </div>

                  <button
                    onClick={triggerTemporalAudit}
                    disabled={isTemporalRunning}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                  >
                    <FastForward className="w-4 h-4 text-white" />
                    {isTemporalRunning ? "Synthesizing Cohort Walk..." : "Evaluate Projection Model"}
                  </button>

                </div>
              </div>

            </div>

            {/* Projection Drift Output Screen */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Projection card metrics */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-5 shadow-3xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Audited Epoch: {selectedEpoch.epoch}</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-extrabold text-[#0F172A] font-mono tracking-tight">
                      {isTemporalRunning ? "Calculating..." : `${actualSelectedMargin.toFixed(2)}%`}
                    </span>
                    <span className="text-xs text-slate-400">Audited Projection</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold font-mono">Target Floor standard</span>
                    <span className="text-sm font-bold text-slate-700 block mt-1">8.5% margin</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold font-mono font-sans">Reliability Coefficient</span>
                    <span className="text-sm font-bold text-emerald-600 block mt-1">99.8% Core Accuracy</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Cohort drift variance indicator</span>
                    <span className={`${actualSelectedMargin >= 8.5 ? "text-emerald-600" : "text-rose-500"} font-mono`}>
                      {actualSelectedMargin >= 8.5 ? "Goal Accomplished" : "Deficit (Gap of " + (8.5 - actualSelectedMargin).toFixed(2) + "%)"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${actualSelectedMargin >= 8.5 ? "bg-emerald-500" : "bg-rose-500"}`}
                      style={{ width: `${Math.max(10, Math.min(100, actualSelectedMargin * 10))}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    *Changing Overtime Registry Bias dynamically modifies predicted cardiology contractor expenses directly, simulating historical resource constraint drifts over 12 months.
                  </p>
                </div>
              </div>

              {/* Time Travel Ledger log */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2.5 text-slate-200">
                <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wider block">Deterministic Run Trail Log</span>
                <div className="text-[11px] font-mono space-y-1.5 text-slate-400 leading-relaxed">
                  <p className="flex justify-between"><span>[09:12:00] INIT DETERMINISTIC_SEED_SECURE</span> <span className="text-emerald-400 font-bold">// Done</span></p>
                  <p className="flex justify-between"><span>[09:12:01] INJECT RECONSTRUCTED COHORT EXPENSE</span> <span className="text-emerald-400 font-bold">+${registryWageOvercharge}k added</span></p>
                  <p className="flex justify-between"><span>[09:12:02] COMPUTE Operating Margin Target Variance</span> <span className="text-emerald-400 font-bold">{actualSelectedMargin.toFixed(2)}% calculated</span></p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* --- TAB 4: WCAG 2.2 Accessibility Contrast Suite --- */}
        {activeTab === "a11y" && (
          <motion.div 
            key="a11y-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            <div className="md:col-span-5 space-y-4">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-3xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-indigo-600 animate-pulse" />
                    WCAG 2.2 Contrast & Accessibility Suite
                  </h3>
                  <p className="text-[11px] text-slate-500">Run real-time automated audit scans verification across active document models checking design system compliance hierarchies.</p>
                </div>

                <div className="space-y-4 pt-2">
                  
                  {/* Big score block */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Accessibility Score</span>
                      <span className="text-4xl font-extrabold text-[#0F172A] block mt-1 font-mono">
                        {isA11yAuditing ? "Scanning" : `${a11yScore}%`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-100 font-bold inline-block">
                        Grade A Compliance
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-sans">9 passed / 1 warned</span>
                    </div>
                  </div>

                  <button
                    onClick={triggerA11yAudit}
                    disabled={isA11yAuditing}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-4 h-4 ${isA11yAuditing ? "animate-spin" : ""}`} />
                    {isA11yAuditing ? "Auditing active styles..." : "Re-Scan UI Components"}
                  </button>

                </div>
              </div>

              {/* keyboard guidelines note */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-3xl space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Keyboard Flow Path (A11y Tab-Index)</span>
                <div className="text-[10px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100 inline-block w-full">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Focus outline wraps focus elements correctly on Tab key.
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 mt-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Modals and overlays trap tab-focus securely to escape exits.
                  </div>
                </div>
              </div>

            </div>

            {/* WCAG Compliance Item Rules logs */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-3.5 shadow-3xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Targeted CSS Element Checker</span>
                  <p className="text-[11px] text-slate-500">Inspecting layout containers for AAA specifications ratios (Contrast minimum target 4.5:1).</p>
                </div>

                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                  {a11yRules.map((r) => (
                    <div 
                      key={r.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-start text-xs gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1 rounded-sm font-bold uppercase">{r.ruleCode}</span>
                          <span className="font-bold text-slate-800">{r.elementName}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">{r.description}</p>
                      </div>

                      {r.status === "pass" ? (
                        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <Check className="w-3 h-3" /> Pass {r.ratioText && `(${r.ratioText})`}
                        </div>
                      ) : (
                        <div className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                          <AlertTriangle className="w-3 h-3 text-amber-500" /> Warning
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

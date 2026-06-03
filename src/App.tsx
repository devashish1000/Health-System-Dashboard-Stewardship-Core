import React, { useState, useEffect } from "react";
import {
  Compass, LayoutDashboard, Layers, BarChart4, Cpu, Sliders, ShieldCheck,
  Building, UserCheck, Share2, ArrowRightLeft, X, RefreshCcw,
  Shield, Activity, Lock
} from "lucide-react";
import BrandLogo from "./components/BrandLogo";
import { SparkMark } from "./components/BrandMotif";
import { useTheme } from "./lib/useTheme";
import { SYNTHETIC_RECORDS, FinanceRecord } from "./data/syntheticFinanceData";
import { ProjectPage, ControlTowerFilters, ToastMessage, UserPersona, CertifiedSignoff } from "./types";
import { filterRecords } from "./lib/financeCalculations";
import { getReportingContext } from "./lib/reportingPeriod";
import { useReportingPeriod } from "./lib/useReportingPeriod";
import { checklistStorageKey } from "./lib/periodStorage";
import { controlTowerVersion } from "./lib/stewardshipConfig";
import { getPersonaPreset } from "./config/demoOrg";
import {
  getRecruiterDefaultFilters,
  RECRUITER_WELCOME_KEY,
  TOUR_VARIANT_KEY,
  JOB_REQ_ID,
} from "./constants/recruiterHandoff";
import RecruiterWelcomeModal from "./components/RecruiterWelcomeModal";

function isReviewerLink(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("reviewer") === "1";
}
import { pickDrillRecord } from "./lib/serviceLineDrill";

// Modular Pages
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Dashboard from "./pages/Dashboard";
import ServiceLines from "./pages/ServiceLines";
import Forecast from "./pages/Forecast";
import Copilot from "./pages/Copilot";
import Simulator from "./pages/Simulator";
import ResponsibleAI from "./pages/ResponsibleAI";
import VisualRegression from "./pages/VisualRegression";

// Individual Overlay Components
import ServiceLineDrawer from "./components/ServiceLineDrawer";
import Toast from "./components/Toast";
import ExportDataModal from "./components/ExportDataModal";
import FinalizeReviewModal from "./components/FinalizeReviewModal";
import CommandPalette from "./components/CommandPalette";
import GuidedTour from "./components/GuidedTour";
import SyntheticDataBadge from "./components/SyntheticDataBadge";
import AppTopBar, { SidebarWorkspaceContext } from "./components/AppTopBar";

const INITIAL_FILTERS: ControlTowerFilters = {
  facility: "",
  region: "",
  serviceLine: "",
  month: "",
  varianceStatus: "",
  reviewStatus: "",
  payerType: "",
  owner: ""
};

export default function App() {
  // Theme toggle (light/dark) for content surfaces
  const { theme, toggleTheme } = useTheme();

  // Session Authentication state (Mockup)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("commonspirit_is_logged_in") === "true";
  });

  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState<ProjectPage>("overview");
  const [drillServiceLine, setDrillServiceLine] = useState<string | null>(null);
  
  // Local Database State with LocalStorage Synchronization
  const [records, setRecords] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem("commonspirit_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("LocalStorage records parse error:", err);
      }
    }
    return SYNTHETIC_RECORDS;
  });

  // User Authority Persona Switcher State
  const [userPersona, setUserPersona] = useState<UserPersona>(() => {
    const saved = localStorage.getItem("commonspirit_user_persona");
    return (saved as UserPersona) || "analyst";
  });

  // Certified Sign-off Certificates Ledger State
  const [signoffs, setSignoffs] = useState<CertifiedSignoff[]>(() => {
    const saved = localStorage.getItem("commonspirit_signoffs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("LocalStorage signoffs parse error:", err);
      }
    }
    return [];
  });
  
  // Compliance Checklist Tracking State
  const [checklistCompleted, setChecklistCompleted] = useState<Record<string, boolean>>(() => {
    const reporting = getReportingContext(SYNTHETIC_RECORDS);
    const key = checklistStorageKey(reporting);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fall through */
      }
    }
    return {
      denials: false,
      simulator: false,
      copilot: false,
      signoff: false,
    };
  });

  // Interactive Overlays visibility states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [showRecruiterWelcome, setShowRecruiterWelcome] = useState(false);
  const [forceRecruiterTour] = useState(() => {
    if (isReviewerLink()) {
      localStorage.setItem(TOUR_VARIANT_KEY, "recruiter");
      return true;
    }
    return false;
  });

  // Global Filters state with LocalStorage Synchronization
  const [filters, setFilters] = useState<ControlTowerFilters>(() => {
    const saved = localStorage.getItem("commonspirit_filters");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("LocalStorage filters parse error:", err);
      }
    }
    const { closeMonth } = getReportingContext(
      (() => {
        const raw = localStorage.getItem("commonspirit_records");
        if (raw) {
          try {
            return JSON.parse(raw) as FinanceRecord[];
          } catch {
            /* use default seed */
          }
        }
        return SYNTHETIC_RECORDS;
      })()
    );
    return { ...INITIAL_FILTERS, month: closeMonth };
  });
  
  // Toast notifications list
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Drawer state for detailing cell rows
  const [selectedRecord, setSelectedRecord] = useState<FinanceRecord | null>(null);

  // Responsive Sidebar Drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // UTC Live Timing Clock state
  const [utcTimeStr, setUtcTimeStr] = useState("");

  // Auto-effects for state preservation
  useEffect(() => {
    localStorage.setItem("commonspirit_records", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem("commonspirit_filters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem("commonspirit_user_persona", userPersona);
  }, [userPersona]);

  useEffect(() => {
    localStorage.setItem("commonspirit_signoffs", JSON.stringify(signoffs));
  }, [signoffs]);

  const reporting = useReportingPeriod(records);

  useEffect(() => {
    localStorage.setItem(checklistStorageKey(reporting), JSON.stringify(checklistCompleted));
  }, [checklistCompleted, reporting]);

  useEffect(() => {
    localStorage.setItem("commonspirit_is_logged_in", isLoggedIn ? "true" : "false");
  }, [isLoggedIn]);

  // First-visit recruiter welcome (before guided tour)
  useEffect(() => {
    if (isLoggedIn && localStorage.getItem(RECRUITER_WELCOME_KEY) !== "true") {
      setShowRecruiterWelcome(true);
    }
  }, [isLoggedIn]);

  // First-run guided tour trigger (only once, when logged in; after welcome dismissed)
  useEffect(() => {
    if (
      isLoggedIn &&
      !showRecruiterWelcome &&
      localStorage.getItem("commonspirit_tour_seen") !== "true"
    ) {
      setIsTourOpen(true);
    }
  }, [isLoggedIn, showRecruiterWelcome]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTimeStr(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleGlobalKbd = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKbd);
    return () => window.removeEventListener("keydown", handleGlobalKbd);
  }, []);

  const filteredRecords = filterRecords(records, filters);

  const triggerToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const handleRemoveToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateRecordInDB = (updated: FinanceRecord) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === updated.id ? updated : rec))
    );
  };

  const handlePersonaChange = (persona: UserPersona) => {
    setUserPersona(persona);
    triggerToast(`Workspace role: ${getPersonaPreset(persona).role}`, "info");
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    triggerToast("Dashboard filters cleared — showing full close-month ledger.", "info");
  };

  const handleApplyHoustonFilter = (options?: { serviceLine?: string; navigate?: ProjectPage }) => {
    const houstonDefaults = getRecruiterDefaultFilters(reporting);
    setFilters((prev) => ({
      ...prev,
      ...houstonDefaults,
      facility: "",
      serviceLine: options?.serviceLine ?? "",
      varianceStatus: "",
      reviewStatus: "",
      payerType: "",
      owner: "",
    }));
    setCurrentPage(options?.navigate ?? "dashboard");
    triggerToast(
      `Reviewer path: ${houstonDefaults.region} · ${houstonDefaults.month} close month.`,
      "info"
    );
  };

  const handleStartReviewerPath = () => {
    setFilters({ ...INITIAL_FILTERS, month: reporting.closeMonth });
    setCurrentPage("dashboard");
    triggerToast("Reviewer path: use region and service line filters across all markets.", "info");
  };

  const handleDismissRecruiterWelcome = () => {
    localStorage.setItem(RECRUITER_WELCOME_KEY, "true");
    setShowRecruiterWelcome(false);
  };

  const handleLogin = (persona: UserPersona) => {
    setUserPersona(persona);
    setFilters({ ...INITIAL_FILTERS, month: reporting.closeMonth });
    setIsLoggedIn(true);
    triggerToast("Work sample loaded — synthetic data only.", "success");
  };

  const handleRestoreSystemDefaults = () => {
    localStorage.removeItem("commonspirit_records");
    localStorage.removeItem("commonspirit_user_persona");
    localStorage.removeItem("commonspirit_signoffs");
    localStorage.removeItem("commonspirit_checklist_completed");
    localStorage.removeItem("commonspirit_filters");
    setRecords(SYNTHETIC_RECORDS);
    handlePersonaChange("analyst");
    setFilters(INITIAL_FILTERS);
    setSignoffs([]);
    const reportingReset = getReportingContext(SYNTHETIC_RECORDS);
    localStorage.removeItem(checklistStorageKey(reportingReset));
    setChecklistCompleted({
      denials: false,
      simulator: false,
      copilot: false,
      signoff: false,
    });
    triggerToast("Demo sandbox reset — synthetic ledger and filters restored to defaults.", "info");
  };

  const handleFinalizeReviewClick = () => {
    if (userPersona === "analyst") {
      triggerToast("Access Denied: Market Finance credentials are required to execute board-level cycle closing.", "warning");
      return;
    }
    setIsFinalizeModalOpen(true);
  };

  const handleAddSignoff = (signoff: CertifiedSignoff) => {
    setSignoffs((prev) => [signoff, ...prev]);
    setChecklistCompleted((prev) => ({ ...prev, signoff: true }));
  };


  // Nav side links
  const NAV_ITEMS = [
    { id: "overview", label: "Executive Tower", icon: Compass },
    { id: "dashboard", label: "Financial Dashboard", icon: LayoutDashboard },
    { id: "serviceLines", label: "Service Lines Review", icon: Layers },
    { id: "forecast", label: "Forecast & Walk", icon: BarChart4 },
    { id: "copilot", label: "AI Finance Copilot", icon: Cpu },
    { id: "simulator", label: "Scenario Simulator", icon: Sliders },
    { id: "responsibleAi", label: "Responsible AI & Dev", icon: ShieldCheck },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white text-ink-900 flex flex-col font-sans">
        <Toast toasts={toasts} onRemove={handleRemoveToast} />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Toast Overlay Component */}
      <Toast toasts={toasts} onRemove={handleRemoveToast} />

      {/* Persistent synthetic demo data pill */}
      <SyntheticDataBadge periodLabel={reporting.workspaceChipShort} />

      <RecruiterWelcomeModal
        isOpen={showRecruiterWelcome}
        onClose={handleDismissRecruiterWelcome}
      />

      {/* Main Structural Frame */}
      <div className="flex flex-grow relative">
        
        {/* Navigation Sidebar (Geometric Balance styled ink-900) */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 text-slate-300 flex flex-col transition-transform duration-300 transform md:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} border-r border-ink-800`}>
          
          {/* Sidebar Corporate Brand Title Panel */}
          <div className="p-6 border-b border-ink-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <SparkMark size={22} />
              <BrandLogo chip height={28} />
            </div>
            {/* Mobile close trigger */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 md:hidden text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-4">Mission Control</div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as ProjectPage);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-left text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-brand-600/10 text-brand-400 border border-brand-500/20"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-400" : "text-slate-500"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer detailing metadata */}
          <div className="p-5 border-t border-ink-800 space-y-3.5">
            <SidebarWorkspaceContext reporting={reporting} />

            {/* Persona Selection Dropdown */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold tracking-wider text-slate-500 uppercase block">Workspace Role</label>
              <div className="relative">
                <select
                  value={userPersona}
                  onChange={(e) => {
                    const nextVal = e.target.value as any;
                    handlePersonaChange(nextVal);
                  }}
                  className="w-full bg-ink-800/70 border border-ink-800 text-slate-200 text-xs py-1.5 px-2.5 rounded-lg focus:outline-hidden font-semibold cursor-pointer select-none accent-slate-800"
                >
                  <option value="analyst">📊 Sr Financial Analyst</option>
                  <option value="cfo">💼 Market Finance</option>
                  <option value="director">📦 Supply Chain Ops</option>
                  <option value="auditor">🔍 Finance Compliance</option>
                </select>
              </div>
              {getPersonaPreset(userPersona).demoNote && (
                <p className="text-[9px] text-amber-200/80 leading-snug">{getPersonaPreset(userPersona).demoNote}</p>
              )}
            </div>

            <div className="flex items-center gap-2.5 bg-ink-800/35 p-2.5 rounded-xl border border-ink-800">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shrink-0 animate-pulse" />
              <div className="text-[10px] text-slate-300">
                <span className="font-semibold block text-slate-200">Demo workspace</span>
                <span className="font-mono text-slate-400 block mt-0.5">
                  Synthetic ledger · {reporting.closeMonthLabel}
                </span>
              </div>
            </div>

            {/* Sandbox reset trigger */}
            <button
              onClick={handleRestoreSystemDefaults}
              className="w-full py-1 text-[10px] font-bold border border-rose-500/10 hover:border-rose-500/20 text-rose-400 hover:bg-rose-500/5 hover:text-rose-400 rounded-lg cursor-pointer transition-colors"
            >
              Restore System Defaults
            </button>

            {/* Lock session trigger */}
            <button
              onClick={() => {
                setIsLoggedIn(false);
                triggerToast("Work sample session ended. Return to login to continue.", "info");
              }}
              className="w-full py-1 text-[10px] font-bold border border-brand-500/10 hover:border-brand-500/20 text-brand-400 hover:bg-brand-500/5 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
            >
              <Lock className="w-2.5 h-2.5 text-brand-400" />
              <span>Lock / Sign Out Session</span>
            </button>

            <div className="text-[9px] text-slate-400 text-center leading-normal">
              Applicant work sample · Req {JOB_REQ_ID} <br />
              Finance Control Tower demo · {controlTowerVersion()} · {reporting.workspaceChipShort}
            </div>
          </div>

        </aside>

        {/* Outer Content Frame wrapper */}
        <div className="flex-grow md:pl-64 min-w-0 transition-padding">
          
          <AppTopBar
            userPersona={userPersona}
            utcTimeStr={utcTimeStr}
            theme={theme}
            reporting={reporting}
            onToggleTheme={toggleTheme}
            onOpenExport={() => setIsExportModalOpen(true)}
            onOpenTour={() => setIsTourOpen(true)}
            onFinalize={handleFinalizeReviewClick}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          {/* Interactive content based on state pages */}
          <main className="flex-grow p-6 text-slate-900 dark:text-slate-100">
            {currentPage === "overview" && (
              <Overview 
                onNavigate={setCurrentPage} 
                records={records}
                checklistCompleted={checklistCompleted}
                onToggleChecklist={(key, val) => {
                  setChecklistCompleted(prev => ({ ...prev, [key]: val }));
                }}
                onStartReviewerPath={handleStartReviewerPath}
              />
            )}
            {currentPage === "dashboard" && (
              <Dashboard
                records={filteredRecords}
                filters={filters}
                onChangeFilters={setFilters}
                onSelectRow={setSelectedRecord}
                onResetFilters={handleResetFilters}
                drillServiceLineRequest={drillServiceLine}
                onDrillServiceLineConsumed={() => setDrillServiceLine(null)}
              />
            )}
            {currentPage === "serviceLines" && (
              <ServiceLines
                records={records}
                onTriggerToast={triggerToast}
                onUpdateRecord={handleUpdateRecordInDB}
              />
            )}
            {currentPage === "forecast" && <Forecast records={records} />}
            {currentPage === "copilot" && <Copilot />}
            {currentPage === "simulator" && (
              <Simulator 
                records={records} 
                onChecklistTrigger={() => {
                  setChecklistCompleted(prev => ({ ...prev, simulator: true }));
                }}
                onTriggerToast={triggerToast}
              />
            )}
            {currentPage === "responsibleAi" && <ResponsibleAI />}
            {currentPage === "visualRegression" && <VisualRegression />}
          </main>

        </div>

      </div>

      {/* Row details slide-over overlay */}
      {selectedRecord && (
        <ServiceLineDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onSaveRecord={handleUpdateRecordInDB}
          onTriggerToast={triggerToast}
        />
      )}

      {/* Corporate Export Drawer overlay */}
      <ExportDataModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filteredRecords={filteredRecords}
        signoffs={signoffs}
        reporting={reporting}
        onTriggerToast={triggerToast}
      />

      {/* Corporate Cycle Finalizer overlay */}
      <FinalizeReviewModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        records={records}
        userPersona={userPersona}
        onAddSignoff={handleAddSignoff}
        onTriggerToast={triggerToast}
      />

      {/* Global Command Palette (⌘K) Overlay */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userPersona={userPersona}
        onChangePersona={handlePersonaChange}
        onTriggerExport={() => setIsExportModalOpen(true)}
        onTriggerSignoff={handleFinalizeReviewClick}
        onClearFilters={handleResetFilters}
        onRestoreSandbox={handleRestoreSystemDefaults}
        onSelectRecord={(service) => {
          setCurrentPage("dashboard");
          setDrillServiceLine(service);
          const match = pickDrillRecord(records, service);
          if (match) {
            triggerToast(
              `12-month trend: ${service} (${match.facility}, ${match.region})`,
              "info"
            );
          } else {
            triggerToast(`12-month trend: ${service}`, "info");
          }
        }}
        records={records}
        onTriggerToast={triggerToast}
        onApplyHoustonFilter={() => handleApplyHoustonFilter()}
      />

      {/* First-run / on-demand Guided Tour Overlay */}
      <GuidedTour
        isOpen={isTourOpen}
        forceRecruiterPath={forceRecruiterTour}
        onClose={() => {
          setIsTourOpen(false);
          localStorage.setItem("commonspirit_tour_seen", "true");
        }}
        onNavigate={setCurrentPage}
      />

    </div>
  );
}

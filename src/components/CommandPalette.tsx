import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  motion, AnimatePresence 
} from "motion/react";
import { 
  Search, Terminal, ArrowRight, Shield, User, Download, RotateCcw, 
  Trash2, Cpu, HelpCircle, Activity, Sparkles, CornerDownLeft, ChevronRight,
  Compass, LayoutDashboard, Layers, BarChart4, Sliders, ShieldCheck, Eye
} from "lucide-react";
import { ProjectPage, UserPersona, FinanceRecord } from "../types";

interface CommandItem {
  id: string;
  category: "Navigation" | "Core Actions" | "Strategic Role Mode" | "Service Lines Insights";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: ProjectPage;
  onNavigate: (page: ProjectPage) => void;
  userPersona: UserPersona;
  onChangePersona: (persona: UserPersona) => void;
  onTriggerExport: () => void;
  onTriggerSignoff: () => void;
  onClearFilters: () => void;
  onRestoreSandbox: () => void;
  onSelectRecord: (service: string) => void;
  records: FinanceRecord[];
  onTriggerToast: (text: string, type?: "success" | "info" | "warning") => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  userPersona,
  onChangePersona,
  onTriggerExport,
  onTriggerSignoff,
  onClearFilters,
  onRestoreSandbox,
  onSelectRecord,
  records,
  onTriggerToast
}: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"commands" | "ai">("commands");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus on opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setSearch("");
      setSelectedIndex(0);
      setMode("commands");
      setAiResponse(null);
    }
  }, [isOpen]);

  // Command palette keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // If state is controlled from App, App listener handles toggle
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Commands lookup tree
  const commands = useMemo<CommandItem[]>(() => {
    const arr: CommandItem[] = [
      // Navigation
      {
        id: "nav-overview",
        category: "Navigation",
        title: "Go to Executive Tower",
        description: "Review enterprise operational health and stewardship checklist metrics",
        icon: Compass,
        action: () => { onNavigate("overview"); onTriggerToast("Navigated to Executive Tower.", "info"); onClose(); }
      },
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Go to Financial Dashboard",
        description: "Analyze core service-line revenues, margins, and budget variances",
        icon: LayoutDashboard,
        action: () => { onNavigate("dashboard"); onTriggerToast("Navigated to Financial Dashboard.", "info"); onClose(); }
      },
      {
        id: "nav-service-lines",
        category: "Navigation",
        title: "Go to Service Lines Review",
        description: "Drill down into individual service line metrics and audit trails",
        icon: Layers,
        action: () => { onNavigate("serviceLines"); onTriggerToast("Navigated to Service Lines Review.", "info"); onClose(); }
      },
      {
        id: "nav-forecast",
        category: "Navigation",
        title: "Go to Forecast & Walk",
        description: "Inspect operating margin projection streams and target variances",
        icon: BarChart4,
        action: () => { onNavigate("forecast"); onTriggerToast("Navigated to Forecast & Walk.", "info"); onClose(); }
      },
      {
        id: "nav-copilot",
        category: "Navigation",
        title: "Go to AI Finance Copilot",
        description: "Interact with real-time strategic intelligence assistant",
        icon: Cpu,
        action: () => { onNavigate("copilot"); onTriggerToast("Navigated to AI Finance Copilot.", "info"); onClose(); }
      },
      {
        id: "nav-simulator",
        category: "Navigation",
        title: "Go to Scenario Simulator",
        description: "Simulate operational rate shifts and nursing registry impacts",
        icon: Sliders,
        action: () => { onNavigate("simulator"); onTriggerToast("Navigated to Scenario Simulator.", "info"); onClose(); }
      },
      {
        id: "nav-responsible-ai",
        category: "Navigation",
        title: "Go to Responsible AI & Dev",
        description: "Review system integrity bounds and metadata configurations",
        icon: ShieldCheck,
        action: () => { onNavigate("responsibleAi"); onTriggerToast("Navigated to Responsible AI & Dev.", "info"); onClose(); }
      },
      {
        id: "nav-visual-regression",
        category: "Navigation",
        title: "Go to Pixel Auditor QA",
        description: "Run automated pixel-by-pixel regression checks and design system fidelity audits",
        icon: Eye,
        action: () => { onNavigate("visualRegression"); onTriggerToast("Navigated to Pixel Auditor QA.", "info"); onClose(); }
      },

      // Core Actions
      {
        id: "action-export",
        category: "Core Actions",
        title: "Export Sandbox Data",
        description: "Generate compliant CSV/JSON audit trails of active filters",
        icon: Download,
        action: () => { onTriggerExport(); onClose(); },
        shortcut: "E"
      },
      {
        id: "action-signoff",
        category: "Core Actions",
        title: "Pre-flight Workspace Sign-off",
        description: "Digitally certify and close active performance review cohort",
        icon: Shield,
        action: () => { onTriggerSignoff(); onClose(); },
        shortcut: "S"
      },
      {
        id: "action-clear",
        category: "Core Actions",
        title: "Clear Dashboard Filters",
        description: "Reset facilities, region and other filtering constraints instantly",
        icon: Trash2,
        action: () => { onClearFilters(); onClose(); },
        shortcut: "C"
      },
      {
        id: "action-reset",
        category: "Core Actions",
        title: "Restore System Defaults",
        description: "Purge local storage state and re-initialize official baseline database",
        icon: RotateCcw,
        action: () => { onRestoreSandbox(); onClose(); }
      },

      // Personas
      {
        id: "role-analyst",
        category: "Strategic Role Mode",
        title: "Shift Role: Senior Strategic Analyst",
        description: "Toggle operational analyst credentials for checklist and comments",
        icon: User,
        action: () => { onChangePersona("analyst"); onClose(); }
      },
      {
        id: "role-cfo",
        category: "Strategic Role Mode",
        title: "Shift Role: Regional CFO",
        description: "Enable executive authority status to perform board-level sign-offs",
        icon: User,
        action: () => { onChangePersona("cfo"); onClose(); }
      },
      {
        id: "role-director",
        category: "Strategic Role Mode",
        title: "Shift Role: Clinical Director",
        description: "Adopt clinician perspectives for nursing rosters and registries",
        icon: User,
        action: () => { onChangePersona("director"); onClose(); }
      },
      {
        id: "role-auditor",
        category: "Strategic Role Mode",
        title: "Shift Role: Compliance Auditor",
        description: "Initiate compliance-level validation overlay parameters",
        icon: User,
        action: () => { onChangePersona("auditor"); onClose(); }
      }
    ];

    // Unique Service line insights
    const uniqueServices = Array.from(new Set(records.map(r => r.service_line)));
    uniqueServices.forEach(s => {
      arr.push({
        id: `service-${s.toLowerCase().replace(/ /g, "-")}`,
        category: "Service Lines Insights",
        title: `Drill Trend: ${s}`,
        description: `Trigger 12-month Operating Margin trends & regional performance metrics for ${s}`,
        icon: Activity,
        action: () => {
          onSelectRecord(s);
          onTriggerToast(`Displaying 12-Month Performance Trend for ${s}.`, "info");
          onClose();
        }
      });
    });

    return arr;
  }, [records, onNavigate, onChangePersona, onTriggerExport, onTriggerSignoff, onClearFilters, onRestoreSandbox, onSelectRecord, onTriggerToast, onClose]);

  // Filtering based on search query
  const filteredCommands = useMemo(() => {
    if (mode === "ai" || search.startsWith("/ai")) return [];
    const q = search.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter(
      c => c.title.toLowerCase().includes(q) || 
           c.description.toLowerCase().includes(q) || 
           c.category.toLowerCase().includes(q)
    );
  }, [commands, search, mode]);

  // Keyboard navigation overrides
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (mode === "commands") {
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
        } else {
          handleAiSubmit();
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        setMode(prev => prev === "commands" ? "ai" : "commands");
        setSearch("");
        setAiResponse(null);
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [isOpen, filteredCommands, selectedIndex, mode, search]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search, mode]);

  // Handle AI queries
  const handleAiSubmit = () => {
    const query = search.trim();
    if (!query) return;

    setIsAiThinking(true);
    setAiResponse(null);

    // Simulate smart local insight replies about commonspirit healthcare numbers
    setTimeout(() => {
      setIsAiThinking(false);
      const q = query.toLowerCase();
      if (q.includes("opex") || q.includes("expense") || q.includes("spending")) {
        setAiResponse("Based on the sandbox baseline, total operating expense is currently $44.91M against a target of $42.1M. The primary cost drivers are contract labor nurse registries inside Cardiology (+$1.2M) and physical supply chain cost increases within Orthopedics.");
      } else if (q.includes("margin") || q.includes("profit") || q.includes("target")) {
        setAiResponse("The overall CommonSpirit baselineOperating Margin is at 7.15%, which currently misses the Stewardship Goal of 8.5%. To close this 1.35% variance, prioritize clearing Cardiology claim denials (currently at 3.2%) and capping contract overtime registry rates.");
      } else if (q.includes("revenue") || q.includes("npr") || q.includes("net patient")) {
        setAiResponse("YTD Net Patient Revenue has logged $48.37M (+$1.5M over budgeted target). The highest collection drivers are Neurology and Cardiology due to an operational shift of high-acuity cases in Q2.");
      } else if (q.includes("denial") || q.includes("claim")) {
        setAiResponse("Average claim denial rates sit at 2.4%. Cardiology has an elevated denial rate of 3.2% due to prior authorization mismatch issues. Recommended action: coordinate with clinical auditors to pre-certify commercial payer cases.");
      } else {
        setAiResponse(`Operational intelligence summary for "${query}": Our forecasting pipeline predicts consistent patient volume recovery in Q3, particularly within Orthopedics. Operating margins are expected to approach 7.9% if registry reliance declines.`);
      }
    }, 950);
  };

  const handleSuggestionClick = (text: string) => {
    setMode("ai");
    setSearch(text);
    setTimeout(() => handleAiSubmit(), 50);
  };

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const map: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(c => {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    });
    return map;
  }, [filteredCommands]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pb-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <div className="w-full max-w-2xl bg-ink-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-slate-300">
        
        {/* Nav tabs */}
        <div className="flex border-b border-slate-800 px-4 py-2 gap-4 text-xs font-bold font-sans">
          <button 
            type="button"
            onClick={() => { setMode("commands"); setSearch(""); setAiResponse(null); }}
            className={`py-1.5 px-3 rounded-lg transition-colors cursor-pointer ${mode === "commands" ? "bg-brand-600/10 text-brand-400 border border-brand-500/20" : "text-slate-400 hover:text-slate-200"}`}
          >
            Terminal Commands (⌘K)
          </button>
          <button 
            type="button"
            onClick={() => { setMode("ai"); setSearch(""); setAiResponse(null); }}
            className={`py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${mode === "ai" ? "bg-brand-600/10 text-brand-400 border border-brand-500/20" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            AI Analytical Prompt (/ai)
          </button>
        </div>

        {/* Input area */}
        <div className="p-4 flex items-center gap-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent focus:outline-hidden text-sm placeholder:text-slate-500 text-white font-sans"
            placeholder={mode === "commands" ? "Search navigation, triggers, service lines, or personas..." : "Ask copilot: 'Why is opex high?' or 'How to reach 8.5% margin?'..."}
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              if (val.startsWith("/ai ") && mode === "commands") {
                setMode("ai");
                setSearch(val.replace("/ai ", ""));
              }
            }}
          />
          {mode === "ai" && search && (
            <button
              onClick={handleAiSubmit}
              disabled={isAiThinking}
              className="py-1 px-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
            >
              Analyze
              <CornerDownLeft className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Dynamic Display Panel */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-800">
          
          {mode === "commands" ? (
            filteredCommands.length > 0 ? (
              // Command list representation
              <div className="space-y-4 py-2">
                {Object.entries(groupedCommands).map(([category, items]) => {
                  const typedItems = items as CommandItem[];
                  return (
                    <div key={category} className="space-y-1">
                      <div className="px-3 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                        {category}
                      </div>
                      <div>
                        {typedItems.map((item) => {
                        // Global flat index across matches for active highlights
                        const globalIndex = filteredCommands.findIndex(fc => fc.id === item.id);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.id}
                            onClick={() => item.action()}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${
                              isSelected 
                                ? "bg-slate-800 text-white" 
                                : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isSelected ? "bg-slate-700 text-brand-400" : "bg-slate-900 text-slate-500"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className={`text-[12px] font-bold block ${isSelected ? "text-white" : "text-slate-200"}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 line-clamp-1 font-normal">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              {item.shortcut && (
                                <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded-sm lowercase font-bold">
                                  {item.shortcut}
                                </span>
                              )}
                              {isSelected && (
                                <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
                <span className="text-xs font-bold text-slate-400 block">No workspace command matched</span>
                <span className="text-[10px] text-slate-600 block">Refine search values or type '/ai' to ask the steward copilot</span>
              </div>
            )
          ) : (
            // AI Command Palette Mode
            <div className="p-3 space-y-4">
              
              {!search && !aiResponse && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Suggested AI Investigations</span>
                    <p className="text-[11px] text-slate-400">Select a micro-run operational question for automated clinical answers:</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("Why is Cardiology opex elevated?")}
                      className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-semibold cursor-pointer block hover:bg-slate-800"
                    >
                      "Why is Cardiology opex elevated?"
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("What causes the claim denial rate of 3.2%?")}
                      className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-semibold cursor-pointer block hover:bg-slate-800"
                    >
                      "How to resolve Cardiology's 3.2% denial rate?"
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("What is the current operating margin vs stewardship goal?")}
                      className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-semibold cursor-pointer block hover:bg-slate-800"
                    >
                      "What is operating margin vs 8.5% goal?"
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick("Summarize net patient revenues YTD")}
                      className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-semibold cursor-pointer block hover:bg-slate-800"
                    >
                      "Summarize Net Patient Revenues YTD"
                    </button>
                  </div>
                </div>
              )}

              {/* AI response block */}
              {isAiThinking && (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-brand-500 animate-spin" />
                  <span className="text-xs font-mono text-brand-400 uppercase tracking-widest animate-pulse">Running Financial Intelligence Pipeline...</span>
                </div>
              )}

              {aiResponse && (
                <div className="space-y-4 animate-fade-in py-2">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-brand-400 font-bold font-sans text-xs pb-1.5 border-b border-slate-800">
                      <Sparkles className="w-4 h-4 text-brand-400" />
                      AUTOMATED SYNTHETIC ANSWER
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {aiResponse}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => { setAiResponse(null); setSearch(""); }}
                      className="px-3.5 py-1.5 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                    >
                      Clear Answer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate("copilot");
                        onClose();
                        onTriggerToast("Switched to Full Copilot view.", "info");
                      }}
                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                    >
                      Open Full Copilot Console
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Keyboard shortcut footer */}
        <div className="bg-slate-900/80 px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono shrink-0">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded-sm bg-slate-800 text-slate-400">↑↓</span> navigate</span>
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded-sm bg-slate-800 text-slate-400">↵</span> select</span>
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded-sm bg-slate-800 text-slate-400">esc</span> exit</span>
            <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded-sm bg-slate-800 text-slate-400">tab</span> change mode</span>
          </span>
          <span className="text-slate-400 uppercase font-bold tracking-wide">CommonSpirit Intel-Palette</span>
        </div>

      </div>
    </div>
  );
}

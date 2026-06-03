import React, { useEffect, useRef, useState } from "react";
import {
  Clock,
  Download,
  HelpCircle,
  Lock,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  Sun,
} from "lucide-react";
import { UserPersona } from "../types";
import type { ReportingContext } from "../lib/reportingPeriod";
import { getPersonaPreset } from "../config/demoOrg";

export interface AppTopBarProps {
  userPersona: UserPersona;
  utcTimeStr: string;
  theme: "light" | "dark";
  reporting: ReportingContext;
  onToggleTheme: () => void;
  onOpenExport: () => void;
  onOpenTour: () => void;
  onFinalize: () => void;
  onOpenCommandPalette: () => void;
  onOpenMobileSidebar: () => void;
}

function getPersonaProfile(persona: UserPersona) {
  const preset = getPersonaPreset(persona);
  return {
    name: preset.name,
    title: preset.headerTitle,
    fullTitle: preset.role,
    demoNote: preset.demoNote,
    initials: preset.initials,
    grad: preset.grad,
  };
}

export default function AppTopBar({
  userPersona,
  utcTimeStr,
  theme,
  reporting,
  onToggleTheme,
  onOpenExport,
  onOpenTour,
  onFinalize,
  onOpenCommandPalette,
  onOpenMobileSidebar,
}: AppTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profile = getPersonaProfile(userPersona);
  const signoffLabel = userPersona === "cfo" ? "Finalize Review" : "Pre-flight Signoff";

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const iconBtn =
    "p-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 hover:bg-slate-50 dark:hover:bg-ink-700 text-slate-600 dark:text-slate-200 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500";

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-ink-900 border-b border-slate-100 dark:border-white/10 px-4 sm:px-5 py-2.5 shadow-3xs">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left: mobile nav + workspace context (lg+) */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className={`${iconBtn} md:hidden shrink-0`}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span
            className="hidden lg:inline-flex max-w-[220px] xl:max-w-none truncate items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-ink-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10"
            title={reporting.workspaceTooltip}
          >
            <span className="text-brand-700 dark:text-brand-300 shrink-0">
              {reporting.fiscalYearLabel} {reporting.periodLabel}
            </span>
            <span className="text-slate-300 dark:text-slate-600 shrink-0" aria-hidden>
              ·
            </span>
            <span className="truncate font-semibold normal-case tracking-normal text-slate-600 dark:text-slate-300">
              Baseline
            </span>
          </span>

        </div>

        {/* Right: search, primary CTA, overflow menu, profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search: full width label on xl, icon-only lg–xl, icon md */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            id="cmd-k-trigger"
            className={`${iconBtn} md:hidden`}
            aria-label="Search systems"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            id="cmd-k-trigger-tablet"
            className={`${iconBtn} hidden md:flex lg:hidden`}
            aria-label="Search systems"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            id="cmd-k-trigger-desktop"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-ink-800 hover:bg-slate-100 dark:hover:bg-ink-700 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 max-w-[200px] xl:max-w-[240px]"
            aria-label="Search systems"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search…</span>
            <span className="hidden xl:inline text-[9px] bg-slate-200 dark:bg-ink-700 px-1 rounded font-mono font-bold border border-slate-300 dark:border-white/10 shrink-0">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={onFinalize}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0 ${
              userPersona === "cfo"
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
          >
            <Lock className="w-3 h-3 shrink-0" />
            <span className="hidden md:inline">{signoffLabel}</span>
            <span className="md:hidden">Signoff</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={`${iconBtn} ${menuOpen ? "ring-2 ring-brand-500/40" : ""}`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 shadow-lg py-1 z-50 animate-fade-in"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpenExport();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-ink-700 text-left"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  Export Data
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onOpenTour();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-ink-700 text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Take Tour
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onToggleTheme();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-ink-700 text-left"
                >
                  {theme === "dark" ? (
                    <Sun className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
                <div
                  className="mx-2 my-1 border-t border-slate-100 dark:border-white/10"
                  role="separator"
                />
                <div className="px-3 py-2 flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{utcTimeStr || "—"}</span>
                </div>
                <p className="px-3 pb-2 text-[9px] text-slate-400 dark:text-slate-500 leading-snug lg:hidden">
                  {reporting.workspaceTooltip}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-white/10 min-w-0">
            <div className="hidden lg:block text-right min-w-0 max-w-[11rem] xl:max-w-[13rem]">
              <span
                className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-tight truncate"
                title={profile.name}
              >
                {profile.name}
              </span>
              <span
                className="text-[10px] text-slate-500 dark:text-slate-400 block leading-snug font-medium line-clamp-2"
                title={profile.demoNote ? `${profile.fullTitle} · ${profile.demoNote}` : profile.fullTitle}
              >
                {profile.title}
                {profile.demoNote ? " · demo" : ""}
              </span>
            </div>
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 bg-gradient-to-tr ${profile.grad} border border-slate-100 dark:border-white/10 flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}
              title={`${profile.name} · ${profile.fullTitle}`}
            >
              {profile.initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Compact workspace context for sidebar when header chip is hidden (<lg).
 */
export function SidebarWorkspaceContext({
  reporting,
}: {
  reporting: ReportingContext;
}) {
  return (
    <div
      className="lg:hidden rounded-lg border border-ink-800 bg-ink-800/50 px-2.5 py-2"
      title={reporting.workspaceTooltip}
    >
      <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Workspace</div>
      <div className="text-[10px] font-semibold text-slate-200 mt-0.5 leading-snug">
        {reporting.workspaceChipShort}
      </div>
    </div>
  );
}

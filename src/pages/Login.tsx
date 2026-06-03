import React, { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Check, Sparkles } from "lucide-react";
import { UserPersona } from "../types";
import BrandLogo from "../components/BrandLogo";
import { SparkMark, BrandSweep } from "../components/BrandMotif";
import { PERSONA_PRESETS as DEMO_PERSONAS } from "../config/demoOrg";
import {
  JOB_REQ_BANNER,
  RECRUITER_CLICK_PATH,
} from "../constants/recruiterHandoff";

interface LoginProps {
  onLogin: (persona: UserPersona) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("demo.analyst@worksample.demo");
  const [password, setPassword] = useState("demo");
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>("analyst");
  const [isLoading, setIsLoading] = useState(false);

  const PERSONA_PRESETS = DEMO_PERSONAS;

  const handlePersonaSelect = (preset: (typeof PERSONA_PRESETS)[0]) => {
    setSelectedPersona(preset.persona);
    setEmail("demo.analyst@worksample.demo");
    setPassword("demo");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedPersona);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-white text-ink-900 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      <div className="bg-brand-900 text-white text-center py-2 px-4 text-[10px] sm:text-xs font-medium leading-snug relative z-20">
        {JOB_REQ_BANNER}
      </div>

      <BrandSweep tone="light" className="absolute inset-x-0 bottom-0 h-[60vh] w-full pointer-events-none" />
      <div className="absolute top-[-10rem] right-[-8rem] w-[34rem] h-[34rem] bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-ink-900/5 pb-4 pt-4">
        <BrandLogo height={30} />
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100 uppercase tracking-wide">
          Finance work sample
        </span>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-8">
        <div className="lg:col-span-7 space-y-6 text-left pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-2">
            <SparkMark size={26} />
            <span className="text-sm font-semibold text-brand-700 font-display">Hello humankindness</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink-900 leading-[1.05]">
            Month-end healthcare finance,
            <span className="block text-brand-600">variance &amp; close support.</span>
          </h2>

          <p className="text-ink-700/80 text-sm md:text-base leading-relaxed max-w-xl">
            CommonSpirit-inspired scenario for the Sr Financial Analyst role: budget variance reporting,
            forecast walk, service-line insight, and recommendations for market finance leaders — across
            Houston and comparison markets on synthetic data only.
          </p>

          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
              5-minute reviewer path
            </span>
            <ol className="list-decimal list-inside text-[11px] text-ink-800/90 space-y-1">
              {RECRUITER_CLICK_PATH.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-ink-900/5 rounded-2xl p-4 space-y-1 shadow-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Variance &amp; forecast
              </span>
              <p className="text-[11px] text-ink-700/70 leading-normal">
                Close-month spend, budget variance, and forecast walk for market report-outs.
              </p>
            </div>
            <div className="bg-white border border-ink-900/5 rounded-2xl p-4 space-y-1 shadow-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> Excel handoff
              </span>
              <p className="text-[11px] text-ink-700/70 leading-normal">
                Column dictionary and 64 close-month rows — opens in Excel or Google Sheets.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 w-full max-w-md mx-auto relative">
          <div className="bg-white border border-ink-900/8 rounded-3xl p-6 md:p-8 shadow-xl shadow-brand-900/5 ring-1 ring-black/5 relative">
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-ink-900 tracking-tight font-display">View work sample</h3>
              <p className="text-xs text-ink-700/60">
                Choose a demo role preset — not a live CommonSpirit account.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">
                  Demo email (not your account)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-700/40">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-brand-50/40 border border-ink-900/10 rounded-xl py-2.5 px-10 text-xs text-ink-900 placeholder-ink-700/40 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 transition-all"
                    placeholder="demo.analyst@worksample.demo"
                  />
                </div>
                <p className="text-[9px] text-ink-700/55 leading-snug">
                  Use any demo email — this is not SSO or an @commonspirit.org account.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">
                  Demo access (optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-700/40">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-50/40 border border-ink-900/10 rounded-xl py-2.5 px-10 text-xs text-ink-900 placeholder-ink-700/40 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 transition-all"
                    placeholder="demo"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">
                  Demo role preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PERSONA_PRESETS.map((preset) => {
                    const isSelected = selectedPersona === preset.persona;
                    return (
                      <button
                        key={preset.persona}
                        type="button"
                        onClick={() => handlePersonaSelect(preset)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-brand-50 border-brand-400 text-brand-800 ring-1 ring-brand-300"
                            : "bg-white border-ink-900/8 text-ink-700/70 hover:border-brand-200 hover:bg-brand-50/40"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                          <span>{preset.emoji}</span>
                          <span className="truncate">{preset.role.split("—")[0].trim()}</span>
                        </div>
                        <span className="text-[9px] text-ink-700/50 block leading-tight mt-0.5 truncate">
                          {preset.name}
                        </span>
                        {preset.persona === "analyst" && (
                          <span className="text-[8px] text-amber-700/90 block mt-1 leading-tight">
                            Demo role — not employed at CommonSpirit
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                  isLoading
                    ? "bg-brand-600/70 text-white cursor-wait"
                    : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md hover:shadow-brand-600/20"
                }`}
              >
                {isLoading ? (
                  <span>Opening work sample…</span>
                ) : (
                  <>
                    <span>View work sample</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center border-t border-ink-900/5 pt-4 pb-2 text-[10px] text-ink-700/50">
        <p className="mt-1 font-mono">
          Concept prototype · not affiliated with or endorsed by CommonSpirit Health · synthetic ledger · no
          PHI.
        </p>
      </footer>
    </div>
  );
}

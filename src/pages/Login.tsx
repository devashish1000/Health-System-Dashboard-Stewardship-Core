import React, { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, RefreshCcw, Check, Sparkles } from "lucide-react";
import { UserPersona } from "../types";
import BrandLogo from "../components/BrandLogo";
import { SparkMark, BrandSweep } from "../components/BrandMotif";

interface LoginProps {
  onLogin: (persona: UserPersona) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("strategic.analyst@commonspirit.org");
  const [password, setPassword] = useState("••••••••");
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>("analyst");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-completion presets for sandbox personas
  const PERSONA_PRESETS: { persona: UserPersona; name: string; email: string; role: string; desc: string; emoji: string }[] = [
    {
      persona: "analyst",
      name: "Devashish Neupane",
      email: "strategic.analyst@commonspirit.org",
      role: "Strategic Analyst",
      desc: "Full baseline data access and control tower insights",
      emoji: "👔"
    },
    {
      persona: "cfo",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@commonspirit.org",
      role: "Regional CFO",
      desc: "CFO sign-off capabilities and cycle close tools",
      emoji: "💼"
    },
    {
      persona: "director",
      name: "Dr. Aris Vance",
      email: "clinical.director@commonspirit.org",
      role: "Clinical Director",
      desc: "Service line audits and clinic operations control",
      emoji: "⚕️"
    },
    {
      persona: "auditor",
      name: "Marcus Brody",
      email: "marcus.brody@commonspirit.org",
      role: "Compliance Auditor",
      desc: "Pixel auditor checklists and regulatory review",
      emoji: "🔍"
    }
  ];

  const handlePersonaSelect = (preset: typeof PERSONA_PRESETS[0]) => {
    setSelectedPersona(preset.persona);
    setEmail(preset.email);
    setPassword("password123");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate standard secure enterprise AD handshake response delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin(selectedPersona);
      }, 700);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-ink-900 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Signature CommonSpirit sweep — kept light and tertiary per brand system */}
      <BrandSweep tone="light" className="absolute inset-x-0 bottom-0 h-[60vh] w-full pointer-events-none" />
      <div className="absolute top-[-10rem] right-[-8rem] w-[34rem] h-[34rem] bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-ink-900/5 pb-4">
        <BrandLogo height={30} />
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100 uppercase tracking-wide">
            Financial Performance Control Tower
          </span>
        </div>
      </header>

      {/* Hero & Login Module Grid */}
      <main className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-8">

        {/* Left Side: Editorial Introduction (build from white) */}
        <div className="lg:col-span-7 space-y-6 text-left pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-2">
            <SparkMark size={26} />
            <span className="text-sm font-semibold text-brand-700 font-display">Hello humankindness</span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-ink-900 leading-[1.05]">
            The power of humankindness,
            <span className="block text-brand-600">in your numbers.</span>
          </h2>

          <p className="text-ink-700/80 text-sm md:text-base leading-relaxed max-w-xl">
            Replace the month-end spreadsheet grind. Pinpoint where margin is leaking across every service line,
            forecast volume-to-revenue in real time, and certify board-ready variances your CFO can sign off on — so more of every dollar goes back to the communities and care that humankindness is built on.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-white border border-ink-900/5 rounded-2xl p-4 space-y-1 shadow-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-700 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Simulation Sandbox
              </span>
              <p className="text-[11px] text-ink-700/70 leading-normal">
                Model rate, payer-mix, and volume scenarios across facilities and see the margin impact instantly — no rebuilding spreadsheets for every what-if.
              </p>
            </div>
            <div className="bg-white border border-ink-900/5 rounded-2xl p-4 space-y-1 shadow-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> Audit-Ready Sign-off
              </span>
              <p className="text-[11px] text-ink-700/70 leading-normal">
                Every number carries a certified, traceable sign-off — so you close cycles faster and walk into board and audit reviews with defensible numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Persona Switcher */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto relative">
          <div className="bg-white border border-ink-900/8 rounded-3xl p-6 md:p-8 shadow-xl shadow-brand-900/5 ring-1 ring-black/5 relative">

            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-bold text-ink-900 tracking-tight font-display">Sign in to your workspace</h3>
              <p className="text-xs text-ink-700/60">Choose a role preset or enter credentials to enter the control tower.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">Authorized Email</label>
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
                    placeholder="name@commonspirit.org"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">Security Access PIN</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-700/40">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-brand-50/40 border border-ink-900/10 rounded-xl py-2.5 px-10 text-xs text-ink-900 placeholder-ink-700/40 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 transition-all"
                    placeholder="Enter security access key"
                  />
                </div>
              </div>

              {/* Persona Selector Grid */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-ink-700/70 uppercase tracking-wider block">Authorized Role Preset</label>
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
                          <span className="truncate">{preset.role.split(" ")[1] || preset.role}</span>
                        </div>
                        <span className="text-[9px] text-ink-700/50 block leading-tight mt-0.5 truncate">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500/40 ${
                  isSuccess
                    ? "bg-emerald-600 text-white"
                    : isLoading
                    ? "bg-brand-600/70 text-white cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-md hover:shadow-brand-600/20"
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Access granted! Loading control tower…</span>
                  </>
                ) : isLoading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Contacting Active Directory…</span>
                  </>
                ) : (
                  <>
                    <span>Enter Control Tower</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center border-t border-ink-900/5 pt-4 text-[10px] text-ink-700/50">
        <p>© {new Date().getFullYear()} CommonSpirit Stewardship Governance Committee. All rights reserved.</p>
        <p className="mt-1 font-mono">
          Concept prototype · not affiliated with or endorsed by CommonSpirit Health · synthetic ledger · no PHI.
        </p>
      </footer>
    </div>
  );
}

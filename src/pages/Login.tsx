import React, { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, RefreshCcw, Check } from "lucide-react";
import { UserPersona } from "../types";
import BrandLogo from "../components/BrandLogo";

interface LoginProps {
  onLogin: (persona: UserPersona) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("analyst.dev@commonspirit.org");
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-6 relative overflow-hidden font-sans text-slate-100">
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-600/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-600/10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

      {/* Top Brand Tagline */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <BrandLogo chip height={28} />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-slate-300 border border-white/10 uppercase">
            Active Workspace Gateway
          </span>
        </div>
      </header>

      {/* Hero & Login Module Grid */}
      <main className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-8">
        
        {/* Left Side: Editorial Introduction Block */}
        <div className="lg:col-span-7 space-y-6 text-left pr-0 lg:pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Built for Health-System Finance Teams</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The power of humankindness, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">in your numbers</span>
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Replace the month-end spreadsheet grind. Pinpoint where margin is leaking across every service line,
            forecast volume-to-revenue in real time, and certify board-ready variances your CFO can sign off on — so more of every dollar can go back to the communities and care that humankindness is built on.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest block">Simulation Sandbox</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Model rate, payer-mix, and volume scenarios across facilities and see the margin impact instantly — no rebuilding spreadsheets for every what-if.
              </p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-1">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Audit-Ready Sign-off</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Every number carries a certified, traceable sign-off — so close cycles faster and walk into board and audit reviews with defensible numbers.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Persona Switcher */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto relative">
          <div className="bg-slate-950/45 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative">
            
            {/* Header Form */}
            <div className="text-center space-y-1 mb-6">
              <h3 className="text-lg font-bold text-white tracking-tight">Enterprise Credentials</h3>
              <p className="text-xs text-slate-400">Select representing preset or enter temporary text to log in.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authorized Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="name@commonspirit.org"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Access PIN</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    placeholder="Enter security access key"
                  />
                </div>
              </div>

              {/* Persona Selector Carousel/Grid inside login container */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Authorized Role Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {PERSONA_PRESETS.map((preset) => {
                    const isSelected = selectedPersona === preset.persona;
                    return (
                      <button
                        key={preset.persona}
                        type="button"
                        onClick={() => handlePersonaSelect(preset)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-brand-600/20 border-brand-500 text-brand-300"
                            : "bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs truncate">
                          <span>{preset.emoji}</span>
                          <span className="truncate">{preset.role.split(" ")[1] || preset.role}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 block leading-tight mt-0.5 truncate">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submitting Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccess
                    ? "bg-emerald-600 text-white"
                    : isLoading
                    ? "bg-brand-600/70 text-slate-200 cursor-not-allowed"
                    : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/10"
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Access Granted! Loading Control Tower...</span>
                  </>
                ) : isLoading ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>Contacting Active Directory...</span>
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

      {/* Footer System Audit Info */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center border-t border-white/5 pt-4 text-[10px] text-slate-500">
        <p>© 2026 CommonSpirit Stewardship Governance Committee. All rights reserved.</p>
        <p className="mt-1 font-mono">Environment Status: Mock Sandbox Interface Active. Credentials bypass mode remains operational.</p>
      </footer>
    </div>
  );
}

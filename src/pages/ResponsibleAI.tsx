import React from "react";
import {
  ShieldAlert, BookOpen, Compass, ShieldCheck, Mail, Linkedin, Globe, MapPin, 
  Terminal, Award, Star, UserCheck
} from "lucide-react";
import PagePurpose from "../components/PagePurpose";
import PageHeader from "../components/PageHeader";
import { bodyMuted, captionText, dangerMeta, dangerTitle } from "../lib/typography";

export default function ResponsibleAI() {
  const profile = {
    name: "Devashish Neupane",
    tagline: "Healthcare finance · Sr Financial Analyst work sample",
    email: "devashish1000@gmail.com",
    linkedin: "linkedin.com/in/devashish-neupane",
    roleSummary:
      "Healthcare finance work sample for the Sr Financial Analyst role (Req 2026-469831): multi-market stewardship dashboard with expense predictability, budget variance, initiative ROI reporting for market finance leaders, and Houston / Baylor St. Luke's as a flagship example market. Forecasting, KPI reporting, executive dashboards, and AI-assisted workflow design support month-end close storytelling. CommonSpirit-inspired labels only — synthetic ledger, not affiliated with or endorsed by CommonSpirit Health.",
    priorExperience: [
      "Southwest Airlines — analytics, forecasting, and operational performance reporting",
      "LinkedIn — business intelligence, KPI reporting, and executive dashboard design",
    ],
    skills: [
      "SQL", "Python", "Tableau", "Alteryx", "Forecasting", "KPI Reporting", 
      "Dashboard Design", "Financial Analytics", "Operational Analytics", 
      "Budget Variance Analysis", "Executive Reporting", "AI Workflow Design"
    ]
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-4 animate-fade-in">

      <div className="rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-950/40 px-4 py-3 text-center">
        <p className="text-xs font-bold text-brand-800 dark:text-brand-200 tracking-wide">
          Built for recruiter / hiring manager review
        </p>
      </div>
      
      <PageHeader
        title="Responsible AI & Ethical Integrity Platform"
        subtitle="Ethical system guardrails, intended use criteria, and professional portfolio bio."
        icon={ShieldCheck}
      />

      <PagePurpose
        title="Why this page matters"
        what="Guardrails, intended-use limits, and a synthetic-data statement."
        value="Builds trust that AI supports — not replaces — human decisions."
        icon={ShieldCheck}
      />

      {/* Ethical Guardrails Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Synthetic Data Statement Card */}
        <div className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-3xs space-y-3">
          <h3 className="font-bold text-sm text-ink-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 block shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span>Synthetic Data Statement</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
            “This prototype uses fully synthetic data created for demonstration purposes. It does not use patient data, provider data, claim data, financial records, or confidential CommonSpirit information.”
          </p>
        </div>

        {/* Responsible AI Statement */}
        <div className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-3xs space-y-3">
          <h3 className="font-bold text-sm text-ink-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600 block shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span>Responsible AI Statement</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold bg-slate-50 dark:bg-ink-900 p-4 rounded-2xl border border-slate-100 dark:border-white/10">
            “AI-assisted insights in this prototype are designed for decision support only. Human review is required for all financial, operational, compliance, and leadership decisions.”
          </p>
        </div>

        {/* Intended Use Cases */}
        <div className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-3xs space-y-3">
          <h3 className="font-bold text-sm text-ink-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 block shrink-0">
              <Compass className="w-4 h-4" />
            </span>
            <span>Intended Use Cases</span>
          </h3>
          <p className={`text-xs leading-relaxed font-medium ${bodyMuted}`}>
            “This prototype is intended to demonstrate analytics workflow design, healthcare finance dashboarding, budget variance analysis, margin forecasting, financial driver explanation, and executive storytelling.”
          </p>
          <div className={`text-[10px] font-mono ${captionText}`}>
            Focus: Business intelligence interface modeling
          </div>
        </div>

        {/* Prohibited Out of Scope Use Cases */}
        <div className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-3xl p-6 shadow-3xs space-y-3">
          <h3 className={`font-bold text-sm flex items-center gap-2 ${dangerTitle}`}>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 block shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span>Not Intended For</span>
          </h3>
          <p className={`text-xs leading-relaxed font-medium ${bodyMuted}`}>
            “This prototype is not intended to make financial approvals, compliance rulings, clinical decisions, billing determinations, employment decisions, or hiring decisions.”
          </p>
          <div className={`text-[10px] font-mono ${dangerMeta}`}>
            Notice: Absolute execution barrier in place
          </div>
        </div>

      </div>

      {/* Developer Professional Profile Section - Portrayed beautifully */}
      <div className="border-t border-slate-100 dark:border-white/10 pt-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-6 flex items-center gap-1.5">
          <Terminal className="w-4 h-4" /> Developer Professional Profile
        </h3>
        
        <div className="bg-gradient-to-br from-ink-900 to-ink-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-44 h-44 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-2xl font-extrabold tracking-tight font-sans text-white">
                    {profile.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-sky-500/20 text-sky-200 border border-sky-400/20 px-2 py-0.5 rounded-full font-bold">
                    <UserCheck className="w-3 h-3" /> Certified BI Analyst
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-wide text-sky-200">
                  {profile.tagline}
                </p>
              </div>

              {/* Direct Portfolio Contacts */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" /> {profile.email}
                </a>
                <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-sky-300 animate-pulse" /> San Francisco Bay Area
                </span>
              </div>
            </div>

            {/* Role-focused summary */}
            <div className="space-y-2">
              <span className="text-[10px] text-sky-300 uppercase font-bold tracking-widest block">About — Sr Financial Analyst fit</span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {profile.roleSummary}
              </p>
            </div>

            {/* Prior experience */}
            <div className="space-y-2">
              <span className="text-[10px] text-sky-300 uppercase font-bold tracking-widest block">Prior experience</span>
              <ul className="text-xs text-slate-300 leading-relaxed font-medium space-y-1.5 list-disc list-inside">
                {profile.priorExperience.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Skills grid list */}
            <div className="space-y-3">
              <span className="text-[10px] text-sky-300 uppercase font-bold tracking-widest block">Specialist Skills & Core Competency Matricies</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-bold font-mono bg-sky-500/10 text-sky-200 border border-sky-400/10 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

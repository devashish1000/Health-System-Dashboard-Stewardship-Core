import React, { useState } from "react";
import { 
  X, Check, AlertTriangle, ShieldCheck, FileText, Edit3, Award, 
  ArrowRight, ArrowLeft, Terminal, Server, Sparkles, User, RefreshCw
} from "lucide-react";
import { FinanceRecord, CertifiedSignoff, UserPersona } from "../types";

interface FinalizeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: FinanceRecord[];
  userPersona: UserPersona;
  onAddSignoff: (signoff: CertifiedSignoff) => void;
  onTriggerToast: (text: string, type: "success" | "info" | "warning") => void;
}

export default function FinalizeReviewModal({
  isOpen,
  onClose,
  records,
  userPersona,
  onAddSignoff,
  onTriggerToast
}: FinalizeReviewModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [name, setName] = useState(userPersona === "cfo" ? "Sarah Jenkins" : "Devashish Neupane");
  const [title, setTitle] = useState(userPersona === "cfo" ? "Regional CFO" : "Senior Strategic Analyst");
  const [comments, setComments] = useState("");
  const [certified1, setCertified1] = useState(false);
  const [certified2, setCertified2] = useState(false);
  const [signatureText, setSignatureText] = useState("");
  const [generatedCert, setGeneratedCert] = useState<CertifiedSignoff | null>(null);

  if (!isOpen) return null;

  // Calculators
  const totalRecords = records.length;
  const unfavorableRecords = records.filter(r => r.variance_status === "Unfavorable");
  const watchlistRecords = records.filter(r => r.variance_status === "Watchlist");
  
  // Count unannotated anomalies
  const unannotatedAnomaliesCount = records.filter(
    r => (r.variance_status === "Unfavorable" || r.variance_status === "Watchlist") && !r.variance_note.trim()
  ).length;

  const averageOperatingMargin = records.length > 0 
    ? parseFloat((records.reduce((sum, r) => sum + r.operating_margin, 0) / records.length).toFixed(2))
    : 0;

  // Generate mock cryptography certificate
  const handleCompileCertificate = () => {
    if (!name.trim() || !title.trim()) {
      onTriggerToast("Please fill out your complete name and professional title.", "warning");
      return;
    }
    if (!certified1 || !certified2) {
      onTriggerToast("You must confirm all board certification attestations to proceed.", "warning");
      return;
    }
    if (!signatureText.trim()) {
      onTriggerToast("You must type your full name in the digital signature field to sign your review.", "warning");
      return;
    }

    // MD5 mock hash
    const timestamp = new Date().toISOString();
    const mockHashInputString = `${name}-${timestamp}-${JSON.stringify(records.length)}`;
    let hash = "";
    for (let i = 0; i < mockHashInputString.length; i++) {
      hash += mockHashInputString.charCodeAt(i).toString(16);
    }
    const finalHash = "CS-" + hash.toUpperCase().substring(0, 16);

    const certificate: CertifiedSignoff = {
      id: `CS-SL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: timestamp,
      signatoryName: name,
      signatoryTitle: title,
      modelCode: "COMMONSPIRIT-STU-V1.0",
      hash: finalHash,
      activeMargin: averageOperatingMargin,
      unresolvedCount: unannotatedAnomaliesCount,
      comments: comments,
      approvedScopes: [
        "Regional Net Patient Revenue",
        "Clinical Supply Cost Allocation",
        "Premium Agency Nursing Ratios"
      ]
    };

    setGeneratedCert(certificate);
    onAddSignoff(certificate);
    onTriggerToast("Certified Month-End Sign-off Ledger committed successfully.", "success");
    setStep(4);
  };

  const isCFO = userPersona === "cfo";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-xl max-w-xl w-full overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">

        {/* Header Banner */}
        <div className="bg-ink-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-100">
                Stewardship Ledger Sign-off
              </h3>
              <p className="text-[10px] text-slate-400">CommonSpirit Regulatory Compliance Framework</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progression Indicators */}
        <div className="bg-slate-50 dark:bg-ink-900 border-b border-slate-100 dark:border-white/10 px-6 py-3 flex items-center justify-between text-[11px] shrink-0 font-semibold text-slate-400 dark:text-slate-400">
          <div className={`flex items-center gap-1 ${step >= 1 ? "text-brand-600 font-bold" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 1 ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"}`}>1</span>
            <span>Pre-flight Audit</span>
          </div>
          <div className="h-0.5 bg-slate-200 w-8" />
          <div className={`flex items-center gap-1 ${step >= 2 ? "text-brand-600 font-bold" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 2 ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
            <span>Attestation</span>
          </div>
          <div className="h-0.5 bg-slate-200 w-8" />
          <div className={`flex items-center gap-1 ${step >= 3 ? "text-brand-600 font-bold" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 3 ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
            <span>Signature</span>
          </div>
          <div className="h-0.5 bg-slate-200 w-8" />
          <div className={`flex items-center gap-1 ${step >= 4 ? "text-emerald-600 font-bold" : ""}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${step >= 4 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>4</span>
            <span>Certificate</span>
          </div>
        </div>

        {/* Body Content Scrollbox */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
          
          {/* STEP 1: PRE-FLIGHT AUDIT */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Review Active Operating Metrics</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">Validate baseline coordinates prior to committing final sign-off audits.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-semibold block">Operating Margin Average</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1 block">{averageOperatingMargin}%</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 mt-0.5 block">Budget target threshold is 8.5%</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-ink-900 rounded-2xl border border-slate-100 dark:border-white/10">
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-semibold block">Total Dataset Coverage</span>
                  <span className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mono mt-1 block">{totalRecords} Records</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 mt-0.5 block">Active medical clinic clusters</span>
                </div>
              </div>

              {/* Warnings Checklist */}
              <div className="p-4 rounded-2xl border border-brand-50/50 bg-brand-50/20 space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-500" /> Compliance Validation Diagnostic Checks
                </h5>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>Handoff ledger format compliant (COMMONSPIRIT-STU-V1.0)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {unannotatedAnomaliesCount > 0 ? (
                      <span className="p-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    <span>
                      {unannotatedAnomaliesCount > 0 
                        ? `${unannotatedAnomaliesCount} outstanding anomalies lack dedicated variance notes annotations.`
                        : "All significant operating variances fully annotated!"
                      }
                    </span>
                  </li>
                </ul>
              </div>

              {/* Warning about roles */}
              {!isCFO && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 flex gap-3 text-xs leading-relaxed">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-amber-900 block">Strategic Analyst Persona Warning</span>
                    <p className="text-[11px] text-amber-800">
                      You are logged in as **Strategic Analyst (Devashish Neupane)**. Hospital directive dictates that only the Regional CFO has authority to submit final closed cycle certifications. Switching your workspace persona to Regional CFO is recommended to carry out standard closing signatures.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: ATTESTATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Regulatory Attestation Affirmations</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">Officially certify that synthetic records are reviewed and structured according to board directives.</p>
              </div>

              <div className="space-y-3.5">
                {/* Board User Credentials fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">Signatory Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-white/10 dark:bg-ink-900 dark:text-slate-100 rounded-xl text-xs font-semibold focus:outline-brand-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">Professional Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 dark:border-white/10 dark:bg-ink-900 dark:text-slate-100 rounded-xl text-xs font-semibold focus:outline-brand-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2.5 pt-2">
                  <label className="flex items-start gap-3 p-3 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-ink-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certified1}
                      onChange={(e) => setCertified1(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 mt-0.5 accent-brand-600"
                    />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">Affirm Metric Accuracy</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-400 leading-normal">
                        I certify that these performance ratios correctly aggregate the hospital service lines, Net Patient Revenue variances, and labor ratios.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-ink-900 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certified2}
                      onChange={(e) => setCertified2(e.target.checked)}
                      className="w-4 h-4 text-brand-600 rounded border-slate-300 mt-0.5 accent-brand-600"
                    />
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">Verify Explanation Annotations</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-400 leading-normal">
                        I confirm that all structural budget variances have been investigated, with corresponding corrective stewardship notes logged appropriately.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL SIGNATURE & SECURE PREVIEW */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Digitally Seal Transaction</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-400">Seal this financial report with your authorized calligraphy digital signature.</p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">Type full name to create seal</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-white/10 dark:bg-ink-900 dark:text-slate-100 rounded-xl text-xs font-semibold focus:outline-brand-500"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                  />
                </div>

                {signatureText && (
                  <div className="p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-ink-900 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span className="text-[8px] text-slate-400 font-bold font-mono">MD5 VERIFIED</span>
                    </div>
                    
                    <span className="font-[serif] italic text-3xl font-semibold tracking-wide text-brand-800 my-4 text-center">
                      {signatureText}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-2">
                      Authorized Signature Seal • CommonSpirit Health System
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wide">Compliance Audit Comments (Optional)</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 border border-slate-200 dark:border-white/10 dark:bg-ink-900 dark:text-slate-100 rounded-xl text-xs placeholder:text-slate-400"
                    placeholder="Enter senior leadership notes, system variances explanation, or directive offsets..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: LEDGER BLOCK GENERATED SUCCESS */}
          {step === 4 && generatedCert && (
            <div className="space-y-4 animate-fade-in text-center flex flex-col items-center">
              
              <div className="p-3.5 rounded-full bg-emerald-100 text-emerald-600 animate-pulse mt-2">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-md">Cycle Certification Registered</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">The month-end performance report has been digitally secured and appended to the ledger.</p>
              </div>

              {/* Certificate Ribbon Card */}
              <div className="w-full p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-ink-900 space-y-3.5 text-left shadow-3xs">
                <div className="flex justify-between items-center text-[10px] font-mono border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="font-bold text-slate-400">GENUINE AUDIT BLOCK</span>
                  <span className="text-emerald-600 font-extrabold">{generatedCert.modelCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium">
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Assigned Signatory</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{generatedCert.signatoryName}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{generatedCert.signatoryTitle}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Certification Hash</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-100 text-[10px] block truncate">{generatedCert.hash}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Average Margin Level</span>
                    <span className="font-bold font-mono text-brand-700">{generatedCert.activeMargin}% Margin</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-400 uppercase tracking-wider block">Outstanding Warnings</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{generatedCert.unresolvedCount} items</span>
                  </div>
                </div>

                {generatedCert.comments && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Certifier Remarks:</span>
                    <p className="italic bg-white dark:bg-ink-800 p-2 rounded-lg border border-slate-100 dark:border-white/10">{generatedCert.comments}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 dark:bg-ink-900 px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between shrink-0">
          <div>
            {step < 4 ? (
              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700"
              >
                Cancel
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 dark:text-slate-400 font-mono font-bold">LEDGER UPDATED</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-3 py-1.5 border border-slate-200 dark:border-white/10 dark:text-slate-100 font-semibold text-xs rounded-xl flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-ink-800 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 2 && (!certified1 || !certified2)) {
                    onTriggerToast("You must confirm all board certification attestations to proceed.", "warning");
                    return;
                  }
                  setStep((prev) => (prev + 1) as any);
                }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-brand-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : step === 3 ? (
              <button
                onClick={handleCompileCertificate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-emerald-50 cursor-pointer"
              >
                Certify & Sign Cycle <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-ink-900 hover:bg-ink-800 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Close Operational Window
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

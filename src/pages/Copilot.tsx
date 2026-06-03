import React, { useState, useRef, useEffect } from "react";
import {
  Cpu, Send, AlertCircle, FileText, ChevronRight, HelpCircle, Loader, RefreshCw, 
  Sparkles, Bot, User, CheckCircle, Share2, Clipboard, Printer
} from "lucide-react";
import { askGeminiFinance, CopilotResponse } from "../lib/ai";
import { SYNTHETIC_RECORDS } from "../data/syntheticFinanceData";
import { formatCount, formatCurrency, formatPercent } from "../lib/formatters";
import PagePurpose from "../components/PagePurpose";
import PageHeader from "../components/PageHeader";
import { bodyMuted, brandText, captionText, inputPlaceholder, metaText, titleText } from "../lib/typography";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isMock?: boolean;
}

const QUESTION_CHIPS = [
  "Why is operating margin below target?",
  "What drove unfavorable budget variance?",
  "Which service line needs attention?",
  "How much of the variance is labor-driven?",
  "What changed this month?",
  "Which facility has the highest expense pressure?"
];

const LEDGER_MONTH = "2026-05";

export default function Copilot() {
  const ledgerSnapshot = React.useMemo(() => {
    const records = SYNTHETIC_RECORDS.filter((r) => r.month === LEDGER_MONTH);
    if (records.length === 0) {
      return { recordCount: 0, totalNpr: 0, avgMargin: 0 };
    }
    const totalNpr = records.reduce((sum, r) => sum + r.net_patient_revenue, 0);
    const avgMargin = records.reduce((sum, r) => sum + r.operating_margin, 0) / records.length;
    return { recordCount: records.length, totalNpr, avgMargin };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `### Welcome to the Healthcare Finance Co-pilot

I am your dedicated decision-support intelligence assistant. I can help synthesize complex financial structures, explain budget deviations, and write draft summaries for clinical stakeholders.

**How can I assist your team today?** Select one of the quick driver audit questions below or enter a custom search in the co-pilot console.`,
      isMock: true
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState("Calibrating ledger...");
  const [isBriefGenerated, setIsBriefGenerated] = useState(false);
  const [generatedBriefText, setGeneratedBriefText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const loadingPhrases = [
    "Interrogating synthetic ledger...",
    "Scanning cardiology prior authorization logs...",
    "Summing clinical registry labor expenses...",
    "Drafting stewardship assessment...",
    "Grounding response in nonprofit mission principles..."
  ];

  // Cycles loading messages to feel premium
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      let counter = 0;
      interval = setInterval(() => {
        counter = (counter + 1) % loadingPhrases.length;
        setCurrentLoadingMessage(loadingPhrases[counter]);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setInputText("");

    try {
      const response = await askGeminiFinance(textToSend);
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        isMock: response.isMock
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: `### Co-pilot Connection Issue\n\nI was unable to secure a transaction link to the central Gemini model. However, our local analytics fail-safe continues to work perfectly.\n\n*Review actions: Validate the VITE_GEMINI_API_KEY value inside Settings > Secrets.*`,
        isMock: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateBrief = async () => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `usr-brief-${Date.now()}`,
        sender: "user",
        text: "Generate a comprehensive executive finance stewardship brief."
      }
    ]);

    try {
      const response = await askGeminiFinance("generate a leadership-ready finance brief.");
      setGeneratedBriefText(response.text);
      setIsBriefGenerated(true);
      
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-brief-${Date.now()}`,
          sender: "bot",
          text: response.text,
          isMock: response.isMock
        }
      ]);
    } catch (e) {
      setIsBriefGenerated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Render inline markdown bold (**text**) within a line as <strong> segments
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  // Convert markdown-style response to structured elements safely for layout pairing
  const parseMarkdownHtml = (text: string) => {
    // Basic formatting for a clean portfolio layout
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h4 key={idx} className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-4 mb-2 first:mt-0">{renderInline(trimmed.replace(/^#+/, "").trim())}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx} className={`font-bold text-md mt-5 mb-3 border-b border-slate-100 dark:border-white/10 pb-1 ${brandText}`}>{renderInline(trimmed.replace(/^#+/, "").trim())}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx} className="font-extrabold text-ink-900 dark:text-slate-100 text-lg mt-6 mb-4">{renderInline(trimmed.replace(/^#+/, "").trim())}</h2>;
      }
      if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.indexOf("**", 2) === trimmed.length - 2) {
        return <p key={idx} className={`text-xs font-bold my-2 ${brandText}`}>{trimmed.replace(/\*\*/g, "")}</p>;
      }
      // Bullets require a space after the marker ("* " or "- ") so that lines
      // beginning with inline bold (e.g. "**Heading** text") aren't mistaken
      // for list items.
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return (
          <li key={idx} className={`text-xs list-disc ml-5 mb-1 bg-transparent border-none p-0 inline-block w-full ${bodyMuted}`}>
            {renderInline(trimmed.substring(1).trim())}
          </li>
        );
      }
      if (trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.")) {
        return <p key={idx} className={`text-xs font-semibold ml-4 my-1 ${bodyMuted}`}>{renderInline(trimmed)}</p>;
      }
      if (!trimmed) return <div key={idx} className="h-2" />;
      return <p key={idx} className={`text-xs leading-relaxed my-1.5 ${bodyMuted}`}>{renderInline(trimmed)}</p>;
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-4 animate-fade-in">
      
      <PageHeader
        title="AI Finance Copilot"
        subtitle="Smart financial assistant leveraging Google Gemini for executive reporting, budget walks, and operational analysis."
        icon={Cpu}
        trailing={
          <button
            onClick={handleGenerateBrief}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-55 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <FileText className="w-4 h-4" /> Synthesize Executive Brief
          </button>
        }
      />

      <PagePurpose
        title="Why this page matters"
        what="Ask plain-English finance questions, grounded in the data."
        value="Turns raw tables into a board-ready brief in minutes, not hours."
        stat={{ label: "Brief time", value: "hrs → min" }}
        icon={Cpu}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Chat Stream Panel (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-ink-800 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm flex flex-col h-[520px] overflow-hidden">

          {/* Header */}
          <div className="bg-ink-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Secure Copilot Instance
                </h3>
                <span className="text-[10px] text-slate-400 block font-mono">Model: Gemini 2.5 Flash Protocol</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    sender: "bot",
                    text: `### Session reset. I can assist in examining budget variances, calculating labor overrides, or preparing board documents. What targets are we focusing on?`
                  }
                ]);
                setIsBriefGenerated(false);
              }}
              className="text-xs font-semibold text-[#38BDF8] hover:text-white flex items-center gap-1 transition-colors"
            >
              Reset Session
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 dark:bg-ink-900">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-xl ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${isBot ? "bg-ink-900 text-white" : "bg-brand-600 text-white"}`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-3xl shadow-3xs text-xs relative ${isBot ? `surface-readable bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 ${bodyMuted} rounded-tl-none` : "bg-ink-900 border border-slate-800 text-white rounded-tr-none"}`}>
                    <div className="space-y-1">
                      {isBot ? parseMarkdownHtml(msg.text) : <p className="leading-relaxed font-semibold">{msg.text}</p>}
                    </div>

                    {isBot && msg.isMock && (
                      <span className="text-[8px] uppercase tracking-wide text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-800/50 px-1.5 py-0.5 rounded-sm mt-3 inline-block font-bold">
                        Local Fallback Safe Mode
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 mr-auto max-w-md animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-ink-900 flex items-center justify-center">
                  <Loader className="w-4 h-4 text-slate-400 dark:text-slate-300 animate-spin" />
                </div>
                <div className="bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-3xl rounded-tl-none p-4 shadow-3xs space-y-2">
                  <div className={`text-[10px] font-mono animate-pulse ${metaText}`}>
                    {currentLoadingMessage}
                  </div>
                  <div className="h-2 w-36 bg-slate-200 dark:bg-slate-600 rounded-full" />
                  <div className="h-2 w-24 bg-slate-100 dark:bg-slate-700 rounded-full" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Console Input Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about margin targets, service risks, cost drivers, or enter findings..."
                className={`flex-grow text-xs border border-slate-200 dark:border-white/10 dark:bg-ink-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-brand-200 ${inputPlaceholder}`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-xl transition-all disabled:opacity-40 shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Quick Driver Analysis Deck (1 col) */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-ink-800 rounded-3xl p-5 border border-slate-100 dark:border-white/10 shadow-sm space-y-3">
            <h4 className={`font-bold text-xs uppercase tracking-wider block border-b border-slate-50 dark:border-white/10 pb-2 ${titleText}`}>
              Suggested Driver Queries
            </h4>
            <p className={`text-[10px] leading-tight ${captionText}`}>
              Select one of the topics below. Clicking a query chip immediately grounds the co-pilot in our synthetic ledger.
            </p>
            <p className={`text-[10px] font-mono tabular-nums leading-tight ${metaText}`}>
              May 2026 baseline: {formatPercent(ledgerSnapshot.avgMargin, { decimals: 1 })} avg margin ·{" "}
              {formatCurrency(ledgerSnapshot.totalNpr)} NPR · {formatCount(ledgerSnapshot.recordCount)} records
            </p>
            <div className="flex flex-col gap-2 pt-1">
              {QUESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                   className={`w-full text-left p-3 rounded-xl border border-slate-50 dark:border-white/10 hover:border-brand-200/50 hover:bg-brand-500/5 hover:text-brand-600 dark:hover:text-brand-300 text-xs font-semibold transition-all line-clamp-1 truncate cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-500 ${bodyMuted}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* AI Stewardship Grounding Rules */}
          <div className="bg-amber-50/80 dark:bg-amber-950/35 rounded-3xl p-5 border border-amber-100 dark:border-amber-800/40 shadow-3xs space-y-3 text-amber-900 dark:text-amber-100">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-200 block flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Grounding Disclaimer
            </p>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-100/90">
              Our AI Copilot is tuned to enforce healthcare-specific stewardship guidelines. It prioritizes community health maintenance and clinical resource optimization, avoiding any profit-maximization and cost-extraction vocabulary. 
            </p>
          </div>

        </div>

      </div>

      {/* Renders separate formatted section for Document Brief when generated */}
      {isBriefGenerated && generatedBriefText && (
        <div className="bg-white dark:bg-ink-800 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-md relative animate-fade-in space-y-4 max-w-4xl mx-auto">
          <div className="border-b border-slate-200 dark:border-white/10 pb-4 flex justify-between items-center flex-col sm:flex-row gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600">Unified Health System Executive Output</span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Synthesized Stewardship briefing Brief</h3>
              <p className={`text-xs ${captionText}`}>Generated on June 2, 2026 • Grounded on Synthetic Baseline</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="p-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-ink-700 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
                title="Print Document"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedBriefText);
                  alert("Copied document brief to clipboard.");
                }}
                className="p-2 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-ink-700 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500"
                title="Copy to Clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`surface-readable ${bodyMuted} bg-slate-50/40 dark:bg-ink-900 p-6 rounded-2xl border border-slate-100 dark:border-white/10 max-h-[400px] overflow-y-auto font-sans text-xs leading-relaxed space-y-4`}>
            {parseMarkdownHtml(generatedBriefText)}
          </div>
          
          <div className={`text-[10px] italic text-center pt-2 border-t border-slate-100 dark:border-white/10 ${captionText}`}>
            Intended use: Senior executive planning review and workbook validation. Human oversight is mandatory.
          </div>
        </div>
      )}

    </div>
  );
}

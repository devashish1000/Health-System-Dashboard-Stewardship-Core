import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => {
        useEffect(() => {
          const timer = setTimeout(() => {
            onRemove(toast.id);
          }, 4000);
          return () => clearTimeout(timer);
        }, [toast.id, onRemove]);

        return (
          <div
            key={toast.id}
            className="flex items-start justify-between bg-white border border-slate-100 rounded-xl p-4 shadow-xl transition-all duration-300 animate-fade-in-up md:max-w-md"
          >
            <div className="flex gap-3">
              {toast.type === "success" && (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              {toast.type === "warning" && (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium text-slate-700">{toast.text}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

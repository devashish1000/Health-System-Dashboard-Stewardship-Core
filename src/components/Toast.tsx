import React, { useEffect, useRef } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  // Keep onRemove in a ref so its (unstable) identity doesn't restart timers.
  // The app re-renders every second (UTC clock); without this, the 4s dismiss
  // timers would reset on every tick and toasts would never disappear.
  const onRemoveRef = useRef(onRemove);
  onRemoveRef.current = onRemove;

  // Schedule exactly one auto-dismiss timer per toast id, set once when the
  // toast first appears and not affected by unrelated re-renders.
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timersRef.current[toast.id]) {
        timersRef.current[toast.id] = setTimeout(() => {
          delete timersRef.current[toast.id];
          onRemoveRef.current(toast.id);
        }, 4000);
      }
    });
  }, [toasts]);

  // Clear any pending timers on unmount.
  useEffect(() => {
    const timers = timersRef.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start justify-between bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/10 rounded-xl p-4 shadow-xl transition-all duration-300 animate-fade-in-up md:max-w-md"
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
            <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{toast.text}</p>
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-slate-400 dark:text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

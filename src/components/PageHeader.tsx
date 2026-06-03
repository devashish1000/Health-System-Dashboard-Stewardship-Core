import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  trailing?: React.ReactNode;
}

/** Page-level title block with WCAG-safe contrast in light and dark mode. */
export default function PageHeader({ title, subtitle, icon: Icon, trailing }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-page-title text-xl font-bold flex items-center gap-2">
          {Icon ? <Icon className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden /> : null}
          {title}
        </h2>
        {subtitle ? <p className="text-page-subtitle mt-1 max-w-3xl">{subtitle}</p> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}

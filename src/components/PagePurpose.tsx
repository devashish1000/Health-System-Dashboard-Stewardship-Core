import { Compass, LucideIcon } from "lucide-react";

interface PagePurposeProps {
  title: string;
  what: string;
  value: string;
  stat?: { label: string; value: string };
  icon?: LucideIcon;
}

export default function PagePurpose(props: PagePurposeProps) {
  const { title, what, value, stat } = props;
  const Icon = props.icon ?? Compass;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 dark:border-white/10 bg-gradient-to-r from-brand-50 to-slate-50 dark:from-ink-800 dark:to-ink-900 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-100 dark:border-white/10 bg-white dark:bg-ink-800 text-brand-600 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-brand-600">
            {title}
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{what}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{value}</div>
        </div>
      </div>

      {stat && (
        <div className="flex shrink-0 flex-col rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2 text-right shadow-sm sm:min-w-[7rem]">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{stat.value}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-400">
            {stat.label}
          </span>
        </div>
      )}
    </div>
  );
}

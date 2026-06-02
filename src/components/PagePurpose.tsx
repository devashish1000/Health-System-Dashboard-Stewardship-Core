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
    <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:gap-4">
      <div className="flex flex-1 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
            {title}
          </div>
          <div className="text-sm font-bold text-slate-800">{what}</div>
          <div className="text-xs text-slate-500">{value}</div>
        </div>
      </div>

      {stat && (
        <div className="flex shrink-0 flex-col rounded-xl border border-slate-100 bg-white px-3 py-2 text-right shadow-sm sm:min-w-[7rem]">
          <span className="text-sm font-bold text-slate-800">{stat.value}</span>
          <span className="text-[10px] uppercase tracking-wide text-slate-400">
            {stat.label}
          </span>
        </div>
      )}
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

export default function SyntheticDataBadge() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-medium text-amber-700 shadow-sm">
      <ShieldCheck className="h-3 w-3 shrink-0" />
      <span>Synthetic demo data — not real PHI</span>
    </div>
  );
}

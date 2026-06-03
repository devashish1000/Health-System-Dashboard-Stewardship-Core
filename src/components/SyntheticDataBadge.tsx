import { ShieldCheck } from "lucide-react";
import { JOB_REQ_ID } from "../constants/recruiterHandoff";

interface SyntheticDataBadgeProps {
  periodLabel?: string;
}

export default function SyntheticDataBadge({ periodLabel }: SyntheticDataBadgeProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 md:left-[17rem] z-40 flex items-center gap-1.5 rounded-full border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-[10px] font-medium text-amber-800 dark:text-amber-200 shadow-sm">
      <ShieldCheck className="h-3 w-3 shrink-0" />
      <span>
        Applicant prototype · Req {JOB_REQ_ID} · {periodLabel ? `${periodLabel} · ` : ""}synthetic · not
        real PHI
      </span>
    </div>
  );
}

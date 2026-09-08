type StatusBadgeTone = "success" | "warning" | "muted" | "danger";

type StatusBadgeProps = {
  label: string;
  tone: StatusBadgeTone;
};

const TONE_CLASS: Record<StatusBadgeTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  muted: "bg-slate-100 text-slate-500",
  danger: "bg-red-50 text-red-600",
};

function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ${TONE_CLASS[tone]}`}>
      {label}
    </span>
  );
}

export default StatusBadge;

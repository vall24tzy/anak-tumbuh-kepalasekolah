import { IconType } from "react-icons";

type SummaryCardProps = {
  label: string;
  value: string | number;
  icon: IconType;
};

function SummaryCard({ label, value, icon: Icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm sm:p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary-500">
        <Icon size={20} />
      </span>
      <p className="mt-3 text-xs font-bold text-primary-900/55">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-primary-900 sm:text-2xl">{value}</p>
    </div>
  );
}

export default SummaryCard;

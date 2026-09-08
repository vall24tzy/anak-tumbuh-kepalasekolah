import Link from "next/link";
import { IconType } from "react-icons";
import { CiSquareChevRight } from "react-icons/ci";

type QuickLinkCardProps = {
  href: string;
  label: string;
  description: string;
  icon: IconType;
};

function QuickLinkCard({ href, label, description, icon: Icon }: QuickLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-3xl border border-primary-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-50 text-primary-500">
          <Icon size={22} />
        </span>
        <div>
          <p className="text-sm font-black text-primary-900">{label}</p>
          <p className="mt-0.5 text-xs font-semibold text-primary-900/55">{description}</p>
        </div>
      </div>
      <CiSquareChevRight
        size={22}
        className="shrink-0 text-primary-900/30 transition group-hover:text-primary-500"
      />
    </Link>
  );
}

export default QuickLinkCard;

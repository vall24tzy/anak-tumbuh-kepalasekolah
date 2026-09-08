"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";

function Breadcrumb() {
  const pathname = usePathname();
  const activeItem = NAV_ITEMS.find((item) => pathname === item.href);

  return (
    <p className="text-xs font-bold text-primary-900/45">
      anaktumbuh.id <span className="mx-1">/</span>{" "}
      <span className="text-primary-900">{activeItem?.label ?? "Dashboard"}</span>
    </p>
  );
}

export default Breadcrumb;

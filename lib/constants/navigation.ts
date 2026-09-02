import { IconType } from "react-icons";
import { CiGrid41 } from "react-icons/ci";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

// Menu Kepala Sekolah akan bertambah seiring halaman dashboard dibangun.
// Untuk sekarang baru ada "Dashboard" (placeholder).
export const NAV_ITEMS: NavItem[] = [{ label: "Dashboard", href: "/dashboard", icon: CiGrid41 }];

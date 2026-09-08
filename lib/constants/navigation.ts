import { IconType } from "react-icons";
import { CiGrid41, CiHome, CiUser } from "react-icons/ci";

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

// Menu Dashboard Kepala Sekolah. Dipakai bareng oleh Sidebar & Breadcrumb
// biar nama halaman selalu konsisten di satu sumber data.
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: CiGrid41 },
  { label: "Sekolah", href: "/dashboard/school", icon: CiHome },
  { label: "Wali Kelas", href: "/dashboard/teachers", icon: CiUser },
];

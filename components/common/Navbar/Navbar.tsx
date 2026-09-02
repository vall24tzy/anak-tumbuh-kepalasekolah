"use client";

import { CiMenuBurger } from "react-icons/ci";
import useAuth from "@/hook/useAuth";
import LogoutButton from "@/components/features/auth/LogoutButton";

type NavbarProps = {
  onOpenSidebar: () => void;
};

function Navbar({ onOpenSidebar }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-primary-100 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-xl border border-primary-100 p-2 text-primary-900 lg:hidden"
          aria-label="Buka navigasi"
        >
          <CiMenuBurger size={20} />
        </button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary-500">
            anaktumbuh.id
          </p>
          <p className="text-sm font-extrabold text-primary-900">Dashboard Kepala Sekolah</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-xl bg-primary-50 px-3 py-2 text-right sm:block">
          <p className="text-xs font-extrabold text-primary-900">{user?.name ?? "Kepala Sekolah"}</p>
          <p className="text-[10px] text-primary-900/50">{user?.username}</p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

export default Navbar;

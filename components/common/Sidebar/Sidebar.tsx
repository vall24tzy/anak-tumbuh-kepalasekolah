"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import useAuth from "@/hook/useAuth";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-primary-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-primary-900 shadow-xl transition-transform duration-300 lg:z-30 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] items-center gap-3 border-b border-white/10 px-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary-500 text-primary-900 font-black">
            AT
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            anaktumbuh<span className="text-secondary-500">.id</span>
          </span>
        </div>

        <div className="mx-4 mt-5 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
            Workspace
          </p>
          <p className="mt-1 text-sm font-extrabold text-white">Kepala Sekolah</p>
          {user?.name && <p className="mt-0.5 text-xs text-white/60">{user.name}</p>}
        </div>

        <nav className="mt-6 flex-1 space-y-1.5 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-white text-primary-900 shadow-sm"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;

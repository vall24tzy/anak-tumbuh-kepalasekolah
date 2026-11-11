"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import Navbar from "@/components/common/Navbar/Navbar";
import Breadcrumb from "@/components/common/Breadcrumb/Breadcrumb";
import useAuth from "@/hook/useAuth";
import { getToken } from "@/lib/auth/token";
import { AppDispatch } from "@/redux/store";
import { fetchCurrentUser } from "@/redux/features/auth/authSlice";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  // Tanpa token -> kembali ke login. Dengan token tapi state Redux kosong
  // (mis. setelah refresh) -> pulihkan data user lewat GET /auth/me.
  useEffect(() => {
    if (!getToken()) {
      router.replace("/");
      return;
    }
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch, router]);

  return (
    <div className="min-h-screen bg-primary-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-[248px]">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <Breadcrumb />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;

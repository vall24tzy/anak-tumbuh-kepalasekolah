"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CiLogout } from "react-icons/ci";
import { AppDispatch } from "@/redux/store";
import { resetAuth } from "@/redux/features/auth/authSlice";

function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    dispatch(resetAuth());
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-xl border border-primary-200 px-3 py-2.5 text-xs font-black text-primary-900 transition hover:bg-primary-50"
    >
      <CiLogout size={18} />
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
}

export default LogoutButton;

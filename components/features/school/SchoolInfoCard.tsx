"use client";

import { useState } from "react";
import { CiHome, CiEdit } from "react-icons/ci";
import { School } from "@/lib/types/schoolType";
import StatusBadge from "@/components/ui/Badge/StatusBadge";
import EditSchoolModal from "@/components/features/school/EditSchoolModal";

type SchoolInfoCardProps = {
  school: School;
};

function SchoolInfoCard({ school }: SchoolInfoCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-wider text-primary-900/40">
        Scope Sekolah
      </p>
      <p className="mt-1 text-sm font-black text-primary-900">Sekolah Anda</p>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-primary-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-primary-500 shadow-sm">
            <CiHome size={22} />
          </span>
          <div>
            <p className="text-sm font-black text-primary-900">{school.name}</p>
            <p className="mt-0.5 text-xs font-semibold text-primary-900/55">
              {school.address ?? "Alamat belum diisi"}
            </p>
            <div className="mt-1.5">
              {school.status === "active" ? (
                <StatusBadge label="Aktif" tone="success" />
              ) : (
                <StatusBadge label="Nonaktif" tone="muted" />
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-3 text-sm font-black text-primary-900 transition hover:bg-primary-50"
        >
          <CiEdit size={18} />
          Edit Sekolah
        </button>
      </div>

      {isEditOpen && <EditSchoolModal school={school} onClose={() => setIsEditOpen(false)} />}
    </div>
  );
}

export default SchoolInfoCard;

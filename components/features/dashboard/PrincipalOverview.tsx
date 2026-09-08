"use client";

import { CiHome, CiUser, CiBoxList } from "react-icons/ci";
import useDashboardSummary from "@/hook/useDashboardSummary";
import SummaryCard from "@/components/ui/Card/SummaryCard";
import QuickLinkCard from "@/components/features/dashboard/QuickLinkCard";
import AsyncState from "@/components/ui/State/AsyncState";

function PrincipalOverview() {
  const { summary, loading, error } = useDashboardSummary();

  return (
    <AsyncState loading={loading} error={error}>
      <div className="space-y-6">
        <div className="rounded-[2rem] bg-gradient-to-br from-primary-900 to-primary-700 p-5 text-white shadow-lg sm:p-7">
          <p className="text-sm font-semibold text-primary-200">Selamat datang, Kepala Sekolah</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{summary?.school_name}</h1>
          <p className="mt-1 text-sm text-primary-200">
            Tahun Ajaran {summary?.active_academic_year}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <SummaryCard label="Total Rombel" value={summary?.total_class_groups ?? 0} icon={CiBoxList} />
          <SummaryCard label="Total Wali Kelas" value={summary?.total_teachers ?? 0} icon={CiUser} />
          <SummaryCard label="Total Siswa" value={summary?.total_students ?? 0} icon={CiHome} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-black text-primary-900">Menu Cepat</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLinkCard
              href="/dashboard/school"
              label="Sekolah"
              description="Struktur tahun ajaran & kelas/rombel"
              icon={CiHome}
            />
            <QuickLinkCard
              href="/dashboard/teachers"
              label="Wali Kelas"
              description="Daftar guru & rombel yang diampu"
              icon={CiUser}
            />
          </div>
        </div>
      </div>
    </AsyncState>
  );
}

export default PrincipalOverview;

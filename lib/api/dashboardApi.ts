import { apiRequest, fetchAllPages } from "@/lib/api/client";
import { getMeApi } from "@/lib/api/authApi";
import { mockDashboardSummary } from "@/lib/mocks/dashboardMock";
import { ApiAcademicYear, ApiHeadmasterDashboard, ApiTeacher } from "@/lib/types/apiModelType";
import { ApiResult } from "@/lib/types/apiType";
import { DashboardSummary } from "@/lib/types/dashboardType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";

// Ringkasan dashboard Kepala Sekolah. GET /dashboard/headmaster hanya berisi
// daftar rombel (tahun ajaran aktif) beserta jumlah siswa, jadi nama sekolah
// diambil dari /auth/me, tahun ajaran aktif dari /academic-years, dan total
// wali kelas dari /teachers.
export async function getDashboardSummaryApi(): Promise<ApiResult<DashboardSummary>> {
  if (isMockEnabled()) {
    await mockDelay();
    return { ok: true, status: 200, data: mockDashboardSummary };
  }

  const [dashboard, me, years, teachers] = await Promise.all([
    apiRequest<ApiHeadmasterDashboard>("/dashboard/headmaster"),
    getMeApi(),
    fetchAllPages<ApiAcademicYear>("/academic-years"),
    fetchAllPages<ApiTeacher>("/teachers"),
  ]);

  if (!dashboard.ok) return dashboard;
  if (!me.ok) return me;
  if (!years.ok) return years;
  if (!teachers.ok) return teachers;

  const rombels = dashboard.data.rombels;

  return {
    ok: true,
    status: 200,
    data: {
      school_name: me.data.school?.name ?? "-",
      active_academic_year: years.data.find((year) => year.is_active)?.name ?? "Belum ada tahun ajaran aktif",
      total_class_groups: rombels.length,
      total_teachers: teachers.data.filter((teacher) => teacher.status === "active").length,
      total_students: rombels.reduce((sum, rombel) => sum + rombel.student_count, 0),
    },
  };
}

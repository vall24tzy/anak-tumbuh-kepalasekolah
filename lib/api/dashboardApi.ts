import { DashboardSummaryResponse } from "@/lib/types/dashboardType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";
import { mockDashboardSummary } from "@/lib/mocks/dashboardMock";

// Ringkasan dashboard Kepala Sekolah: sekolah aktif, tahun ajaran aktif,
// total rombel, total wali kelas, total siswa.
export async function getDashboardSummaryApi(): Promise<DashboardSummaryResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return mockDashboardSummary;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/dashboard`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const response = await res.json();
    if (response.code === 401 || response.code === 403) {
      window.location.href = "/";
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

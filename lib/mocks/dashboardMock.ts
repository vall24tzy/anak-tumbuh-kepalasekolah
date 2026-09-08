import { DashboardSummaryResponse } from "@/lib/types/dashboardType";

export const mockDashboardSummary: DashboardSummaryResponse = {
  code: 200,
  status: "success",
  message: "OK (data dummy)",
  data: {
    school_name: "SD Cendekia Mulia",
    active_academic_year: "2026/2027",
    total_class_groups: 4,
    total_teachers: 4,
    total_students: 72,
  },
};

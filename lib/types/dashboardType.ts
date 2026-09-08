export type DashboardSummary = {
  school_name: string;
  active_academic_year: string;
  total_class_groups: number;
  total_teachers: number;
  total_students: number;
};

export type DashboardSummaryResponse = {
  code: number;
  status: string;
  message: string;
  data: DashboardSummary | null;
};

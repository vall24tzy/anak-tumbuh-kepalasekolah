// Bentuk data MENTAH dari backend (sesuai Resource Laravel). Dipakai layer
// lib/api saja; UI memakai tipe di schoolType/teacherType setelah dipetakan.

export type ApiAcademicYear = {
  id: number;
  school_id: number;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  is_active: boolean;
};

export type ApiRombel = {
  id: number;
  school_id: number;
  academic_year_id: number;
  name: string;
  grade_level: number;
};

export type ApiTeacher = {
  id: number;
  school_id: number;
  name: string;
  nip: string;
  gender: "laki-laki" | "perempuan";
  status: "active" | "inactive";
};

export type ApiTeacherAssignment = {
  id: number;
  teacher_id: number;
  school_id: number;
  academic_year_id: number;
  rombel_id: number;
  is_active: boolean;
};

// GET /dashboard/headmaster (tahun ajaran aktif saja)
export type ApiHeadmasterDashboard = {
  rombels: {
    id: number;
    name: string;
    grade_level: number;
    student_count: number;
    average_submitted_today: number;
  }[];
};

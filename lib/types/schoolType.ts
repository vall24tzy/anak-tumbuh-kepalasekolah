// Struktur Sekolah sesuai dokumen bag. 3: Sekolah -> Tahun Ajaran -> Kelas/Rombel.
// Rombel bersifat fleksibel (SD: 1-6/1-A/nama khusus, TK: TK A/TK B/dst).
export type School = {
  id: number;
  uuid: string;
  name: string;
  address: string | null;
  status: "active" | "inactive";
};

export type AcademicYearStatus = "active" | "inactive";

export type AcademicYear = {
  id: number;
  uuid: string;
  name: string; // contoh: "2026/2027"
  start_date: string;
  end_date: string;
  status: AcademicYearStatus;
};

export type ClassGroup = {
  id: number;
  uuid: string;
  academic_year_id: number;
  education_level: string; // "Kelas 1" / "TK A"
  name: string; // "1-A" / "Melati"
  homeroom_teacher_id: number | null;
  homeroom_teacher_name: string | null;
  total_students: number;
};

export type SchoolStructureData = {
  school: School;
  academic_years: AcademicYear[];
  class_groups: ClassGroup[];
};

export type SchoolStructureResponse = {
  code: number;
  status: string;
  message: string;
  data: SchoolStructureData | null;
};

// Edit info sekolah
export type EditSchoolPayload = {
  name: string;
};

export type EditSchoolResponse = {
  code: number;
  status: string;
  message: string;
  data: School | null;
};

// Tambah Tahun Ajaran baru
export type AddAcademicYearPayload = {
  name: string;
  start_date: string;
  end_date: string;
};

export type AddAcademicYearResponse = {
  code: number;
  status: string;
  message: string;
  data: AcademicYear | null;
};

// Tambah Kelas/Rombel baru. Nama tingkat & rombel bebas (tidak di-hard-code),
// validasi scope & constraint 1 Wali Kelas/1 rombel aktif ditentukan backend.
export type AddClassGroupPayload = {
  academic_year_id: number;
  education_level: string;
  name: string;
  homeroom_teacher_id: number | null;
};

export type AddClassGroupResponse = {
  code: number;
  status: string;
  message: string;
  data: ClassGroup | null;
};

// Edit Kelas/Rombel yang sudah ada (terutama ganti Wali Kelas)
export type UpdateClassGroupPayload = AddClassGroupPayload & {
  id: number;
};

export type UpdateClassGroupResponse = AddClassGroupResponse;

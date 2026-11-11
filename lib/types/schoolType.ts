// Struktur Sekolah: Sekolah -> Tahun Ajaran -> Kelas/Rombel.
// Sumber backend: GET /auth/me (sekolah), GET /academic-years, GET /rombels,
// GET /teacher-class-assignments dan GET /teachers (nama wali kelas).
export type School = {
  id: number;
  name: string;
  // Backend belum menyediakan alamat/status sekolah; diisi default di mapper.
  address: string | null;
  status: "active" | "inactive";
};

export type AcademicYear = {
  id: number;
  name: string; // contoh: "2026/2027"
  start_date: string;
  end_date: string;
  is_active: boolean;
};

// Rombel = kelas. Tingkat disimpan backend sebagai angka (grade_level) dan
// ditampilkan "Kelas {n}" lewat gradeLevelToLabel().
export type ClassGroup = {
  id: number;
  academic_year_id: number;
  grade_level: number;
  name: string; // "1-A" / "Melati"
  // Penugasan wali kelas AKTIF pada rombel ini (null = belum ditugaskan).
  assignment_id: number | null;
  homeroom_teacher_id: number | null;
  homeroom_teacher_name: string | null;
  // Jumlah siswa aktif. Backend hanya menghitungnya untuk rombel pada tahun
  // ajaran aktif; null = tidak tersedia.
  total_students: number | null;
};

export type SchoolStructureData = {
  school: School;
  academic_years: AcademicYear[];
  class_groups: ClassGroup[];
};

// Tambah / ubah Tahun Ajaran
export type AcademicYearPayload = {
  name: string;
  start_date: string;
  end_date: string;
};

// Tambah / ubah Rombel. Wali kelas ditetapkan lewat penugasan terpisah.
export type ClassGroupPayload = {
  academic_year_id: number;
  grade_level: number;
  name: string;
  homeroom_teacher_id: number | null;
};

export type UpdateClassGroupPayload = ClassGroupPayload & {
  id: number;
  // Penugasan aktif sebelum diubah (untuk menentukan perubahan wali kelas).
  current_assignment_id: number | null;
  current_teacher_id: number | null;
};

// Edit nama sekolah belum didukung backend (hanya mode data dummy).
export type EditSchoolPayload = {
  name: string;
};

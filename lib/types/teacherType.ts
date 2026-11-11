export type TeacherStatus = "active" | "inactive";
export type TeacherGender = "laki-laki" | "perempuan";

// Guru untuk UI: gabungan GET /teachers + penugasan aktif
// (GET /teacher-class-assignments) + nama rombel (GET /rombels).
export type Teacher = {
  id: number;
  name: string;
  nip: string;
  gender: TeacherGender;
  status: TeacherStatus;
  // Penugasan wali kelas aktif (null = belum ditugaskan).
  assignment_id: number | null;
  class_group_id: number | null;
  class_group_name: string | null;
  grade_level: number | null;
  academic_year_id: number | null;
};

// Akun login guru dibuat otomatis: username dan password awal = NIP.
export type AddTeacherPayload = {
  name: string;
  nip: string;
  gender: TeacherGender;
  class_group_id: number | null;
};

// Ubah penempatan rombel guru. Nama/NIP belum bisa diubah di backend
// (hanya berlaku di mode data dummy).
export type UpdateTeacherPayload = {
  id: number;
  name: string;
  nip: string;
  class_group_id: number | null;
  current_assignment_id: number | null;
  current_class_group_id: number | null;
};

// Hasil operasi bertahap: guru/rombel sudah tersimpan tetapi langkah
// penugasannya bisa gagal terpisah (warning ditampilkan ke pengguna).
export type TeacherMutationResult = {
  message: string;
  warning: string | null;
};

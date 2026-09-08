// Wali Kelas (Teacher). Dokumen bag. 2: setiap rombel diampu tepat 1 Teacher,
// dan satu Teacher hanya memegang tanggung jawab atas tepat satu rombel.
export type TeacherStatus = "active" | "inactive";

export type Teacher = {
  id: number;
  uuid: string;
  name: string;
  username: string;
  password: string | null; // hanya terisi untuk akun baru (mock), sesuai referensi
  class_group_id: number | null; // null = belum ditugaskan ke rombel
  class_group_name: string | null; // null = belum ditugaskan ke rombel
  education_level: string | null;
  total_students: number;
  status: TeacherStatus;
};

export type TeacherListResponse = {
  code: number;
  status: string;
  message: string;
  data: Teacher[] | null;
};

// Tambah Guru manual. Username & password digenerate otomatis oleh sistem.
export type AddTeacherPayload = {
  name: string;
  class_group_id: number | null;
};

export type AddTeacherResponse = {
  code: number;
  status: string;
  message: string;
  data: Teacher | null;
};

// Aplikasi ini khusus Dashboard Kepala Sekolah (Headmaster).
// Role lain (Super Admin, Teacher, Student) memiliki aplikasi/dashboard terpisah.
// Dokumen bag. 2: "Ketentuan Headmaster (Kepala Sekolah): Menggunakan 1 akun
// administrator utama per sekolah."
export type UserRole = "headmaster";

export const HEADMASTER_ROLE: UserRole = "headmaster";
export const HEADMASTER_ROLE_LABEL = "Kepala Sekolah";
export const HEADMASTER_DASHBOARD_PATH = "/dashboard";

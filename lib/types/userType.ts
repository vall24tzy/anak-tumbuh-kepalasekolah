import { UserRole } from "@/lib/constants/role";

export type UserSchool = {
  id: number;
  name: string;
};

// Bentuk GET /auth/me untuk Kepala Sekolah (juga dipakai sebagai user di Redux).
// Login hanya mengembalikan id, role, name; sisanya diambil dari /auth/me.
export type User = {
  id: number;
  role: UserRole;
  name: string | null;
  nip: string | null;
  school: UserSchool | null;
};

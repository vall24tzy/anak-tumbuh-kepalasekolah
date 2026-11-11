import { User } from "@/lib/types/userType";

// Payload login staf. Kepala Sekolah: username = NIP.
export type LoginPayload = {
  username: string;
  password: string;
};

// data dari POST /auth/login/staff
export type LoginApiData = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    role: string;
    name: string | null;
  };
};

// Hasil login lengkap (token + user dari /auth/me).
export type AuthSession = {
  access_token: string;
  user: User;
};

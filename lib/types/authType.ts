import { User } from "@/lib/types/userType";

// Payload login Kepala Sekolah: username berisi NIP, password berisi NIP.
export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthApiResponse = {
  code: number;
  status: string;
  message: string;
  data: User | null;
  access_token: string;
};

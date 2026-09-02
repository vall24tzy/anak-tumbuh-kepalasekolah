import { AuthApiResponse } from "@/lib/types/authType";

export const mockLoginResponse: AuthApiResponse = {
  code: 200,
  status: "success",
  message: "Login berhasil (data dummy)",
  data: {
    id: 1,
    uuid: "mock-headmaster-uuid",
    name: "Dr. H. Ahmad Sanusi, M.Pd",
    username: "kepsek1",
    email: "kepsek1@anaktumbuh.id",
    role: "headmaster",
    school_id: 1,
    avatar_url: null,
    is_active: 1,
  },
  access_token: "mock-access-token-kepsek-123",
};

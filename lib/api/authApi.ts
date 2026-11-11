import { apiRequest } from "@/lib/api/client";
import { clearToken, setToken } from "@/lib/auth/token";
import { HEADMASTER_ROLE } from "@/lib/constants/role";
import { MOCK_ACCESS_TOKEN, mockUser } from "@/lib/mocks/authMock";
import { ApiResult } from "@/lib/types/apiType";
import { AuthSession, LoginApiData, LoginPayload } from "@/lib/types/authType";
import { User } from "@/lib/types/userType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";

// GET /auth/me: identitas lengkap (nama, NIP, sekolah) dari token yang aktif.
export const getMeApi = async (): Promise<ApiResult<User>> => {
  if (isMockEnabled()) {
    await mockDelay(200);
    return { ok: true, status: 200, data: mockUser };
  }

  return apiRequest<User>("/auth/me");
};

// Id sekolah milik Kepala Sekolah yang login. Dibutuhkan payload tulis
// (POST /teachers, /rombels, /teacher-class-assignments). Di-cache di memori
// selama sesi; dibersihkan saat logout.
let cachedSchoolId: number | null = null;

export const getSchoolIdApi = async (): Promise<ApiResult<number>> => {
  if (cachedSchoolId) return { ok: true, status: 200, data: cachedSchoolId };

  const me = await getMeApi();
  if (!me.ok) return me;

  if (!me.data.school) {
    return {
      ok: false,
      status: 403,
      error: {
        code: "forbidden",
        message: "Akun ini belum terhubung ke sekolah mana pun.",
        details: [],
      },
    };
  }

  cachedSchoolId = me.data.school.id;
  return { ok: true, status: 200, data: cachedSchoolId };
};

// POST /auth/logout: mencabut token di server. Token lokal SELALU dihapus,
// meskipun request gagal (mis. offline), supaya logout tidak bisa "macet".
export const logoutApi = async (): Promise<void> => {
  try {
    if (!isMockEnabled()) {
      await apiRequest("/auth/logout", { method: "POST", redirectOnUnauthorized: false });
    }
  } finally {
    cachedSchoolId = null;
    clearToken();
  }
};

// Login Kepala Sekolah: POST /auth/login/staff (username = NIP) lalu GET /auth/me.
// Token disimpan di sini karena /auth/me butuh token tersebut.
export const loginApi = async (payload: LoginPayload): Promise<ApiResult<AuthSession>> => {
  if (isMockEnabled()) {
    await mockDelay();
    if (!payload.username || !payload.password) {
      return {
        ok: false,
        status: 422,
        error: {
          code: "validation_failed",
          message: "Username dan password wajib diisi (data dummy)",
          details: [],
        },
      };
    }
    setToken(MOCK_ACCESS_TOKEN);
    return { ok: true, status: 200, data: { access_token: MOCK_ACCESS_TOKEN, user: mockUser } };
  }

  const login = await apiRequest<LoginApiData>("/auth/login/staff", {
    method: "POST",
    body: { username: payload.username, password: payload.password },
    auth: false,
  });

  if (!login.ok) return login;

  const accessToken = login.data.access_token;
  setToken(accessToken);

  const me = await getMeApi();
  if (!me.ok) {
    clearToken();
    return me;
  }

  // Endpoint login staf juga melayani guru dan super admin. Aplikasi ini khusus
  // Kepala Sekolah: cabut token yang baru terbit lalu tolak.
  if (me.data.role !== HEADMASTER_ROLE) {
    await logoutApi();
    return {
      ok: false,
      status: 403,
      error: {
        code: "forbidden",
        message: "Akun ini bukan akun Kepala Sekolah. Gunakan aplikasi yang sesuai dengan peran Anda.",
        details: [],
      },
    };
  }

  return { ok: true, status: 200, data: { access_token: accessToken, user: me.data } };
};

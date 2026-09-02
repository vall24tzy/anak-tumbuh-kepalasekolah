import { AuthApiResponse, LoginPayload } from "@/lib/types/authType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";
import { mockLoginResponse } from "@/lib/mocks/authMock";

// Login Kepala Sekolah (Headmaster) menggunakan Username/Email & Password
export const loginApi = async (payload: LoginPayload): Promise<AuthApiResponse> => {
  if (isMockEnabled()) {
    await mockDelay();
    if (!payload.username || !payload.password) {
      return {
        code: 400,
        status: "error",
        message: "Username dan password wajib diisi (data dummy)",
        data: null,
        access_token: "",
      };
    }
    return mockLoginResponse;
  }

  try {
    const formData = new FormData();
    formData.append("username", payload.username);
    formData.append("password", payload.password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

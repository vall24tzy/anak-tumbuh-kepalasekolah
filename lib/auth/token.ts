// Penyimpanan access token (JWT) di browser. Satu-satunya tempat yang boleh
// menyentuh localStorage untuk token, supaya key-nya tidak tersebar.
const TOKEN_KEY = "access_token";

export const getToken = (): string => {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage diblokir (mode privat ketat): sesi tidak bisa dipertahankan.
  }
};

export const clearToken = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // abaikan
  }
};

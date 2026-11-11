import { clearToken, getToken } from "@/lib/auth/token";
import {
  ApiError,
  ApiFailure,
  ApiResult,
  PaginationMeta,
} from "@/lib/types/apiType";

// Backend memasang semua route di bawah /api/v1. NEXT_PUBLIC_API_BASE_URL
// cukup diisi sampai /api (contoh: http://127.0.0.1:8000/api); prefix /v1
// ditambahkan di sini. Jika env sudah berakhiran /v1, tidak ditambah dua kali.
const API_VERSION = "/v1";

// Pesan seragam untuk HTTP 429 (rate_limit_exceeded). Komponen membandingkan
// pesan error dengan konstanta ini untuk memulai jeda (cooldown) tombol.
export const RATE_LIMIT_MESSAGE =
  "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";

export const getApiBaseUrl = (): string => {
  const raw = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
  return raw.endsWith(API_VERSION) ? raw : `${raw}${API_VERSION}`;
};

type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  // Object biasa dikirim sebagai JSON. FormData dikirim apa adanya (multipart).
  body?: Record<string, unknown> | FormData;
  query?: Record<string, QueryValue>;
  // false untuk endpoint publik (login): tanpa header Authorization dan
  // tanpa redirect otomatis saat 401 (401 di login = kredensial salah).
  auth?: boolean;
  // false bila pemanggil ingin menangani 401 sendiri.
  redirectOnUnauthorized?: boolean;
  signal?: AbortSignal;
};

const buildQuery = (query?: Record<string, QueryValue>): string => {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const failure = (
  status: number,
  code: string,
  message: string,
  details: ApiError["details"] = []
): ApiFailure => ({ ok: false, status, error: { code, message, details } });

const defaultMessage = (status: number): string => {
  switch (status) {
    case 401:
      return "Sesi Anda telah berakhir, silakan login kembali.";
    case 403:
      return "Anda tidak memiliki akses untuk tindakan ini.";
    case 404:
      return "Data tidak ditemukan.";
    case 409:
      return "Data bertentangan dengan kondisi saat ini.";
    case 422:
      return "Data yang dikirim tidak valid.";
    case 429:
      return "Terlalu banyak percobaan, coba lagi beberapa saat lagi.";
    default:
      return "Terjadi kesalahan pada server.";
  }
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/") {
    window.location.replace("/");
  }
};

/**
 * Client API bersama. Membuka envelope backend dan SELALU mengembalikan
 * ApiResult (tidak melempar error untuk status HTTP non-2xx maupun gagal
 * jaringan), sehingga pemanggil cukup memeriksa `result.ok`:
 *
 *   const res = await apiRequest<Student[]>("/students");
 *   if (!res.ok) { ...res.error.message... }
 *   else { ...res.data, res.meta... }
 *
 * Penanganan sesi: 401 pada endpoint terproteksi menghapus token dan
 * mengarahkan ke halaman login; 403 dikembalikan apa adanya supaya UI
 * menampilkan error.message dari backend.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResult<T>> {
  const { method = "GET", body, query, auth = true, redirectOnUnauthorized = true, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let requestBody: BodyInit | undefined;
  if (body instanceof FormData) {
    // Jangan set Content-Type: browser mengisi boundary multipart sendiri.
    requestBody = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}${buildQuery(query)}`, {
      method,
      headers,
      body: requestBody,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return failure(
      0,
      "network_error",
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
    );
  }

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const err = (payload as { error?: Partial<ApiError> } | null)?.error;
    const result = failure(
      response.status,
      err?.code ?? "unknown_error",
      response.status === 429 ? RATE_LIMIT_MESSAGE : err?.message || defaultMessage(response.status),
      Array.isArray(err?.details) ? err.details : []
    );

    if (response.status === 401 && auth && redirectOnUnauthorized) {
      clearToken();
      redirectToLogin();
    }

    return result;
  }

  // Sukses tanpa body JSON (mis. 204) tetap dianggap berhasil.
  const envelope = (payload ?? {}) as { data?: T; meta?: PaginationMeta };
  return {
    ok: true,
    status: response.status,
    data: (envelope.data ?? null) as T,
    meta: envelope.meta,
  };
}

/**
 * Ambil SEMUA halaman dari endpoint list berpagination (per_page maksimal 100).
 * Dipakai untuk kebutuhan yang butuh data utuh, mis. daftar siswa satu rombel.
 * maxPages = pengaman agar tidak looping tanpa akhir.
 */
export async function fetchAllPages<T>(
  path: string,
  query: Record<string, QueryValue> = {},
  maxPages = 50
): Promise<ApiResult<T[]>> {
  const items: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const res = await apiRequest<T[]>(path, { query: { ...query, page, per_page: 100 } });
    if (!res.ok) return res;

    items.push(...(res.data ?? []));

    const totalPages = res.meta?.total_pages ?? 1;
    if (page >= totalPages) break;
    page += 1;
  }

  return { ok: true, status: 200, data: items };
}

export type DownloadedFile = { blob: Blob; filename: string | null };

/**
 * Unduh file (mis. template Excel). Berbeda dari apiRequest karena response
 * sukses bukan JSON. Response error tetap diparse dari envelope backend.
 */
export async function apiDownload(path: string): Promise<ApiResult<DownloadedFile>> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, { method: "GET", headers });
  } catch {
    return failure(
      0,
      "network_error",
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
    );
  }

  if (!response.ok) {
    let err: Partial<ApiError> | undefined;
    try {
      err = ((await response.json()) as { error?: Partial<ApiError> }).error;
    } catch {
      err = undefined;
    }

    if (response.status === 401) {
      clearToken();
      redirectToLogin();
    }

    return failure(
      response.status,
      err?.code ?? "unknown_error",
      err?.message || defaultMessage(response.status),
      Array.isArray(err?.details) ? err.details : []
    );
  }

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);

  return {
    ok: true,
    status: response.status,
    data: { blob: await response.blob(), filename: match ? decodeURIComponent(match[1]) : null },
  };
}

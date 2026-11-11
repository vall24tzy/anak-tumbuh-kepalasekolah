// Bentuk response backend (API Contract v1.2 §7-§9).
//   sukses : { data, meta? }
//   error  : { error: { code, message, details[] } }

export type PaginationMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

// Query list standar. per_page maksimal 100 (lebih dari itu ditolak 422).
export type PaginationParams = {
  page?: number;
  per_page?: number;
};

export type ApiErrorDetail = {
  field?: string;
  reason?: string;
  message?: string;
  [key: string]: unknown;
};

export type ApiError = {
  code: string;
  message: string;
  details: ApiErrorDetail[];
};

// status 0 = request tidak sampai ke server (offline / CORS / server mati).
export type ApiSuccess<T> = {
  ok: true;
  status: number;
  data: T;
  meta?: PaginationMeta;
};

export type ApiFailure = {
  ok: false;
  status: number;
  error: ApiError;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

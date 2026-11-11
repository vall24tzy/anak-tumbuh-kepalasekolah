// Batas import Excel dari backend: hanya .xlsx, maksimal 5 MB dan 200 baris.
// Jumlah baris baru bisa diperiksa server (422 bila lebih), jadi di sisi
// browser hanya format dan ukuran yang dicek.
export const IMPORT_MAX_BYTES = 5 * 1024 * 1024;
export const IMPORT_MAX_ROWS = 200;

export const validateImportFile = (file: File): string | null => {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return "Hanya file .xlsx yang bisa diimport. Gunakan template Excel yang disediakan.";
  }
  if (file.size > IMPORT_MAX_BYTES) {
    return "Ukuran file melebihi 5 MB.";
  }
  return null;
};

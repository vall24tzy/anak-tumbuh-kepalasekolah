// Import Guru via Excel (API Contract v1.2): SATU langkah.
// POST /teachers/import (file .xlsx maksimal 5 MB, kolom: Nama Lengkap, NIP,
// Gender). Backend memvalidasi dan menyimpan langsung (sinkron); baris yang
// gagal dilaporkan di `errors`, baris yang valid tetap tersimpan.
export type TeacherImportError = {
  row: number;
  field: string | null;
  code: string;
  message: string;
};

export type TeacherImportResult = {
  batch_id: number;
  total_rows: number;
  processed_rows: number;
  successful_rows: number;
  rejected_rows: number;
  errors: TeacherImportError[];
};

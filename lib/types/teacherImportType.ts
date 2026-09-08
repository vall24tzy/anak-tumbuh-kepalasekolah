// Import Guru via Excel. Dokumen bag. 7: alur Upload -> Validasi Strict ->
// Preview -> Generate Akun. Headmaster berwenang mengimport Teacher (bag. 8).
export type ImportTeacherRow = {
  row_number: number;
  name: string;
  class_group_name: string;
};

export type ValidatedTeacherImportRow = ImportTeacherRow & {
  valid: boolean;
  errors: string[];
};

export type TeacherImportValidationResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    rows: ValidatedTeacherImportRow[];
    valid_count: number;
    invalid_count: number;
  } | null;
};

export type TeacherImportCommitResponse = {
  code: number;
  status: string;
  message: string;
  data: { imported_count: number } | null;
};

import { AddTeacherPayload, AddTeacherResponse } from "@/lib/types/teacherType";
import {
  TeacherImportValidationResponse,
  TeacherImportCommitResponse,
  ValidatedTeacherImportRow,
} from "@/lib/types/teacherImportType";

const slugifyUsername = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join("");

const randomPassword = () => Math.random().toString(36).slice(2, 8);

export const buildMockAddTeacherResponse = (payload: AddTeacherPayload): AddTeacherResponse => ({
  code: 200,
  status: "success",
  message: `${payload.name} berhasil ditambahkan sebagai Guru (data dummy)`,
  data: {
    id: Date.now(),
    uuid: `mock-teacher-${Date.now()}`,
    name: payload.name,
    username: slugifyUsername(payload.name),
    password: randomPassword(),
    class_group_id: payload.class_group_id,
    class_group_name: null,
    education_level: null,
    total_students: 0,
    status: "active",
  },
});

// Baris ke-2 sengaja dibuat invalid untuk mendemokan tampilan error preview import.
const mockTeacherImportRows: ValidatedTeacherImportRow[] = [
  {
    row_number: 2,
    name: "Agus Prasetyo, S.Pd",
    class_group_name: "6A",
    valid: true,
    errors: [],
  },
  {
    row_number: 3,
    name: "",
    class_group_name: "6B",
    valid: false,
    errors: ["Nama Guru wajib diisi"],
  },
];

export const mockTeacherImportValidationResponse: TeacherImportValidationResponse = {
  code: 200,
  status: "success",
  message: "File berhasil divalidasi (data dummy)",
  data: {
    rows: mockTeacherImportRows,
    valid_count: mockTeacherImportRows.filter((row) => row.valid).length,
    invalid_count: mockTeacherImportRows.filter((row) => !row.valid).length,
  },
};

export const buildMockTeacherImportCommitResponse = (
  rows: ValidatedTeacherImportRow[]
): TeacherImportCommitResponse => ({
  code: 200,
  status: "success",
  message: "Import Guru berhasil (data dummy)",
  data: { imported_count: rows.filter((row) => row.valid).length },
});

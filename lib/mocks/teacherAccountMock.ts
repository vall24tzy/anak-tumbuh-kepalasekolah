import {
  AddTeacherPayload,
  AddTeacherResponse,
  TeacherMutationResponse,
  UpdateTeacherPayload,
} from "@/lib/types/teacherType";
import {
  TeacherImportValidationResponse,
  TeacherImportCommitResponse,
  ValidatedTeacherImportRow,
} from "@/lib/types/teacherImportType";

export const buildMockAddTeacherResponse = (payload: AddTeacherPayload): AddTeacherResponse => ({
  code: 200,
  status: "success",
  message: `${payload.name} berhasil ditambahkan sebagai Guru (data dummy)`,
  data: {
    id: Date.now(),
    uuid: `mock-teacher-${Date.now()}`,
    name: payload.name,
    nip: payload.nip,
    username: payload.nip,
    password: payload.nip,
    class_group_id: payload.class_group_id,
    class_group_name: null,
    education_level: null,
    total_students: 0,
    status: "active",
  },
});

export const buildMockUpdateTeacherResponse = (
  payload: UpdateTeacherPayload
): TeacherMutationResponse => ({
  code: 200,
  status: "success",
  message: "Data guru berhasil diperbarui (data dummy)",
  data: {
    id: payload.id,
    uuid: `mock-teacher-${payload.id}`,
    name: payload.name,
    nip: payload.nip,
    username: payload.nip,
    password: payload.nip,
    class_group_id: payload.class_group_id,
    class_group_name: null,
    education_level: null,
    total_students: 0,
    status: "active",
  },
});

export const mockTeacherImportValidationResponse: TeacherImportValidationResponse = {
  code: 200,
  status: "success",
  message: "File berhasil divalidasi (data dummy)",
  data: {
    rows: [
      { row_number: 2, name: "Agus Prasetyo, S.Pd", class_group_name: "6A", valid: true, errors: [] },
      { row_number: 3, name: "", class_group_name: "6B", valid: false, errors: ["Nama Guru wajib diisi"] },
    ],
    valid_count: 1,
    invalid_count: 1,
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

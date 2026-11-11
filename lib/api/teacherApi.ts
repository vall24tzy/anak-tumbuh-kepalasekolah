import { apiDownload, apiRequest } from "@/lib/api/client";
import { changeTeacherPlacementApi } from "@/lib/api/assignmentApi";
import { getSchoolIdApi } from "@/lib/api/authApi";
import { buildTeachers, loadSchoolBaseData } from "@/lib/api/schoolData";
import { DownloadedFile } from "@/lib/api/client";
import { mockAddTeacher, mockInactiveTeacher, mockSetRombelTeacher } from "@/lib/mocks/mockOps";
import { mockTeachers } from "@/lib/mocks/teacherMock";
import { ApiRombel, ApiTeacher } from "@/lib/types/apiModelType";
import { ApiResult } from "@/lib/types/apiType";
import { MutationOutcome } from "@/lib/types/mutationType";
import { TeacherImportResult } from "@/lib/types/teacherImportType";
import { AddTeacherPayload, Teacher, UpdateTeacherPayload } from "@/lib/types/teacherType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";

const done = (message: string, warning: string | null = null): ApiResult<MutationOutcome> => ({
  ok: true,
  status: 200,
  data: { message, warning },
});

// Daftar guru + penempatan rombel aktif (GET /teachers, /teacher-class-assignments, /rombels).
export async function getTeachersApi(): Promise<ApiResult<Teacher[]>> {
  if (isMockEnabled()) {
    await mockDelay();
    return { ok: true, status: 200, data: mockTeachers.map((teacher) => ({ ...teacher })) };
  }

  const base = await loadSchoolBaseData();
  if (!base.ok) return base;

  return { ok: true, status: 200, data: buildTeachers(base.data) };
}

// Ambil rombel (butuh academic_year_id untuk membuat penugasan).
const getRombel = (id: number) => apiRequest<ApiRombel>(`/rombels/${id}`);

// POST /teachers (akun login dibuat otomatis: username dan password awal = NIP),
// lalu (bila dipilih) tugaskan ke rombel lewat penugasan terpisah.
export async function addTeacherApi(payload: AddTeacherPayload): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockAddTeacher(payload);
    return done(`${payload.name} berhasil ditambahkan sebagai Guru (data dummy)`);
  }

  const school = await getSchoolIdApi();
  if (!school.ok) return school;

  const created = await apiRequest<ApiTeacher>("/teachers", {
    method: "POST",
    body: {
      school_id: school.data,
      name: payload.name.trim(),
      nip: payload.nip.trim(),
      gender: payload.gender,
    },
  });
  if (!created.ok) return created;

  const message = `${created.data.name} berhasil ditambahkan sebagai Guru`;
  if (!payload.class_group_id) return done(message);

  const rombel = await getRombel(payload.class_group_id);
  if (!rombel.ok) return done(message, `Guru belum ditempatkan ke rombel: ${rombel.error.message}`);

  const placed = await changeTeacherPlacementApi({
    teacherId: created.data.id,
    currentAssignmentId: null,
    currentRombelId: null,
    newRombel: { id: rombel.data.id, academic_year_id: rombel.data.academic_year_id },
  });
  return placed.ok ? done(message) : done(message, `Guru belum ditempatkan ke rombel: ${placed.error.message}`);
}

// Ubah penempatan rombel guru. Backend belum punya endpoint ubah nama/NIP
// guru; di mode data dummy keduanya ikut diubah, di backend asli diabaikan
// (UI menonaktifkan input-nya).
export async function updateTeacherApi(payload: UpdateTeacherPayload): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    const teacher = mockTeachers.find((item) => item.id === payload.id);
    if (teacher) {
      teacher.name = payload.name;
      teacher.nip = payload.nip;
    }
    if ((payload.current_class_group_id ?? null) !== (payload.class_group_id ?? null)) {
      if (payload.current_class_group_id) mockSetRombelTeacher(payload.current_class_group_id, null);
      if (payload.class_group_id) mockSetRombelTeacher(payload.class_group_id, payload.id);
    }
    return done("Data guru berhasil diperbarui (data dummy)");
  }

  let newRombel: { id: number; academic_year_id: number } | null = null;
  if (payload.class_group_id) {
    const rombel = await getRombel(payload.class_group_id);
    if (!rombel.ok) return rombel;
    newRombel = { id: rombel.data.id, academic_year_id: rombel.data.academic_year_id };
  }

  const placed = await changeTeacherPlacementApi({
    teacherId: payload.id,
    currentAssignmentId: payload.current_assignment_id,
    currentRombelId: payload.current_class_group_id,
    newRombel,
  });
  return placed.ok ? done("Penempatan rombel guru berhasil diperbarui") : placed;
}

// POST /teachers/{id}/inactive: akun guru dinonaktifkan dan penugasan wali
// kelas aktifnya otomatis dilepas oleh backend. Data guru tidak dihapus.
export async function inactiveTeacherApi(id: number): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockInactiveTeacher(id);
    return done("Guru berhasil dinonaktifkan (data dummy)");
  }

  const res = await apiRequest<ApiTeacher>(`/teachers/${id}/inactive`, { method: "POST" });
  return res.ok ? done("Guru berhasil dinonaktifkan") : res;
}

// POST /teachers/{id}/reset-password: wajib body { new_password } (min. 8 karakter).
export async function resetTeacherPasswordApi(
  id: number,
  newPassword: string
): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay(300);
    return done("Password guru berhasil direset (data dummy)");
  }

  const res = await apiRequest<ApiTeacher>(`/teachers/${id}/reset-password`, {
    method: "POST",
    body: { new_password: newPassword },
  });
  return res.ok ? done("Password guru berhasil direset") : res;
}

// GET /teachers/import/template: file .xlsx (Nama Lengkap, NIP, Gender).
export async function downloadTeacherImportTemplateApi(): Promise<ApiResult<DownloadedFile>> {
  return apiDownload("/teachers/import/template");
}

// POST /teachers/import (multipart, file .xlsx maksimal 5 MB). SATU langkah:
// backend langsung memproses dan hasilnya ada di response; baris yang valid
// tetap tersimpan walau ada baris lain yang ditolak.
export async function importTeachersApi(file: File): Promise<ApiResult<TeacherImportResult>> {
  if (isMockEnabled()) {
    await mockDelay();
    void file;
    return {
      ok: true,
      status: 200,
      data: {
        batch_id: 1,
        total_rows: 2,
        processed_rows: 2,
        successful_rows: 1,
        rejected_rows: 1,
        errors: [{ row: 3, field: "nip", code: "duplicate", message: "NIP sudah terdaftar (data dummy)" }],
      },
    };
  }

  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<TeacherImportResult>("/teachers/import", { method: "POST", body: formData });
}

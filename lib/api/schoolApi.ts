import { apiRequest, fetchAllPages } from "@/lib/api/client";
import { changeRombelHomeroomApi } from "@/lib/api/assignmentApi";
import { getMeApi, getSchoolIdApi } from "@/lib/api/authApi";
import { buildClassGroups, loadSchoolBaseData } from "@/lib/api/schoolData";
import {
  mockActivateAcademicYear,
  mockAddAcademicYear,
  mockAddRombel,
  mockDeleteRombel,
  mockSetRombelTeacher,
  mockUpdateAcademicYear,
  mockUpdateRombel,
} from "@/lib/mocks/mockOps";
import { mockSchoolStructure } from "@/lib/mocks/schoolMock";
import {
  ApiAcademicYear,
  ApiHeadmasterDashboard,
  ApiRombel,
} from "@/lib/types/apiModelType";
import { ApiResult } from "@/lib/types/apiType";
import { MutationOutcome } from "@/lib/types/mutationType";
import {
  AcademicYear,
  AcademicYearPayload,
  ClassGroupPayload,
  EditSchoolPayload,
  School,
  SchoolStructureData,
  UpdateClassGroupPayload,
} from "@/lib/types/schoolType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";

const done = (message: string, warning: string | null = null): ApiResult<MutationOutcome> => ({
  ok: true,
  status: 200,
  data: { message, warning },
});

const mapYear = (year: ApiAcademicYear): AcademicYear => ({
  id: year.id,
  name: year.name,
  start_date: year.start_date,
  end_date: year.end_date,
  is_active: year.is_active,
});

// Struktur sekolah: Sekolah -> Tahun Ajaran -> Kelas/Rombel.
export async function getSchoolStructureApi(): Promise<ApiResult<SchoolStructureData>> {
  if (isMockEnabled()) {
    await mockDelay();
    return {
      ok: true,
      status: 200,
      data: {
        school: mockSchoolStructure.school,
        academic_years: [...mockSchoolStructure.academic_years],
        class_groups: [...mockSchoolStructure.class_groups],
      },
    };
  }

  const [me, years, base, dashboard] = await Promise.all([
    getMeApi(),
    fetchAllPages<ApiAcademicYear>("/academic-years"),
    loadSchoolBaseData(),
    apiRequest<ApiHeadmasterDashboard>("/dashboard/headmaster"),
  ]);

  if (!me.ok) return me;
  if (!years.ok) return years;
  if (!base.ok) return base;

  if (!me.data.school) {
    return {
      ok: false,
      status: 403,
      error: { code: "forbidden", message: "Akun ini belum terhubung ke sekolah mana pun.", details: [] },
    };
  }

  // Jumlah siswa hanya tersedia untuk rombel di tahun ajaran aktif. Bila
  // dashboard gagal dimuat, jumlah siswa dikosongkan (bukan menggagalkan halaman).
  const studentCounts = new Map<number, number>();
  if (dashboard.ok) {
    dashboard.data.rombels.forEach((rombel) => studentCounts.set(rombel.id, rombel.student_count));
  }

  // Backend belum menyediakan alamat/status sekolah.
  const school: School = { id: me.data.school.id, name: me.data.school.name, address: null, status: "active" };

  const classGroups = buildClassGroups(base.data, studentCounts).sort(
    (a, b) => a.academic_year_id - b.academic_year_id || a.grade_level - b.grade_level || a.name.localeCompare(b.name)
  );

  return {
    ok: true,
    status: 200,
    data: {
      school,
      academic_years: years.data
        .map(mapYear)
        .sort((a, b) => Number(b.is_active) - Number(a.is_active) || b.start_date.localeCompare(a.start_date)),
      class_groups: classGroups,
    },
  };
}

// Edit nama sekolah: BELUM ADA endpoint di backend. Hanya berjalan di mode
// data dummy; UI menyembunyikan tombolnya saat memakai backend asli.
export async function updateSchoolApi(payload: EditSchoolPayload): Promise<ApiResult<MutationOutcome>> {
  if (!isMockEnabled()) {
    return {
      ok: false,
      status: 501,
      error: { code: "not_implemented", message: "Edit nama sekolah belum tersedia di server.", details: [] },
    };
  }

  await mockDelay();
  mockSchoolStructure.school = { ...mockSchoolStructure.school, name: payload.name };
  return done("Info sekolah berhasil diperbarui (data dummy)");
}

// ----------------------------------------------------------- Tahun ajaran

// POST /academic-years. Tahun ajaran baru selalu nonaktif sampai diaktifkan.
export async function addAcademicYearApi(payload: AcademicYearPayload): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockAddAcademicYear(payload);
    return done("Tahun ajaran berhasil ditambahkan (data dummy)");
  }

  const res = await apiRequest<ApiAcademicYear>("/academic-years", { method: "POST", body: { ...payload } });
  return res.ok ? done("Tahun ajaran berhasil ditambahkan") : res;
}

// PATCH /academic-years/{id}
export async function updateAcademicYearApi(
  id: number,
  payload: AcademicYearPayload
): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockUpdateAcademicYear(id, payload);
    return done("Tahun ajaran berhasil diperbarui (data dummy)");
  }

  const res = await apiRequest<ApiAcademicYear>(`/academic-years/${id}`, {
    method: "PATCH",
    body: { ...payload },
  });
  return res.ok ? done("Tahun ajaran berhasil diperbarui") : res;
}

// POST /academic-years/{id}/activate. Tahun ajaran lain di sekolah yang sama
// otomatis dinonaktifkan oleh backend (hanya satu yang aktif).
export async function activateAcademicYearApi(id: number): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockActivateAcademicYear(id);
    return done("Tahun ajaran berhasil diaktifkan (data dummy)");
  }

  const res = await apiRequest<ApiAcademicYear>(`/academic-years/${id}/activate`, { method: "POST" });
  return res.ok ? done("Tahun ajaran berhasil diaktifkan") : res;
}

// ------------------------------------------------------------------ Rombel

// POST /rombels, lalu (bila dipilih) tugaskan wali kelas lewat penugasan terpisah.
export async function addClassGroupApi(payload: ClassGroupPayload): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockAddRombel(payload.academic_year_id, payload.grade_level, payload.name, payload.homeroom_teacher_id);
    return done("Rombel berhasil ditambahkan (data dummy)");
  }

  const school = await getSchoolIdApi();
  if (!school.ok) return school;

  const created = await apiRequest<ApiRombel>("/rombels", {
    method: "POST",
    body: {
      school_id: school.data,
      academic_year_id: payload.academic_year_id,
      name: payload.name.trim(),
      grade_level: payload.grade_level,
    },
  });
  if (!created.ok) return created;

  if (payload.homeroom_teacher_id) {
    const assigned = await changeRombelHomeroomApi({
      rombelId: created.data.id,
      academicYearId: payload.academic_year_id,
      currentAssignmentId: null,
      currentTeacherId: null,
      newTeacherId: payload.homeroom_teacher_id,
    });
    if (!assigned.ok) {
      return done("Rombel berhasil ditambahkan", `Wali kelas belum ditugaskan: ${assigned.error.message}`);
    }
  }

  return done("Rombel berhasil ditambahkan");
}

// PATCH /rombels/{id}, lalu sesuaikan wali kelas bila berubah.
export async function updateClassGroupApi(payload: UpdateClassGroupPayload): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    mockUpdateRombel(payload.id, payload.academic_year_id, payload.grade_level, payload.name);
    if ((payload.current_teacher_id ?? null) !== (payload.homeroom_teacher_id ?? null)) {
      mockSetRombelTeacher(payload.id, payload.homeroom_teacher_id);
    }
    return done("Rombel berhasil diperbarui (data dummy)");
  }

  const updated = await apiRequest<ApiRombel>(`/rombels/${payload.id}`, {
    method: "PATCH",
    body: {
      academic_year_id: payload.academic_year_id,
      name: payload.name.trim(),
      grade_level: payload.grade_level,
    },
  });
  if (!updated.ok) return updated;

  const homeroom = await changeRombelHomeroomApi({
    rombelId: payload.id,
    academicYearId: payload.academic_year_id,
    currentAssignmentId: payload.current_assignment_id,
    currentTeacherId: payload.current_teacher_id,
    newTeacherId: payload.homeroom_teacher_id,
  });
  if (!homeroom.ok) {
    return done("Data rombel berhasil diperbarui", `Wali kelas belum berubah: ${homeroom.error.message}`);
  }

  return done("Rombel berhasil diperbarui");
}

// DELETE /rombels/{id}. 409 bila rombel masih direferensikan (mis. penugasan
// wali kelas atau siswa); pesannya ditampilkan apa adanya.
export async function deleteClassGroupApi(id: number): Promise<ApiResult<MutationOutcome>> {
  if (isMockEnabled()) {
    await mockDelay();
    const blocked = mockDeleteRombel(id);
    if (blocked) {
      return { ok: false, status: 409, error: { code: "rombel_has_active_assignment", message: blocked, details: [] } };
    }
    return done("Rombel berhasil dihapus (data dummy)");
  }

  const res = await apiRequest<null>(`/rombels/${id}`, { method: "DELETE" });
  return res.ok ? done("Rombel berhasil dihapus") : res;
}

import { apiRequest } from "@/lib/api/client";
import { getSchoolIdApi } from "@/lib/api/authApi";
import { ApiFailure, ApiResult } from "@/lib/types/apiType";

// Penugasan wali kelas (teacher-class-assignments). Satu guru hanya boleh punya
// satu penugasan aktif per tahun ajaran, dan satu rombel hanya satu guru aktif;
// pelanggarannya dijawab backend dengan 409.

const ok = (): ApiResult<null> => ({ ok: true, status: 200, data: null });

const withPrefix = (result: ApiFailure, prefix: string): ApiFailure => ({
  ...result,
  error: { ...result.error, message: `${prefix}${result.error.message}` },
});

const createAssignment = async (
  teacherId: number,
  academicYearId: number,
  rombelId: number
): Promise<ApiResult<unknown>> => {
  const school = await getSchoolIdApi();
  if (!school.ok) return school;

  return apiRequest("/teacher-class-assignments", {
    method: "POST",
    body: {
      teacher_id: teacherId,
      school_id: school.data,
      academic_year_id: academicYearId,
      rombel_id: rombelId,
    },
  });
};

const deactivateAssignment = (assignmentId: number) =>
  apiRequest(`/teacher-class-assignments/${assignmentId}/deactivate`, { method: "POST" });

const moveAssignment = (assignmentId: number, rombelId: number) =>
  apiRequest(`/teacher-class-assignments/${assignmentId}`, {
    method: "PATCH",
    body: { rombel_id: rombelId },
  });

type RombelSideArgs = {
  rombelId: number;
  academicYearId: number;
  currentAssignmentId: number | null;
  currentTeacherId: number | null;
  newTeacherId: number | null;
};

// Ganti wali kelas SEBUAH ROMBEL: lepas penugasan lama, lalu tugaskan guru baru
// (urutan ini wajib; kalau terbalik backend menolak dengan 409).
export async function changeRombelHomeroomApi(args: RombelSideArgs): Promise<ApiResult<null>> {
  const { rombelId, academicYearId, currentAssignmentId, currentTeacherId, newTeacherId } = args;

  if ((currentTeacherId ?? null) === (newTeacherId ?? null)) return ok();

  if (currentAssignmentId) {
    const released = await deactivateAssignment(currentAssignmentId);
    if (!released.ok) return released;
  }

  if (newTeacherId) {
    const created = await createAssignment(newTeacherId, academicYearId, rombelId);
    if (!created.ok) {
      return currentAssignmentId
        ? withPrefix(created, "Wali kelas lama sudah dilepas, tetapi wali kelas baru gagal ditugaskan: ")
        : created;
    }
  }

  return ok();
}

type TeacherSideArgs = {
  teacherId: number;
  currentAssignmentId: number | null;
  currentRombelId: number | null;
  newRombel: { id: number; academic_year_id: number } | null;
};

// Ubah penempatan rombel SEORANG GURU: tugaskan baru, pindahkan, atau lepas.
export async function changeTeacherPlacementApi(args: TeacherSideArgs): Promise<ApiResult<null>> {
  const { teacherId, currentAssignmentId, currentRombelId, newRombel } = args;

  if ((currentRombelId ?? null) === (newRombel?.id ?? null)) return ok();

  if (currentAssignmentId && newRombel) {
    const moved = await moveAssignment(currentAssignmentId, newRombel.id);
    return moved.ok ? ok() : moved;
  }

  if (currentAssignmentId && !newRombel) {
    const released = await deactivateAssignment(currentAssignmentId);
    return released.ok ? ok() : released;
  }

  if (!currentAssignmentId && newRombel) {
    const created = await createAssignment(teacherId, newRombel.academic_year_id, newRombel.id);
    return created.ok ? ok() : created;
  }

  return ok();
}

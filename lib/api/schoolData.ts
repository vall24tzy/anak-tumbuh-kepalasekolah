import { fetchAllPages } from "@/lib/api/client";
import {
  ApiRombel,
  ApiTeacher,
  ApiTeacherAssignment,
} from "@/lib/types/apiModelType";
import { ApiResult } from "@/lib/types/apiType";
import { ClassGroup } from "@/lib/types/schoolType";
import { Teacher } from "@/lib/types/teacherType";

// Data dasar yang dipakai bersama halaman Sekolah dan Wali Kelas:
// rombel + penugasan wali kelas AKTIF + guru, lalu digabung di sini.
export type SchoolBaseData = {
  rombels: ApiRombel[];
  activeAssignments: ApiTeacherAssignment[];
  teachers: ApiTeacher[];
};

export async function loadSchoolBaseData(): Promise<ApiResult<SchoolBaseData>> {
  const [rombels, assignments, teachers] = await Promise.all([
    fetchAllPages<ApiRombel>("/rombels"),
    fetchAllPages<ApiTeacherAssignment>("/teacher-class-assignments"),
    fetchAllPages<ApiTeacher>("/teachers"),
  ]);

  if (!rombels.ok) return rombels;
  if (!assignments.ok) return assignments;
  if (!teachers.ok) return teachers;

  return {
    ok: true,
    status: 200,
    data: {
      rombels: rombels.data,
      activeAssignments: assignments.data.filter((assignment) => assignment.is_active),
      teachers: teachers.data,
    },
  };
}

export const buildTeachers = (base: SchoolBaseData): Teacher[] => {
  const rombelById = new Map(base.rombels.map((rombel) => [rombel.id, rombel]));
  const assignmentByTeacher = new Map(
    base.activeAssignments.map((assignment) => [assignment.teacher_id, assignment])
  );

  return base.teachers.map((teacher) => {
    const assignment = assignmentByTeacher.get(teacher.id);
    const rombel = assignment ? rombelById.get(assignment.rombel_id) : undefined;

    return {
      id: teacher.id,
      name: teacher.name,
      nip: teacher.nip,
      gender: teacher.gender,
      status: teacher.status,
      assignment_id: assignment?.id ?? null,
      class_group_id: rombel?.id ?? null,
      class_group_name: rombel?.name ?? null,
      grade_level: rombel?.grade_level ?? null,
      academic_year_id: rombel?.academic_year_id ?? null,
    };
  });
};

export const buildClassGroups = (
  base: SchoolBaseData,
  studentCounts: Map<number, number>
): ClassGroup[] => {
  const teacherById = new Map(base.teachers.map((teacher) => [teacher.id, teacher]));
  const assignmentByRombel = new Map(
    base.activeAssignments.map((assignment) => [assignment.rombel_id, assignment])
  );

  return base.rombels.map((rombel) => {
    const assignment = assignmentByRombel.get(rombel.id);
    const teacher = assignment ? teacherById.get(assignment.teacher_id) : undefined;

    return {
      id: rombel.id,
      academic_year_id: rombel.academic_year_id,
      grade_level: rombel.grade_level,
      name: rombel.name,
      assignment_id: assignment?.id ?? null,
      homeroom_teacher_id: teacher?.id ?? null,
      homeroom_teacher_name: teacher?.name ?? null,
      total_students: studentCounts.get(rombel.id) ?? null,
    };
  });
};

import { mockSchoolStructure } from "@/lib/mocks/schoolMock";
import { mockTeachers } from "@/lib/mocks/teacherMock";
import { AcademicYearPayload, ClassGroup } from "@/lib/types/schoolType";
import { AddTeacherPayload, Teacher } from "@/lib/types/teacherType";

// Operasi tulis untuk MODE DATA DUMMY. Dua sumber data (struktur sekolah dan
// daftar guru) dijaga konsisten: menugaskan wali kelas memperbarui keduanya.

let idSeq = 100;
const nextId = () => ++idSeq;

export const mockSetRombelTeacher = (rombelId: number, teacherId: number | null) => {
  const group = mockSchoolStructure.class_groups.find((item) => item.id === rombelId);
  if (!group) return;

  // Lepas wali kelas lama
  if (group.homeroom_teacher_id) {
    const old = mockTeachers.find((teacher) => teacher.id === group.homeroom_teacher_id);
    if (old) {
      old.assignment_id = null;
      old.class_group_id = null;
      old.class_group_name = null;
      old.grade_level = null;
      old.academic_year_id = null;
    }
  }

  const teacher = teacherId ? mockTeachers.find((item) => item.id === teacherId) : undefined;
  group.homeroom_teacher_id = teacher?.id ?? null;
  group.homeroom_teacher_name = teacher?.name ?? null;
  group.assignment_id = teacher ? nextId() : null;

  if (teacher) {
    teacher.assignment_id = group.assignment_id;
    teacher.class_group_id = group.id;
    teacher.class_group_name = group.name;
    teacher.grade_level = group.grade_level;
    teacher.academic_year_id = group.academic_year_id;
  }
};

export const mockAddAcademicYear = (payload: AcademicYearPayload) => {
  const year = { id: nextId(), ...payload, is_active: false };
  mockSchoolStructure.academic_years.push(year);
  return year;
};

export const mockUpdateAcademicYear = (id: number, payload: AcademicYearPayload) => {
  const year = mockSchoolStructure.academic_years.find((item) => item.id === id);
  if (year) Object.assign(year, payload);
};

export const mockActivateAcademicYear = (id: number) => {
  mockSchoolStructure.academic_years.forEach((year) => {
    year.is_active = year.id === id;
  });
};

export const mockAddRombel = (
  academicYearId: number,
  gradeLevel: number,
  name: string,
  teacherId: number | null
) => {
  const group: ClassGroup = {
    id: nextId(),
    academic_year_id: academicYearId,
    grade_level: gradeLevel,
    name,
    assignment_id: null,
    homeroom_teacher_id: null,
    homeroom_teacher_name: null,
    total_students: 0,
  };
  mockSchoolStructure.class_groups.push(group);
  if (teacherId) mockSetRombelTeacher(group.id, teacherId);
};

export const mockUpdateRombel = (
  id: number,
  academicYearId: number,
  gradeLevel: number,
  name: string
) => {
  const group = mockSchoolStructure.class_groups.find((item) => item.id === id);
  if (!group) return;
  group.academic_year_id = academicYearId;
  group.grade_level = gradeLevel;
  group.name = name;
  const teacher = mockTeachers.find((item) => item.id === group.homeroom_teacher_id);
  if (teacher) {
    teacher.class_group_name = name;
    teacher.grade_level = gradeLevel;
  }
};

export const mockDeleteRombel = (id: number): string | null => {
  const group = mockSchoolStructure.class_groups.find((item) => item.id === id);
  if (group?.homeroom_teacher_id) {
    return "Rombel masih memiliki assignment yang mereferensikannya";
  }
  mockSchoolStructure.class_groups = mockSchoolStructure.class_groups.filter(
    (item) => item.id !== id
  );
  return null;
};

export const mockAddTeacher = (payload: AddTeacherPayload): Teacher => {
  const teacher: Teacher = {
    id: nextId(),
    name: payload.name,
    nip: payload.nip,
    gender: payload.gender,
    status: "active",
    assignment_id: null,
    class_group_id: null,
    class_group_name: null,
    grade_level: null,
    academic_year_id: null,
  };
  mockTeachers.push(teacher);
  if (payload.class_group_id) mockSetRombelTeacher(payload.class_group_id, teacher.id);
  return teacher;
};

export const mockInactiveTeacher = (id: number) => {
  const teacher = mockTeachers.find((item) => item.id === id);
  if (!teacher) return;
  if (teacher.class_group_id) mockSetRombelTeacher(teacher.class_group_id, null);
  teacher.status = "inactive";
};

import { Teacher } from "@/lib/types/teacherType";

// Array ini sengaja bisa berubah (let-semantik): mutasi mock di teacherApi /
// schoolApi memperbarui isinya supaya tampilan tetap konsisten di mode dummy.
export const mockTeachers: Teacher[] = [
  {
    id: 1,
    name: "Siti Nurhaliza, S.Pd",
    nip: "198901012020012001",
    gender: "perempuan",
    status: "active",
    assignment_id: 1,
    class_group_id: 1,
    class_group_name: "Cendekia",
    grade_level: 5,
    academic_year_id: 1,
  },
  {
    id: 2,
    name: "Rina Lestari, S.Pd",
    nip: "199203152021032002",
    gender: "perempuan",
    status: "active",
    assignment_id: 2,
    class_group_id: 2,
    class_group_name: "B",
    grade_level: 8,
    academic_year_id: 1,
  },
  {
    id: 3,
    name: "Budi Santoso, S.Pd",
    nip: "198505202015041003",
    gender: "laki-laki",
    status: "active",
    assignment_id: null,
    class_group_id: null,
    class_group_name: null,
    grade_level: null,
    academic_year_id: null,
  },
];

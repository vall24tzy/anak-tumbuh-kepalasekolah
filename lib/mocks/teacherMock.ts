import { Teacher } from "@/lib/types/teacherType";

export const mockTeachers: Teacher[] = [
  {
    id: 1,
    uuid: "mock-teacher-1",
    name: "Siti Nurhaliza, S.Pd",
    username: "sitinurhaliza",
    password: "siti1",
    class_group_id: 1,
    class_group_name: "Cendekia",
    education_level: "Kelas 5",
    total_students: 26,
    status: "active",
  },
  {
    id: 2,
    uuid: "mock-teacher-2",
    name: "Rina Lestari, S.Pd",
    username: "rinalestari",
    password: "rina2",
    class_group_id: 2,
    class_group_name: "B",
    education_level: "Kelas 8",
    total_students: 24,
    status: "active",
  },
];

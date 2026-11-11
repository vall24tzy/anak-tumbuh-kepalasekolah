import { SchoolStructureData } from "@/lib/types/schoolType";

export const mockSchoolStructure: SchoolStructureData = {
  school: {
    id: 1,
    name: "SDN Anak Tumbuh 01",
    address: "Jl. Merdeka No. 10, Bandung",
    status: "active",
  },
  academic_years: [
    { id: 1, name: "2026/2027", start_date: "2026-07-01", end_date: "2027-06-30", is_active: true },
    { id: 2, name: "2027/2028", start_date: "2027-07-01", end_date: "2028-06-30", is_active: false },
  ],
  class_groups: [
    {
      id: 1,
      academic_year_id: 1,
      grade_level: 5,
      name: "Cendekia",
      assignment_id: 1,
      homeroom_teacher_id: 1,
      homeroom_teacher_name: "Siti Nurhaliza, S.Pd",
      total_students: 26,
    },
    {
      id: 2,
      academic_year_id: 1,
      grade_level: 8,
      name: "B",
      assignment_id: 2,
      homeroom_teacher_id: 2,
      homeroom_teacher_name: "Rina Lestari, S.Pd",
      total_students: 24,
    },
    {
      id: 3,
      academic_year_id: 2,
      grade_level: 6,
      name: "Cendekia",
      assignment_id: null,
      homeroom_teacher_id: null,
      homeroom_teacher_name: null,
      total_students: null,
    },
  ],
};

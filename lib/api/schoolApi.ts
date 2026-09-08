import {
  SchoolStructureResponse,
  EditSchoolPayload,
  EditSchoolResponse,
  AddAcademicYearPayload,
  AddAcademicYearResponse,
  AddClassGroupPayload,
  AddClassGroupResponse,
  UpdateClassGroupPayload,
  UpdateClassGroupResponse,
} from "@/lib/types/schoolType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";
import { mockSchoolStructure } from "@/lib/mocks/schoolMock";
import { mockTeachers } from "@/lib/mocks/teacherMock";

// Cari nama guru dari id, dipakai buat resolve tampilan Wali Kelas di mode dummy
const resolveTeacherName = (teacherId: number | null): string | null =>
  teacherId ? mockTeachers.find((teacher) => teacher.id === teacherId)?.name ?? null : null;

// Struktur sekolah: Sekolah -> Tahun Ajaran -> Kelas/Rombel
export async function getSchoolStructureApi(): Promise<SchoolStructureResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return mockSchoolStructure;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/school/structure`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Edit info sekolah (nama)
export async function updateSchoolApi(payload: EditSchoolPayload): Promise<EditSchoolResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return {
      code: 200,
      status: "success",
      message: "Info sekolah berhasil diperbarui (data dummy)",
      data: { ...mockSchoolStructure.data!.school, ...payload },
    };
  }

  try {
    const formData = new FormData();
    formData.append("name", payload.name);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/school`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Tambah Tahun Ajaran baru (tidak menghapus histori lama)
export async function addAcademicYearApi(
  payload: AddAcademicYearPayload
): Promise<AddAcademicYearResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return {
      code: 200,
      status: "success",
      message: "Tahun ajaran berhasil ditambahkan (data dummy)",
      data: {
        id: Date.now(),
        uuid: `mock-year-${Date.now()}`,
        name: payload.name,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: "inactive",
      },
    };
  }

  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("start_date", payload.start_date);
    formData.append("end_date", payload.end_date);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/academic-year`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Tambah Kelas/Rombel baru ke tahun ajaran tertentu
export async function addClassGroupApi(
  payload: AddClassGroupPayload
): Promise<AddClassGroupResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return {
      code: 200,
      status: "success",
      message: "Rombel berhasil ditambahkan (data dummy)",
      data: {
        id: Date.now(),
        uuid: `mock-class-${Date.now()}`,
        academic_year_id: payload.academic_year_id,
        education_level: payload.education_level,
        name: payload.name,
        homeroom_teacher_id: payload.homeroom_teacher_id,
        homeroom_teacher_name: resolveTeacherName(payload.homeroom_teacher_id),
        total_students: 0,
      },
    };
  }

  try {
    const formData = new FormData();
    formData.append("academic_year_id", String(payload.academic_year_id));
    formData.append("education_level", payload.education_level);
    formData.append("name", payload.name);
    if (payload.homeroom_teacher_id) {
      formData.append("homeroom_teacher_id", String(payload.homeroom_teacher_id));
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/class-group`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Edit Kelas/Rombel yang sudah ada (terutama ganti Wali Kelas)
export async function updateClassGroupApi(
  payload: UpdateClassGroupPayload
): Promise<UpdateClassGroupResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return {
      code: 200,
      status: "success",
      message: "Rombel berhasil diperbarui (data dummy)",
      data: {
        id: payload.id,
        uuid: `mock-class-${payload.id}`,
        academic_year_id: payload.academic_year_id,
        education_level: payload.education_level,
        name: payload.name,
        homeroom_teacher_id: payload.homeroom_teacher_id,
        homeroom_teacher_name: resolveTeacherName(payload.homeroom_teacher_id),
        total_students: 0,
      },
    };
  }

  try {
    const formData = new FormData();
    formData.append("academic_year_id", String(payload.academic_year_id));
    formData.append("education_level", payload.education_level);
    formData.append("name", payload.name);
    if (payload.homeroom_teacher_id) {
      formData.append("homeroom_teacher_id", String(payload.homeroom_teacher_id));
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/class-group/${payload.id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

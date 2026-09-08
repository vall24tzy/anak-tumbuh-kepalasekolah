import { TeacherListResponse, AddTeacherPayload, AddTeacherResponse } from "@/lib/types/teacherType";
import {
  TeacherImportValidationResponse,
  TeacherImportCommitResponse,
  ValidatedTeacherImportRow,
} from "@/lib/types/teacherImportType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";
import { mockTeachers } from "@/lib/mocks/teacherMock";
import {
  buildMockAddTeacherResponse,
  mockTeacherImportValidationResponse,
  buildMockTeacherImportCommitResponse,
} from "@/lib/mocks/teacherAccountMock";

// Daftar Wali Kelas (Teacher) di sekolah milik Kepala Sekolah yang login
export async function getTeachersApi(): Promise<TeacherListResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return { code: 200, status: "success", message: "OK (data dummy)", data: mockTeachers };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/teacher`, {
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

// Tambah Guru manual. Username & password digenerate otomatis oleh sistem.
export async function addTeacherApi(payload: AddTeacherPayload): Promise<AddTeacherResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return buildMockAddTeacherResponse(payload);
  }

  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.class_group_id) {
      formData.append("class_group_id", String(payload.class_group_id));
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/teacher/store`, {
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

// Tahap 1: Upload file Excel Guru untuk divalidasi
export async function validateTeacherImportApi(
  file: File
): Promise<TeacherImportValidationResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    void file;
    return mockTeacherImportValidationResponse;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/teacher/import/validate`,
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

// Tahap 2: Commit baris yang valid untuk Generate Akun
export async function commitTeacherImportApi(
  rows: ValidatedTeacherImportRow[]
): Promise<TeacherImportCommitResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return buildMockTeacherImportCommitResponse(rows);
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/headmaster/teacher/import/commit`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ rows }),
      }
    );
    return await res.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

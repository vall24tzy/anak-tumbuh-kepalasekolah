import {
  TeacherListResponse,
  AddTeacherPayload,
  AddTeacherResponse,
  UpdateTeacherPayload,
  TeacherMutationResponse,
  DeleteTeacherResponse,
} from "@/lib/types/teacherType";
import {
  TeacherImportValidationResponse,
  TeacherImportCommitResponse,
  ValidatedTeacherImportRow,
} from "@/lib/types/teacherImportType";
import { isMockEnabled, mockDelay } from "@/lib/utils/mock";
import { mockTeachers } from "@/lib/mocks/teacherMock";
import {
  buildMockAddTeacherResponse,
  buildMockUpdateTeacherResponse,
  mockTeacherImportValidationResponse,
  buildMockTeacherImportCommitResponse,
} from "@/lib/mocks/teacherAccountMock";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
const authHeaders = () => ({
  Accept: "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export async function getTeachersApi(): Promise<TeacherListResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return { code: 200, status: "success", message: "OK (data dummy)", data: [...mockTeachers] };
  }

  const res = await fetch(apiUrl("/v1/headmaster/teacher"), { headers: authHeaders() });
  return await res.json();
}

export async function addTeacherApi(payload: AddTeacherPayload): Promise<AddTeacherResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return buildMockAddTeacherResponse(payload);
  }

  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("nip", payload.nip);
  if (payload.class_group_id) formData.append("class_group_id", String(payload.class_group_id));

  const res = await fetch(apiUrl("/v1/headmaster/teacher/store"), {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return await res.json();
}

export async function updateTeacherApi(payload: UpdateTeacherPayload): Promise<TeacherMutationResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return buildMockUpdateTeacherResponse(payload);
  }

  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("nip", payload.nip);
  if (payload.class_group_id) formData.append("class_group_id", String(payload.class_group_id));

  const res = await fetch(apiUrl(`/v1/headmaster/teacher/${payload.id}`), {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
  return await res.json();
}

export async function deleteTeacherApi(id: number): Promise<DeleteTeacherResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return { code: 200, status: "success", message: "Guru berhasil dihapus (data dummy)" };
  }

  const res = await fetch(apiUrl(`/v1/headmaster/teacher/${id}`), {
    method: "DELETE",
    headers: authHeaders(),
  });
  return await res.json();
}

export async function validateTeacherImportApi(file: File): Promise<TeacherImportValidationResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    void file;
    return mockTeacherImportValidationResponse;
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(apiUrl("/v1/headmaster/teacher/import/validate"), {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return await res.json();
}

export async function commitTeacherImportApi(
  rows: ValidatedTeacherImportRow[]
): Promise<TeacherImportCommitResponse> {
  if (isMockEnabled()) {
    await mockDelay();
    return buildMockTeacherImportCommitResponse(rows);
  }

  const res = await fetch(apiUrl("/v1/headmaster/teacher/import/commit"), {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ rows }),
  });
  return await res.json();
}

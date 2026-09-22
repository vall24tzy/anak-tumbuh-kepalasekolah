export type TeacherStatus = "active" | "inactive";

export type Teacher = {
  id: number;
  uuid: string;
  name: string;
  nip: string;
  username: string;
  password: string | null;
  class_group_id: number | null;
  class_group_name: string | null;
  education_level: string | null;
  total_students: number;
  status: TeacherStatus;
};

export type TeacherListResponse = {
  code: number;
  status: string;
  message: string;
  data: Teacher[] | null;
};

export type AddTeacherPayload = {
  name: string;
  nip: string;
  class_group_id: number | null;
};

export type UpdateTeacherPayload = {
  id: number;
  name: string;
  nip: string;
  class_group_id: number | null;
};

export type TeacherMutationResponse = {
  code: number;
  status: string;
  message: string;
  data: Teacher | null;
};

export type DeleteTeacherResponse = {
  code: number;
  status: string;
  message: string;
};

export type AddTeacherResponse = TeacherMutationResponse;

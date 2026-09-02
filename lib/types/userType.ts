import { UserRole } from "@/lib/constants/role";

export type User = {
  id: number;
  uuid: string;
  name: string;
  username: string;
  email: string | null;
  role: UserRole;
  school_id: number | null;
  avatar_url: string | null;
  is_active: number;
};

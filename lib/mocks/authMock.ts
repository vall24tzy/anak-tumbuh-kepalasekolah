import { User } from "@/lib/types/userType";

export const MOCK_ACCESS_TOKEN = "mock-access-token-kepsek-123";

export const mockUser: User = {
  id: 1,
  role: "headmaster",
  name: "Dr. H. Ahmad Sanusi, M.Pd",
  nip: "196501011990011001",
  school: { id: 1, name: "SDN Anak Tumbuh 01" },
};

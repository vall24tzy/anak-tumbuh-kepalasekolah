import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// Jalan pintas baca data auth (user, token, status) dari Redux.
export default function useAuth() {
  return useSelector((state: RootState) => state.auth);
}

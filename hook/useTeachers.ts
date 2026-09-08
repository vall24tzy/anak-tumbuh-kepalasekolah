import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchTeachers } from "@/redux/features/teacher/teacherSlice";

// Ambil daftar Wali Kelas (Teacher) di sekolah
export default function useTeachers() {
  const dispatch = useDispatch<AppDispatch>();
  const teacher = useSelector((state: RootState) => state.teacher);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  return teacher;
}

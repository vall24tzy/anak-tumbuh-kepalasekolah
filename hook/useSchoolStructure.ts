import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSchoolStructure } from "@/redux/features/school/schoolSlice";

// Ambil struktur sekolah: Sekolah -> Tahun Ajaran -> Kelas/Rombel
export default function useSchoolStructure() {
  const dispatch = useDispatch<AppDispatch>();
  const school = useSelector((state: RootState) => state.school);

  useEffect(() => {
    dispatch(fetchSchoolStructure());
  }, [dispatch]);

  return school;
}

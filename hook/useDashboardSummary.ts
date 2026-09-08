import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDashboardSummary } from "@/redux/features/dashboard/dashboardSlice";

// Ambil ringkasan dashboard (sekolah aktif, tahun ajaran, total rombel/guru/siswa)
export default function useDashboardSummary() {
  const dispatch = useDispatch<AppDispatch>();
  const dashboard = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  return dashboard;
}

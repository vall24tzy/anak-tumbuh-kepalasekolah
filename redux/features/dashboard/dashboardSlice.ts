import { getDashboardSummaryApi } from "@/lib/api/dashboardApi";
import { DashboardSummary } from "@/lib/types/dashboardType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk("dashboard/fetchSummary", async () => {
  const response = await getDashboardSummaryApi();
  return response;
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.summary = action.payload.data;
        } else {
          state.error = action.payload.message || "Gagal memuat ringkasan dashboard";
        }
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Gagal memuat ringkasan dashboard";
      });
  },
});

export default dashboardSlice.reducer;

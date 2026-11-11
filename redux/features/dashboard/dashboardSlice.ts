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

export const fetchDashboardSummary = createAsyncThunk<DashboardSummary, void, { rejectValue: string }>(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    const result = await getDashboardSummaryApi();
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  }
);

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
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Gagal memuat ringkasan dashboard";
      });
  },
});

export default dashboardSlice.reducer;

import { loginApi } from "@/lib/api/authApi";
import { AuthApiResponse, LoginPayload } from "@/lib/types/authType";
import { User } from "@/lib/types/userType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  access_token: string;
  loading: boolean;
  error: string | null;
  message: string | null;
  code: number;
}

const initialState: AuthState = {
  user: null,
  access_token: "",
  loading: false,
  error: null,
  message: null,
  code: 0,
};

// Thunk: Login Kepala Sekolah (Headmaster)
export const login = createAsyncThunk<AuthApiResponse, LoginPayload>(
  "auth/login",
  async (payload) => {
    const response = await loginApi(payload);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.access_token = "";
      state.code = 0;
      state.message = null;
      state.error = null;
      state.loading = false;
    },
    clearAuthMessage: (state) => {
      state.message = null;
      state.error = null;
      state.code = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthApiResponse>) => {
        state.loading = false;
        state.code = action.payload.code;
        state.message = action.payload.message;
        state.user = action.payload.data;
        state.access_token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Gagal melakukan login";
      });
  },
});

export const { resetAuth, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;

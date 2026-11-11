import { getMeApi, loginApi } from "@/lib/api/authApi";
import { getToken } from "@/lib/auth/token";
import { AuthSession, LoginPayload } from "@/lib/types/authType";
import { User } from "@/lib/types/userType";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  access_token: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  access_token: "",
  loading: false,
  error: null,
};

// Thunk: Login Kepala Sekolah (Headmaster). Pesan error backend dibawa lewat rejectValue.
export const login = createAsyncThunk<AuthSession, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    const result = await loginApi(payload);
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  }
);

// Thunk: pulihkan user dari token yang tersimpan (dipakai setelah refresh
// halaman, karena state Redux hilang saat reload). 401 ditangani client API
// (token dihapus + kembali ke login).
export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    const result = await getMeApi();
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.access_token = "";
      state.error = null;
      state.loading = false;
    },
    clearAuthMessage: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthSession>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Gagal melakukan login";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.access_token = getToken();
      });
  },
});

export const { resetAuth, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;

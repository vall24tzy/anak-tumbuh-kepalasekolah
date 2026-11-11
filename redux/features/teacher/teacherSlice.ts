import {
  addTeacherApi,
  getTeachersApi,
  importTeachersApi,
  inactiveTeacherApi,
  resetTeacherPasswordApi,
  updateTeacherApi,
} from "@/lib/api/teacherApi";
import { ApiResult } from "@/lib/types/apiType";
import { MutationOutcome } from "@/lib/types/mutationType";
import { TeacherImportResult } from "@/lib/types/teacherImportType";
import { AddTeacherPayload, Teacher, UpdateTeacherPayload } from "@/lib/types/teacherType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;

  saving: boolean;
  saveMessage: string | null;
  saveWarning: string | null;
  saveError: string | null;

  importLoading: boolean;
  importError: string | null;
  importResult: TeacherImportResult | null;
}

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,

  saving: false,
  saveMessage: null,
  saveWarning: null,
  saveError: null,

  importLoading: false,
  importError: null,
  importResult: null,
};

// Daftar tidak menampilkan loader layar penuh bila sudah ada data (supaya
// modal yang terbuka tidak ikut hilang saat daftar dimuat ulang).
export const fetchTeachers = createAsyncThunk<Teacher[], void, { rejectValue: string }>(
  "teacher/fetchList",
  async (_, { rejectWithValue }) => {
    const result = await getTeachersApi();
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  }
);

const createMutation = <Arg>(
  type: string,
  call: (arg: Arg) => Promise<ApiResult<MutationOutcome>>
) =>
  createAsyncThunk<MutationOutcome, Arg, { rejectValue: string }>(
    `teacher/${type}`,
    async (arg, { dispatch, rejectWithValue }) => {
      const result = await call(arg);
      if (!result.ok) return rejectWithValue(result.error.message);
      await dispatch(fetchTeachers());
      return result.data;
    }
  );

export const addTeacher = createMutation<AddTeacherPayload>("add", addTeacherApi);
export const updateTeacher = createMutation<UpdateTeacherPayload>("update", updateTeacherApi);
export const inactiveTeacher = createMutation<number>("inactive", inactiveTeacherApi);
export const resetTeacherPassword = createMutation<{ id: number; newPassword: string }>(
  "resetPassword",
  ({ id, newPassword }) => resetTeacherPasswordApi(id, newPassword)
);

// Import satu langkah: file langsung diproses backend.
export const importTeachers = createAsyncThunk<TeacherImportResult, File, { rejectValue: string }>(
  "teacher/import",
  async (file, { dispatch, rejectWithValue }) => {
    const result = await importTeachersApi(file);
    if (!result.ok) return rejectWithValue(result.error.message);
    await dispatch(fetchTeachers());
    return result.data;
  }
);

const mutations = [addTeacher, updateTeacher, inactiveTeacher, resetTeacherPassword];

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    clearSaveFeedback: (state) => {
      state.saveMessage = null;
      state.saveWarning = null;
      state.saveError = null;
    },
    resetTeacherImportWizard: (state) => {
      state.importLoading = false;
      state.importError = null;
      state.importResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = state.teachers.length === 0;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Gagal memuat daftar guru";
      })

      .addCase(importTeachers.pending, (state) => {
        state.importLoading = true;
        state.importError = null;
      })
      .addCase(importTeachers.fulfilled, (state, action) => {
        state.importLoading = false;
        state.importResult = action.payload;
      })
      .addCase(importTeachers.rejected, (state, action) => {
        state.importLoading = false;
        state.importError = action.payload ?? action.error.message ?? "Import gagal diproses";
      });

    mutations.forEach((mutation) => {
      builder
        .addCase(mutation.pending, (state) => {
          state.saving = true;
          state.saveMessage = null;
          state.saveWarning = null;
          state.saveError = null;
        })
        .addCase(mutation.fulfilled, (state, action) => {
          state.saving = false;
          state.saveMessage = action.payload.message;
          state.saveWarning = action.payload.warning;
        })
        .addCase(mutation.rejected, (state, action) => {
          state.saving = false;
          state.saveError = action.payload ?? action.error.message ?? "Gagal menyimpan perubahan";
        });
    });
  },
});

export const { clearSaveFeedback, resetTeacherImportWizard } = teacherSlice.actions;
export default teacherSlice.reducer;

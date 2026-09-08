import { getTeachersApi, addTeacherApi, validateTeacherImportApi, commitTeacherImportApi } from "@/lib/api/teacherApi";
import { Teacher, AddTeacherPayload } from "@/lib/types/teacherType";
import { ValidatedTeacherImportRow } from "@/lib/types/teacherImportType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type TeacherImportStep = "idle" | "preview" | "done";

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;

  addLoading: boolean;
  addError: string | null;

  importStep: TeacherImportStep;
  importLoading: boolean;
  importError: string | null;
  importRows: ValidatedTeacherImportRow[];
  importValidCount: number;
  importInvalidCount: number;
  importedCount: number;
}

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,

  addLoading: false,
  addError: null,

  importStep: "idle",
  importLoading: false,
  importError: null,
  importRows: [],
  importValidCount: 0,
  importInvalidCount: 0,
  importedCount: 0,
};

export const fetchTeachers = createAsyncThunk("teacher/fetchList", async () => {
  const response = await getTeachersApi();
  return response;
});

export const addTeacher = createAsyncThunk("teacher/add", async (payload: AddTeacherPayload) => {
  const response = await addTeacherApi(payload);
  return response;
});

export const validateTeacherImport = createAsyncThunk(
  "teacher/validateImport",
  async (file: File) => {
    const response = await validateTeacherImportApi(file);
    return response;
  }
);

export const commitTeacherImport = createAsyncThunk(
  "teacher/commitImport",
  async (rows: ValidatedTeacherImportRow[]) => {
    const response = await commitTeacherImportApi(rows);
    return response;
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    resetAddTeacherStatus: (state) => {
      state.addError = null;
    },
    resetTeacherImportWizard: (state) => {
      state.importStep = "idle";
      state.importError = null;
      state.importRows = [];
      state.importValidCount = 0;
      state.importInvalidCount = 0;
      state.importedCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.teachers = action.payload.data;
        } else {
          state.error = action.payload.message || "Gagal memuat daftar wali kelas";
        }
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Gagal memuat daftar wali kelas";
      })

      // Tambah Guru
      .addCase(addTeacher.pending, (state) => {
        state.addLoading = true;
        state.addError = null;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.addLoading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.teachers = [...state.teachers, action.payload.data];
        } else {
          state.addError = action.payload.message || "Gagal menambahkan guru";
        }
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.addLoading = false;
        state.addError = action.error.message || "Gagal menambahkan guru";
      })

      // Validasi import
      .addCase(validateTeacherImport.pending, (state) => {
        state.importLoading = true;
        state.importError = null;
      })
      .addCase(validateTeacherImport.fulfilled, (state, action) => {
        state.importLoading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.importRows = action.payload.data.rows;
          state.importValidCount = action.payload.data.valid_count;
          state.importInvalidCount = action.payload.data.invalid_count;
          state.importStep = "preview";
        } else {
          state.importError = action.payload.message || "File gagal divalidasi";
        }
      })
      .addCase(validateTeacherImport.rejected, (state, action) => {
        state.importLoading = false;
        state.importError = action.error.message || "File gagal divalidasi";
      })

      // Commit import
      .addCase(commitTeacherImport.pending, (state) => {
        state.importLoading = true;
        state.importError = null;
      })
      .addCase(commitTeacherImport.fulfilled, (state, action) => {
        state.importLoading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.importedCount = action.payload.data.imported_count;
          state.importStep = "done";
        } else {
          state.importError = action.payload.message || "Import gagal dikomit";
        }
      })
      .addCase(commitTeacherImport.rejected, (state, action) => {
        state.importLoading = false;
        state.importError = action.error.message || "Import gagal dikomit";
      });
  },
});

export const { resetAddTeacherStatus, resetTeacherImportWizard } = teacherSlice.actions;
export default teacherSlice.reducer;

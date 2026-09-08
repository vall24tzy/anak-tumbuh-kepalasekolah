import {
  getSchoolStructureApi,
  updateSchoolApi,
  addAcademicYearApi,
  addClassGroupApi,
  updateClassGroupApi,
} from "@/lib/api/schoolApi";
import {
  SchoolStructureData,
  EditSchoolPayload,
  AddAcademicYearPayload,
  AddClassGroupPayload,
  UpdateClassGroupPayload,
} from "@/lib/types/schoolType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SchoolState {
  structure: SchoolStructureData | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveMessage: string | null;
}

const initialState: SchoolState = {
  structure: null,
  loading: false,
  error: null,
  saving: false,
  saveMessage: null,
};

export const fetchSchoolStructure = createAsyncThunk("school/fetchStructure", async () => {
  const response = await getSchoolStructureApi();
  return response;
});

export const updateSchool = createAsyncThunk(
  "school/update",
  async (payload: EditSchoolPayload) => {
    const response = await updateSchoolApi(payload);
    return response;
  }
);

export const addAcademicYear = createAsyncThunk(
  "school/addAcademicYear",
  async (payload: AddAcademicYearPayload) => {
    const response = await addAcademicYearApi(payload);
    return response;
  }
);

export const addClassGroup = createAsyncThunk(
  "school/addClassGroup",
  async (payload: AddClassGroupPayload) => {
    const response = await addClassGroupApi(payload);
    return response;
  }
);

export const updateClassGroup = createAsyncThunk(
  "school/updateClassGroup",
  async (payload: UpdateClassGroupPayload) => {
    const response = await updateClassGroupApi(payload);
    return response;
  }
);

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    clearSaveMessage: (state) => {
      state.saveMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolStructure.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.code === 200 && action.payload.data) {
          state.structure = action.payload.data;
        } else {
          state.error = action.payload.message || "Gagal memuat struktur sekolah";
        }
      })
      .addCase(fetchSchoolStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Gagal memuat struktur sekolah";
      })

      .addCase(updateSchool.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload.code === 200 && action.payload.data && state.structure) {
          state.structure.school = action.payload.data;
          state.saveMessage = action.payload.message;
        }
      })
      .addCase(updateSchool.rejected, (state) => {
        state.saving = false;
      })

      .addCase(addAcademicYear.pending, (state) => {
        state.saving = true;
      })
      .addCase(addAcademicYear.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload.code === 200 && action.payload.data && state.structure) {
          state.structure.academic_years = [...state.structure.academic_years, action.payload.data];
          state.saveMessage = action.payload.message;
        }
      })
      .addCase(addAcademicYear.rejected, (state) => {
        state.saving = false;
      })

      .addCase(addClassGroup.pending, (state) => {
        state.saving = true;
      })
      .addCase(addClassGroup.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload.code === 200 && action.payload.data && state.structure) {
          state.structure.class_groups = [...state.structure.class_groups, action.payload.data];
          state.saveMessage = action.payload.message;
        }
      })
      .addCase(addClassGroup.rejected, (state) => {
        state.saving = false;
      })

      .addCase(updateClassGroup.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateClassGroup.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload.code === 200 && action.payload.data && state.structure) {
          state.structure.class_groups = state.structure.class_groups.map((group) =>
            group.id === action.payload.data!.id ? action.payload.data! : group
          );
          state.saveMessage = action.payload.message;
        }
      })
      .addCase(updateClassGroup.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const { clearSaveMessage } = schoolSlice.actions;
export default schoolSlice.reducer;

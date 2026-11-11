import {
  activateAcademicYearApi,
  addAcademicYearApi,
  addClassGroupApi,
  deleteClassGroupApi,
  getSchoolStructureApi,
  updateAcademicYearApi,
  updateClassGroupApi,
  updateSchoolApi,
} from "@/lib/api/schoolApi";
import { ApiResult } from "@/lib/types/apiType";
import { MutationOutcome } from "@/lib/types/mutationType";
import {
  AcademicYearPayload,
  ClassGroupPayload,
  EditSchoolPayload,
  SchoolStructureData,
  UpdateClassGroupPayload,
} from "@/lib/types/schoolType";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SchoolState {
  structure: SchoolStructureData | null;
  loading: boolean;
  error: string | null;

  saving: boolean;
  saveMessage: string | null;
  // Langkah utama tersimpan tetapi langkah lanjutan (mis. tugaskan wali kelas) gagal.
  saveWarning: string | null;
  saveError: string | null;
}

const initialState: SchoolState = {
  structure: null,
  loading: false,
  error: null,

  saving: false,
  saveMessage: null,
  saveWarning: null,
  saveError: null,
};

// Pemuatan ulang tidak menampilkan loader layar penuh bila data sudah ada
// (stale-while-revalidate), supaya modal yang sedang terbuka tidak tertutup.
export const fetchSchoolStructure = createAsyncThunk<SchoolStructureData, void, { rejectValue: string }>(
  "school/fetchStructure",
  async (_, { rejectWithValue }) => {
    const result = await getSchoolStructureApi();
    if (!result.ok) return rejectWithValue(result.error.message);
    return result.data;
  }
);

// Semua operasi tulis memakai pola yang sama: panggil API, bila sukses muat
// ulang struktur (karena data digabung dari beberapa endpoint).
const createMutation = <Arg>(
  type: string,
  call: (arg: Arg) => Promise<ApiResult<MutationOutcome>>
) =>
  createAsyncThunk<MutationOutcome, Arg, { rejectValue: string }>(
    `school/${type}`,
    async (arg, { dispatch, rejectWithValue }) => {
      const result = await call(arg);
      if (!result.ok) return rejectWithValue(result.error.message);
      await dispatch(fetchSchoolStructure());
      return result.data;
    }
  );

export const updateSchool = createMutation<EditSchoolPayload>("updateSchool", updateSchoolApi);
export const addAcademicYear = createMutation<AcademicYearPayload>("addAcademicYear", addAcademicYearApi);
export const updateAcademicYear = createMutation<{ id: number; payload: AcademicYearPayload }>(
  "updateAcademicYear",
  ({ id, payload }) => updateAcademicYearApi(id, payload)
);
export const activateAcademicYear = createMutation<number>("activateAcademicYear", activateAcademicYearApi);
export const addClassGroup = createMutation<ClassGroupPayload>("addClassGroup", addClassGroupApi);
export const updateClassGroup = createMutation<UpdateClassGroupPayload>("updateClassGroup", updateClassGroupApi);
export const deleteClassGroup = createMutation<number>("deleteClassGroup", deleteClassGroupApi);

const mutations = [
  updateSchool,
  addAcademicYear,
  updateAcademicYear,
  activateAcademicYear,
  addClassGroup,
  updateClassGroup,
  deleteClassGroup,
];

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    clearSaveFeedback: (state) => {
      state.saveMessage = null;
      state.saveWarning = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolStructure.pending, (state) => {
        state.loading = state.structure === null;
        state.error = null;
      })
      .addCase(fetchSchoolStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structure = action.payload;
      })
      .addCase(fetchSchoolStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Gagal memuat struktur sekolah";
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

export const { clearSaveFeedback } = schoolSlice.actions;
export default schoolSlice.reducer;

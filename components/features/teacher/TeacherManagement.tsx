"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiUser, CiRedo, CiImport, CiCirclePlus } from "react-icons/ci";
import { AppDispatch, RootState } from "@/redux/store";
import useTeachers from "@/hook/useTeachers";
import useSearchFilter from "@/hook/useSearchFilter";
import {
  clearSaveFeedback,
  fetchTeachers,
  inactiveTeacher,
} from "@/redux/features/teacher/teacherSlice";
import { Teacher } from "@/lib/types/teacherType";
import { gradeLevelToLabel } from "@/lib/utils/mappers";
import SearchInput from "@/components/ui/Search/SearchInput";
import TeacherTable from "@/components/features/teacher/TeacherTable";
import EditTeacherModal from "@/components/features/teacher/EditTeacherModal";
import AddTeacherModal from "@/components/features/teacher/AddTeacherModal";
import ImportTeacherWizard from "@/components/features/teacher/ImportTeacherWizard";
import ResetTeacherPasswordModal from "@/components/features/teacher/ResetTeacherPasswordModal";
import FeedbackBanner from "@/components/ui/Alert/FeedbackBanner";
import SpinLoader from "@/components/ui/Loader/SpinLoader";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";

const getTeacherSearchText = (teacher: Teacher) => [
  teacher.name,
  teacher.nip,
  teacher.class_group_name ?? "",
  teacher.grade_level ? gradeLevelToLabel(teacher.grade_level) : "",
];

function TeacherManagement() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [resetTarget, setResetTarget] = useState<Teacher | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { teachers, loading, error } = useTeachers();
  const { saving, saveMessage, saveWarning, saveError } = useSelector(
    (state: RootState) => state.teacher
  );
  const isModalOpen = isAddOpen || isImportOpen || Boolean(editingTeacher) || Boolean(resetTarget);
  const { query, setQuery, filteredItems: filteredTeachers } = useSearchFilter(
    teachers,
    getTeacherSearchText
  );

  const handleDeactivate = async (teacher: Teacher) => {
    const confirmed = window.confirm(
      `Nonaktifkan guru ${teacher.name}?\n\nSemua penugasan wali kelas aktifnya akan ditutup dan guru tidak bisa login lagi. Tindakan ini TIDAK BISA dibatalkan: guru yang sudah nonaktif tidak dapat diaktifkan kembali. Data guru tetap tersimpan (tidak dihapus).`
    );
    if (!confirmed) return;
    dispatch(clearSaveFeedback());
    await dispatch(inactiveTeacher(teacher.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-primary-500">
            <CiUser size={18} />
            Master Guru
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-primary-900 sm:text-3xl">
            Guru &amp; Wali Kelas
          </h1>
          <p className="mt-1 max-w-xl text-sm font-semibold text-primary-900/55">
            Akun login dibuat otomatis (username dan password awal = NIP). Kepala Sekolah dapat
            mengelola penempatan guru ke rombel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(fetchTeachers())}
            className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 bg-white p-2.5 text-primary-900 transition hover:bg-primary-50"
            aria-label="Refresh"
          >
            <CiRedo size={18} />
          </button>
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-2.5 text-sm font-black text-primary-900 transition hover:bg-primary-50"
          >
            <CiImport size={18} />
            Import Guru
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-600"
          >
            <CiCirclePlus size={18} />
            Tambah Guru
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          placeholder="Cari nama, NIP / ID, atau rombel..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="inline-flex w-fit items-center rounded-full bg-primary-50 px-3.5 py-2 text-xs font-black text-primary-900">
          {teachers.length} guru
        </span>
      </div>

      <FeedbackBanner
        message={saveMessage}
        warning={saveWarning}
        error={isModalOpen ? null : saveError}
        onClose={() => dispatch(clearSaveFeedback())}
      />

      {error && <ErrorAlert message={error} />}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <SpinLoader size={48} />
        </div>
      ) : (
        <TeacherTable
          teachers={filteredTeachers}
          busy={saving}
          onEdit={setEditingTeacher}
          onResetPassword={setResetTarget}
          onDeactivate={handleDeactivate}
        />
      )}

      {isAddOpen && <AddTeacherModal onClose={() => setIsAddOpen(false)} />}
      {isImportOpen && <ImportTeacherWizard onClose={() => setIsImportOpen(false)} />}
      {editingTeacher && <EditTeacherModal teacher={editingTeacher} onClose={() => setEditingTeacher(null)} />}
      {resetTarget && (
        <ResetTeacherPasswordModal teacher={resetTarget} onClose={() => setResetTarget(null)} />
      )}
    </div>
  );
}

export default TeacherManagement;

"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  validateTeacherImport,
  commitTeacherImport,
  resetTeacherImportWizard,
  fetchTeachers,
} from "@/redux/features/teacher/teacherSlice";
import FileInput from "@/components/ui/File/FileInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";
import ImportTeacherPreviewTable from "@/components/features/teacher/ImportTeacherPreviewTable";

type ImportTeacherWizardProps = {
  onClose: () => void;
};

function ImportTeacherWizard({ onClose }: ImportTeacherWizardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    importStep,
    importLoading,
    importError,
    importRows,
    importValidCount,
    importInvalidCount,
    importedCount,
  } = useSelector((state: RootState) => state.teacher);

  const handleClose = () => {
    dispatch(resetTeacherImportWizard());
    onClose();
  };

  const handleFileSelect = (file: File) => {
    dispatch(validateTeacherImport(file));
  };

  const handleCommit = async () => {
    const result = await dispatch(commitTeacherImport(importRows));
    if (commitTeacherImport.fulfilled.match(result) && result.payload.code === 200) {
      dispatch(fetchTeachers());
    }
  };

  return (
    <BaseModal
      eyebrow="Guru & Wali Kelas"
      title="Import Guru via Excel"
      onClose={handleClose}
      size="lg"
    >
      {importError && <ErrorAlert message={importError} />}

      {importStep === "idle" && <FileInput onFileSelect={handleFileSelect} />}

      {importLoading && importStep === "idle" && (
        <p className="mt-4 text-center text-xs font-bold text-primary-500">Memvalidasi file...</p>
      )}

      {importStep === "preview" && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-primary-900/60">
            {importRows.length} baris · {importValidCount} valid · {importInvalidCount} error
          </p>
          <ImportTeacherPreviewTable rows={importRows} />
          <PrimaryButton
            type="button"
            isLoading={importLoading}
            disabled={importInvalidCount > 0 || importValidCount === 0}
            onClick={handleCommit}
          >
            Import {importValidCount} Guru Valid
          </PrimaryButton>
          {importInvalidCount > 0 && (
            <p className="text-center text-xs font-semibold text-red-600">
              Perbaiki baris error pada file lalu upload ulang.
            </p>
          )}
        </div>
      )}

      {importStep === "done" && (
        <div className="py-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="mt-4 text-lg font-black text-primary-900">Import berhasil</h3>
          <p className="mt-2 text-sm font-semibold text-primary-900/60">
            {importedCount} guru berhasil ditambahkan.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-xl bg-primary-500 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-600"
          >
            Selesai
          </button>
        </div>
      )}
    </BaseModal>
  );
}

export default ImportTeacherWizard;

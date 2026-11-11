"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { importTeachers, resetTeacherImportWizard } from "@/redux/features/teacher/teacherSlice";
import { downloadTeacherImportTemplateApi } from "@/lib/api/teacherApi";
import { saveBlob } from "@/lib/utils/download";
import { IMPORT_MAX_ROWS, validateImportFile } from "@/lib/utils/importFile";
import { isMockEnabled } from "@/lib/utils/mock";
import FileInput from "@/components/ui/File/FileInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";

type ImportTeacherWizardProps = {
  onClose: () => void;
};

// Import SATU langkah: begitu "Import" ditekan, backend langsung memproses
// file dan menyimpan baris yang valid (tidak ada layar preview/validasi).
function ImportTeacherWizard({ onClose }: ImportTeacherWizardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { importLoading, importError, importResult } = useSelector(
    (state: RootState) => state.teacher
  );

  const fileRef = useRef<File | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [templateLoading, setTemplateLoading] = useState(false);

  const handleClose = () => {
    fileRef.current = null;
    dispatch(resetTeacherImportWizard());
    onClose();
  };

  const handleFileSelect = (file: File) => {
    const problem = validateImportFile(file);
    if (problem) {
      fileRef.current = null;
      setHasFile(false);
      setTemplateError(problem);
      return;
    }
    setTemplateError(null);
    fileRef.current = file;
    setHasFile(true);
  };

  const handleImport = () => {
    if (fileRef.current) dispatch(importTeachers(fileRef.current));
  };

  const handleDownloadTemplate = async () => {
    setTemplateError(null);
    setTemplateLoading(true);
    const result = await downloadTeacherImportTemplateApi();
    setTemplateLoading(false);

    if (!result.ok) {
      setTemplateError(result.error.message);
      return;
    }
    saveBlob(result.data.blob, result.data.filename ?? "template_import_guru.xlsx");
  };

  return (
    <BaseModal
      eyebrow="Guru & Wali Kelas"
      title="Import Guru via Excel"
      onClose={handleClose}
      size="lg"
    >
      {importError && <ErrorAlert message={importError} />}
      {templateError && <ErrorAlert message={templateError} onClose={() => setTemplateError(null)} />}

      {!importResult && (
        <div className="space-y-3">
          <FileInput
            accept=".xlsx"
            description={`Format .xlsx (kolom: Nama Lengkap, NIP, Gender), maksimal 5 MB dan ${IMPORT_MAX_ROWS} baris per file. File yang lebih besar harus dipecah.`}
            onFileSelect={handleFileSelect}
          />

          {!isMockEnabled() && (
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={templateLoading}
              className="w-full rounded-xl border border-primary-200 px-4 py-2.5 text-xs font-black text-primary-900 transition hover:bg-primary-50 disabled:opacity-50"
            >
              {templateLoading ? "Mengunduh..." : "Unduh Template Excel"}
            </button>
          )}

          <p className="text-center text-xs font-semibold text-primary-900/55">
            File langsung diproses saat kamu menekan Import. Baris yang valid tersimpan, baris
            yang bermasalah dilaporkan setelahnya. Akun login guru dibuat otomatis (username dan
            password awal = NIP).
          </p>

          <PrimaryButton
            type="button"
            isLoading={importLoading}
            disabled={!hasFile}
            onClick={handleImport}
          >
            Import Guru
          </PrimaryButton>
        </div>
      )}

      {importResult && (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <span className="text-2xl">✓</span>
          </div>
          <h3 className="mt-4 text-lg font-black text-primary-900">Import selesai</h3>
          <p className="mt-2 text-sm font-semibold text-primary-900/60">
            {importResult.successful_rows} dari {importResult.total_rows} baris berhasil
            ditambahkan
            {importResult.rejected_rows > 0 ? `, ${importResult.rejected_rows} baris ditolak.` : "."}
          </p>

          {importResult.errors.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-red-100 text-left">
              <table className="w-full min-w-[420px] text-xs">
                <thead className="bg-red-50 text-red-700">
                  <tr>
                    <th className="px-3 py-3 font-bold">Baris</th>
                    <th className="px-3 py-3 font-bold">Alasan ditolak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-50">
                  {importResult.errors.map((error) => (
                    <tr key={`${error.row}-${error.code}-${error.field ?? ""}`}>
                      <td className="px-3 py-3 font-black text-primary-900">{error.row}</td>
                      <td className="px-3 py-3 text-red-600">{error.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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

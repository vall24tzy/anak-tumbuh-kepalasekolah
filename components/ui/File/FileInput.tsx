"use client";

import { ChangeEvent, useRef, useState } from "react";
import { CiFileOn } from "react-icons/ci";

type FileInputProps = {
  accept?: string;
  onFileSelect: (file: File) => void;
};

function FileInput({ accept = ".xlsx,.csv", onFileSelect }: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
  };

  return (
    <div className="rounded-3xl border-2 border-dashed border-primary-200 bg-primary-50/50 p-8 text-center">
      <CiFileOn size={40} className="mx-auto text-primary-500" />
      <p className="mt-3 text-sm font-extrabold text-primary-900">Upload data guru</p>
      <p className="mt-1 text-xs font-semibold text-primary-900/55">
        Format .xlsx atau .csv sesuai template Excel Import Guru
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-primary-600"
      >
        Pilih File
      </button>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {fileName && <p className="mt-3 text-xs font-bold text-primary-900/70">{fileName}</p>}
    </div>
  );
}

export default FileInput;

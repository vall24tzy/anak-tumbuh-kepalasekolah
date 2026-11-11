"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addAcademicYear,
  clearSaveFeedback,
  updateAcademicYear,
} from "@/redux/features/school/schoolSlice";
import { AcademicYear } from "@/lib/types/schoolType";
import TextInput from "@/components/ui/Input/TextInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";

type AddAcademicYearModalProps = {
  onClose: () => void;
  academicYear?: AcademicYear; // ada isinya = mode Edit, kosong = mode Tambah
};

function AddAcademicYearModal({ onClose, academicYear }: AddAcademicYearModalProps) {
  const isEditMode = Boolean(academicYear);

  const [name, setName] = useState(academicYear?.name ?? "");
  const [startDate, setStartDate] = useState(academicYear?.start_date ?? "");
  const [endDate, setEndDate] = useState(academicYear?.end_date ?? "");

  const dispatch = useDispatch<AppDispatch>();
  const { saving, saveError } = useSelector((state: RootState) => state.school);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearSaveFeedback());

    const payload = { name: name.trim(), start_date: startDate, end_date: endDate };
    const result = academicYear
      ? await dispatch(updateAcademicYear({ id: academicYear.id, payload }))
      : await dispatch(addAcademicYear(payload));

    const thunk = academicYear ? updateAcademicYear : addAcademicYear;
    if (thunk.fulfilled.match(result)) onClose();
  };

  return (
    <BaseModal
      title={isEditMode ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
      subtitle="Enrollment baru memakai konteks tahun ajaran ini tanpa menghapus histori lama."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Tahun Ajaran"
          name="name"
          type="text"
          placeholder="contoh: 2027/2028"
          maxLength={30}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextInput
          label="Mulai"
          name="start_date"
          type="date"
          required
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
        <TextInput
          label="Selesai"
          name="end_date"
          type="date"
          required
          min={startDate || undefined}
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
        {saveError && <ErrorAlert message={saveError} />}
        <PrimaryButton isLoading={saving}>
          {isEditMode ? "Simpan Perubahan" : "Tambah Tahun Ajaran"}
        </PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default AddAcademicYearModal;

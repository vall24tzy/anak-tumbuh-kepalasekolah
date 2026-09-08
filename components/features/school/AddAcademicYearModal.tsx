"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addAcademicYear } from "@/redux/features/school/schoolSlice";
import TextInput from "@/components/ui/Input/TextInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import BaseModal from "@/components/ui/Modal/BaseModal";

type AddAcademicYearModalProps = {
  onClose: () => void;
};

function AddAcademicYearModal({ onClose }: AddAcademicYearModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { saving } = useSelector((state: RootState) => state.school);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      addAcademicYear({ name, start_date: startDate, end_date: endDate })
    );
    if (addAcademicYear.fulfilled.match(result) && result.payload.code === 200) {
      onClose();
    }
  };

  return (
    <BaseModal
      title="Tambah Tahun Ajaran"
      subtitle="Enrollment baru memakai konteks tahun ajaran ini tanpa menghapus histori lama."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Tahun Ajaran"
          name="name"
          type="text"
          placeholder="contoh: 2027/2028"
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
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
        />
        <PrimaryButton isLoading={saving}>Tambah Tahun Ajaran</PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default AddAcademicYearModal;

"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateSchool } from "@/redux/features/school/schoolSlice";
import { School } from "@/lib/types/schoolType";
import TextInput from "@/components/ui/Input/TextInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import BaseModal from "@/components/ui/Modal/BaseModal";

type EditSchoolModalProps = {
  school: School;
  onClose: () => void;
};

function EditSchoolModal({ school, onClose }: EditSchoolModalProps) {
  const [name, setName] = useState(school.name);

  const dispatch = useDispatch<AppDispatch>();
  const { saving } = useSelector((state: RootState) => state.school);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(updateSchool({ name }));
    if (updateSchool.fulfilled.match(result) && result.payload.code === 200) {
      onClose();
    }
  };

  return (
    <BaseModal title="Edit Sekolah" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Sekolah"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <PrimaryButton isLoading={saving}>Simpan Perubahan</PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default EditSchoolModal;

"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTeacher, resetAddTeacherStatus } from "@/redux/features/teacher/teacherSlice";
import useSchoolStructure from "@/hook/useSchoolStructure";
import TextInput from "@/components/ui/Input/TextInput";
import SelectInput from "@/components/ui/Input/SelectInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";

type AddTeacherModalProps = {
  onClose: () => void;
};

function AddTeacherModal({ onClose }: AddTeacherModalProps) {
  const [name, setName] = useState("");
  const [classGroupId, setClassGroupId] = useState("");

  const { structure } = useSchoolStructure();
  const dispatch = useDispatch<AppDispatch>();
  const { addLoading, addError } = useSelector((state: RootState) => state.teacher);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(resetAddTeacherStatus());

    const result = await dispatch(
      addTeacher({ name, class_group_id: classGroupId ? Number(classGroupId) : null })
    );

    if (addTeacher.fulfilled.match(result) && result.payload.code === 200) {
      onClose();
    }
  };

  return (
    <BaseModal
      title="Tambah Guru"
      subtitle="Username dan password akan digenerate otomatis oleh sistem."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Lengkap"
          name="name"
          type="text"
          placeholder="Nama lengkap guru"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <SelectInput
          label="Penempatan Rombel"
          name="class_group_id"
          value={classGroupId}
          onChange={(event) => setClassGroupId(event.target.value)}
          options={[
            { label: "Belum ditugaskan", value: "" },
            ...(structure?.class_groups ?? [])
              .filter((group) => !group.homeroom_teacher_name)
              .map((group) => ({
                label: `${group.education_level} — ${group.name}`,
                value: String(group.id),
              })),
          ]}
        />

        {addError && <ErrorAlert message={addError} />}

        <PrimaryButton isLoading={addLoading}>Tambah Guru</PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default AddTeacherModal;

"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateTeacher, resetTeacherMutationStatus } from "@/redux/features/teacher/teacherSlice";
import useSchoolStructure from "@/hook/useSchoolStructure";
import { Teacher } from "@/lib/types/teacherType";
import TextInput from "@/components/ui/Input/TextInput";
import SelectInput from "@/components/ui/Input/SelectInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";

type EditTeacherModalProps = {
  teacher: Teacher;
  onClose: () => void;
};

export default function EditTeacherModal({ teacher, onClose }: EditTeacherModalProps) {
  const [name, setName] = useState(teacher.name);
  const [nip, setNip] = useState(teacher.nip);
  const [classGroupId, setClassGroupId] = useState(teacher.class_group_id ? String(teacher.class_group_id) : "");
  const { structure } = useSchoolStructure();
  const dispatch = useDispatch<AppDispatch>();
  const { mutationLoading, mutationError } = useSelector((state: RootState) => state.teacher);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      updateTeacher({
        id: teacher.id,
        name: name.trim(),
        nip: nip.trim(),
        class_group_id: classGroupId ? Number(classGroupId) : null,
      })
    );
    if (updateTeacher.fulfilled.match(result) && result.payload.code === 200) onClose();
  };

  return (
    <BaseModal title="Edit Guru" subtitle="Username dan password akan mengikuti NIP / ID guru." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="NIP / ID Guru" name="edit-nip" value={nip} required onChange={(e) => setNip(e.target.value)} />
        <TextInput label="Nama Lengkap" name="edit-name" value={name} required onChange={(e) => setName(e.target.value)} />
        <SelectInput
          label="Penempatan Rombel"
          name="edit-class_group_id"
          value={classGroupId}
          onChange={(e) => setClassGroupId(e.target.value)}
          options={[
            { label: "Belum ditugaskan", value: "" },
            ...(structure?.class_groups ?? [])
              .filter((group) => !group.homeroom_teacher_name || group.id === teacher.class_group_id)
              .map((group) => ({ label: `${group.education_level} — ${group.name}`, value: String(group.id) })),
          ]}
        />
        {mutationError && <ErrorAlert message={mutationError} />}
        <PrimaryButton isLoading={mutationLoading}>Simpan Perubahan</PrimaryButton>
      </form>
    </BaseModal>
  );
}

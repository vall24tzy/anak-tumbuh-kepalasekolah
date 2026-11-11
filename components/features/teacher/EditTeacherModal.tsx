"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { clearSaveFeedback, updateTeacher } from "@/redux/features/teacher/teacherSlice";
import useSchoolStructure from "@/hook/useSchoolStructure";
import { Teacher } from "@/lib/types/teacherType";
import { gradeLevelToLabel } from "@/lib/utils/mappers";
import { isMockEnabled } from "@/lib/utils/mock";
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
  const [classGroupId, setClassGroupId] = useState(
    teacher.class_group_id ? String(teacher.class_group_id) : ""
  );

  const { structure } = useSchoolStructure();
  const dispatch = useDispatch<AppDispatch>();
  const { saving, saveError } = useSelector((state: RootState) => state.teacher);

  // Backend belum punya endpoint ubah nama/NIP guru: input hanya bisa diubah
  // di mode data dummy. Yang bisa diubah di backend asli hanya penempatan rombel.
  const canEditIdentity = isMockEnabled();

  // Penugasan hanya bisa dipindah dalam tahun ajaran yang sama.
  const activeYearId = structure?.academic_years.find((year) => year.is_active)?.id;
  const yearId = teacher.academic_year_id ?? activeYearId;
  const availableGroups = (structure?.class_groups ?? []).filter(
    (group) =>
      group.academic_year_id === yearId &&
      (!group.homeroom_teacher_id || group.id === teacher.class_group_id)
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearSaveFeedback());

    const result = await dispatch(
      updateTeacher({
        id: teacher.id,
        name: name.trim(),
        nip: nip.trim(),
        class_group_id: classGroupId ? Number(classGroupId) : null,
        current_assignment_id: teacher.assignment_id,
        current_class_group_id: teacher.class_group_id,
      })
    );
    if (updateTeacher.fulfilled.match(result)) onClose();
  };

  return (
    <BaseModal
      title="Edit Guru"
      subtitle={
        canEditIdentity
          ? "Ubah data guru dan penempatan rombel."
          : "Nama dan NIP belum bisa diubah dari sini; kamu bisa mengubah penempatan rombel."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="NIP / ID Guru"
          name="edit-nip"
          value={nip}
          required
          disabled={!canEditIdentity}
          onChange={(e) => setNip(e.target.value)}
        />
        <TextInput
          label="Nama Lengkap"
          name="edit-name"
          value={name}
          required
          disabled={!canEditIdentity}
          onChange={(e) => setName(e.target.value)}
        />
        <SelectInput
          label="Penempatan Rombel"
          name="edit-class_group_id"
          value={classGroupId}
          disabled={teacher.status !== "active"}
          onChange={(e) => setClassGroupId(e.target.value)}
          options={[
            { label: "Belum ditugaskan", value: "" },
            ...availableGroups.map((group) => ({
              label: `${gradeLevelToLabel(group.grade_level)} — ${group.name}`,
              value: String(group.id),
            })),
          ]}
        />
        {saveError && <ErrorAlert message={saveError} />}
        <PrimaryButton isLoading={saving}>Simpan Perubahan</PrimaryButton>
      </form>
    </BaseModal>
  );
}

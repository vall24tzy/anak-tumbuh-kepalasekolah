"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addTeacher, clearSaveFeedback } from "@/redux/features/teacher/teacherSlice";
import useSchoolStructure from "@/hook/useSchoolStructure";
import { TeacherGender } from "@/lib/types/teacherType";
import { gradeLevelToLabel } from "@/lib/utils/mappers";
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
  const [nip, setNip] = useState("");
  const [gender, setGender] = useState<TeacherGender>("laki-laki");
  const [classGroupId, setClassGroupId] = useState("");

  const { structure } = useSchoolStructure();
  const dispatch = useDispatch<AppDispatch>();
  const { saving, saveError } = useSelector((state: RootState) => state.teacher);

  // Penempatan hanya ke rombel tahun ajaran aktif yang belum punya wali kelas.
  const activeYearId = structure?.academic_years.find((year) => year.is_active)?.id;
  const availableGroups = (structure?.class_groups ?? []).filter(
    (group) => group.academic_year_id === activeYearId && !group.homeroom_teacher_id
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(clearSaveFeedback());

    const result = await dispatch(
      addTeacher({
        name: name.trim(),
        nip: nip.trim(),
        gender,
        class_group_id: classGroupId ? Number(classGroupId) : null,
      })
    );

    if (addTeacher.fulfilled.match(result)) onClose();
  };

  return (
    <BaseModal
      title="Tambah Guru"
      subtitle="Akun login dibuat otomatis: username dan password awal = NIP."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nama Lengkap"
          name="name"
          type="text"
          placeholder="Nama lengkap guru"
          maxLength={150}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <TextInput
          label="NIP / ID Guru"
          name="nip"
          type="text"
          inputMode="numeric"
          placeholder="Masukkan NIP / ID guru"
          maxLength={30}
          required
          value={nip}
          onChange={(event) => setNip(event.target.value)}
        />

        <SelectInput
          label="Jenis Kelamin"
          name="gender"
          required
          value={gender}
          onChange={(event) => setGender(event.target.value as TeacherGender)}
          options={[
            { label: "Laki-laki", value: "laki-laki" },
            { label: "Perempuan", value: "perempuan" },
          ]}
        />

        <SelectInput
          label="Penempatan Rombel"
          name="class_group_id"
          value={classGroupId}
          onChange={(event) => setClassGroupId(event.target.value)}
          options={[
            { label: "Belum ditugaskan", value: "" },
            ...availableGroups.map((group) => ({
              label: `${gradeLevelToLabel(group.grade_level)} — ${group.name}`,
              value: String(group.id),
            })),
          ]}
        />

        {saveError && <ErrorAlert message={saveError} />}

        <PrimaryButton isLoading={saving}>Tambah Guru</PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default AddTeacherModal;

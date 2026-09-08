"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addClassGroup, updateClassGroup } from "@/redux/features/school/schoolSlice";
import { AcademicYear, ClassGroup } from "@/lib/types/schoolType";
import useTeachers from "@/hook/useTeachers";
import TextInput from "@/components/ui/Input/TextInput";
import SelectInput from "@/components/ui/Input/SelectInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import BaseModal from "@/components/ui/Modal/BaseModal";

type AddClassGroupModalProps = {
  schoolName: string;
  academicYears: AcademicYear[];
  onClose: () => void;
  classGroup?: ClassGroup; // ada isinya = mode Edit, kosong = mode Tambah
};

function AddClassGroupModal({
  schoolName,
  academicYears,
  onClose,
  classGroup,
}: AddClassGroupModalProps) {
  const isEditMode = Boolean(classGroup);
  const activeYear = academicYears.find((year) => year.status === "active") ?? academicYears[0];

  const [academicYearId, setAcademicYearId] = useState(
    classGroup ? String(classGroup.academic_year_id) : activeYear ? String(activeYear.id) : ""
  );
  const [educationLevel, setEducationLevel] = useState(classGroup?.education_level ?? "");
  const [name, setName] = useState(classGroup?.name ?? "");
  const [homeroomTeacherId, setHomeroomTeacherId] = useState(
    classGroup?.homeroom_teacher_id ? String(classGroup.homeroom_teacher_id) : ""
  );

  const { teachers } = useTeachers();
  const dispatch = useDispatch<AppDispatch>();
  const { saving } = useSelector((state: RootState) => state.school);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      academic_year_id: Number(academicYearId),
      education_level: educationLevel,
      name,
      homeroom_teacher_id: homeroomTeacherId ? Number(homeroomTeacherId) : null,
    };

    const result = classGroup
      ? await dispatch(updateClassGroup({ ...payload, id: classGroup.id }))
      : await dispatch(addClassGroup(payload));

    const thunk = classGroup ? updateClassGroup : addClassGroup;
    if (thunk.fulfilled.match(result) && result.payload.code === 200) {
      onClose();
    }
  };

  return (
    <BaseModal
      title={isEditMode ? "Edit Kelas / Rombel" : "Tambah Kelas / Rombel"}
      subtitle={schoolName}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <SelectInput
          label="Tahun Ajaran"
          name="academic_year_id"
          required
          value={academicYearId}
          onChange={(event) => setAcademicYearId(event.target.value)}
          options={academicYears.map((year) => ({
            label: `${year.name}${year.status === "active" ? " — aktif" : ""}`,
            value: String(year.id),
          }))}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Nama Tingkat"
            name="education_level"
            type="text"
            placeholder="Contoh: Kelas 5 / TK A1"
            required
            value={educationLevel}
            onChange={(event) => setEducationLevel(event.target.value)}
          />
          <TextInput
            label="Nama Rombel"
            name="name"
            type="text"
            placeholder="Contoh: Cendekia / A"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <SelectInput
          label="Wali Kelas (Skeleton)"
          name="homeroom_teacher_id"
          value={homeroomTeacherId}
          onChange={(event) => setHomeroomTeacherId(event.target.value)}
          options={[
            { label: "Belum ditetapkan", value: "" },
            ...teachers
              .filter(
                (teacher) =>
                  !teacher.class_group_name || teacher.id === classGroup?.homeroom_teacher_id
              )
              .map((teacher) => ({ label: teacher.name, value: String(teacher.id) })),
          ]}
        />
        <p className="-mt-2 text-xs font-semibold text-primary-900/45">
          Constraint satu Wali Kelas/satu rombel aktif tetap ditegakkan backend.
        </p>

        <PrimaryButton isLoading={saving}>
          {isEditMode ? "Simpan Perubahan" : "Simpan Rombel"}
        </PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default AddClassGroupModal;

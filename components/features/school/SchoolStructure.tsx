"use client";

import { useDispatch } from "react-redux";
import { useState } from "react";
import { CiHome, CiRedo, CiCalendar, CiBoxList, CiCirclePlus } from "react-icons/ci";
import { AppDispatch } from "@/redux/store";
import { ClassGroup } from "@/lib/types/schoolType";
import useSchoolStructure from "@/hook/useSchoolStructure";
import { fetchSchoolStructure } from "@/redux/features/school/schoolSlice";
import SchoolInfoCard from "@/components/features/school/SchoolInfoCard";
import AcademicYearTable from "@/components/features/school/AcademicYearTable";
import AddAcademicYearModal from "@/components/features/school/AddAcademicYearModal";
import ClassGroupList from "@/components/features/school/ClassGroupList";
import AddClassGroupModal from "@/components/features/school/AddClassGroupModal";
import AsyncState from "@/components/ui/State/AsyncState";

type SchoolTab = "years" | "classes";

function SchoolStructure() {
  const [activeTab, setActiveTab] = useState<SchoolTab>("years");
  const [isAddYearOpen, setIsAddYearOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editingClassGroup, setEditingClassGroup] = useState<ClassGroup | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { structure, loading, error } = useSchoolStructure();

  return (
    <AsyncState loading={loading} error={error}>
      {!structure ? null : (
        <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-primary-500">
            <CiHome size={18} />
            Master Sekolah
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-primary-900 sm:text-3xl">
            Sekolah &amp; Tahun Ajaran
          </h1>
          <p className="mt-1 max-w-xl text-sm font-semibold text-primary-900/55">
            Kelola konteks sekolah dan tahun ajaran. Struktur tingkat/rombel mengikuti data yang
            tersedia dari backend.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(fetchSchoolStructure())}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-primary-200 bg-white px-4 py-2.5 text-sm font-black text-primary-900 transition hover:bg-primary-50"
        >
          <CiRedo size={18} />
          Refresh
        </button>
      </div>

      <SchoolInfoCard school={structure.school} />

      <div className="rounded-3xl border border-primary-100 bg-white shadow-sm">
        <div className="flex items-center gap-1 border-b border-primary-50 px-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("years")}
            className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-black transition ${
              activeTab === "years"
                ? "border-b-2 border-primary-500 text-primary-500"
                : "text-primary-900/45 hover:text-primary-900"
            }`}
          >
            <CiCalendar size={18} />
            Tahun Ajaran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("classes")}
            className={`flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-black transition ${
              activeTab === "classes"
                ? "border-b-2 border-primary-500 text-primary-500"
                : "text-primary-900/45 hover:text-primary-900"
            }`}
          >
            <CiBoxList size={18} />
            Kelas / Rombel
          </button>
        </div>

        <div className="p-5">
          {activeTab === "years" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black text-primary-900">Tahun Ajaran</p>
                  <p className="mt-1 text-xs font-semibold text-primary-900/55">
                    Enrollment baru menggunakan konteks tahun ajaran tanpa menghapus histori lama.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddYearOpen(true)}
                  className="inline-flex w-fit items-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-600"
                >
                  <CiCirclePlus size={18} />
                  Tambah Tahun Ajaran
                </button>
              </div>

              <AcademicYearTable academicYears={structure.academic_years} />
            </div>
          )}

          {activeTab === "classes" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-black text-primary-900">Skeleton Kelas / Rombel</p>
                  <p className="mt-1 text-xs font-semibold text-primary-900/55">
                    Nama tingkat dan rombel tidak di-hard-code; backend tetap menentukan validasi
                    scope dan assignment Wali Kelas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(true)}
                  className="inline-flex w-fit items-center gap-2 rounded-2xl bg-primary-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-primary-600"
                >
                  <CiCirclePlus size={18} />
                  Tambah Rombel
                </button>
              </div>

              <ClassGroupList
                academicYears={structure.academic_years}
                classGroups={structure.class_groups}
                onEdit={setEditingClassGroup}
              />
            </div>
          )}
        </div>
      </div>

      {isAddYearOpen && <AddAcademicYearModal onClose={() => setIsAddYearOpen(false)} />}
      {isAddClassOpen && (
        <AddClassGroupModal
          schoolName={structure.school.name}
          academicYears={structure.academic_years}
          onClose={() => setIsAddClassOpen(false)}
        />
      )}
      {editingClassGroup && (
        <AddClassGroupModal
          schoolName={structure.school.name}
          academicYears={structure.academic_years}
          classGroup={editingClassGroup}
          onClose={() => setEditingClassGroup(null)}
        />
      )}
        </div>
      )}
    </AsyncState>
  );
}

export default SchoolStructure;

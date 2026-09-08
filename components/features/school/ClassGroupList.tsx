import { AcademicYear, ClassGroup } from "@/lib/types/schoolType";

type ClassGroupListProps = {
  academicYears: AcademicYear[];
  classGroups: ClassGroup[];
  onEdit: (classGroup: ClassGroup) => void;
};

function ClassGroupList({ academicYears, classGroups, onEdit }: ClassGroupListProps) {
  const getYearName = (academicYearId: number) =>
    academicYears.find((year) => year.id === academicYearId)?.name ?? "—";

  return (
    <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-primary-50 text-primary-900/60">
          <tr>
            <th className="px-5 py-3 font-bold">Tahun Ajaran</th>
            <th className="px-5 py-3 font-bold">Tingkat</th>
            <th className="px-5 py-3 font-bold">Rombel</th>
            <th className="px-5 py-3 font-bold">Wali Kelas</th>
            <th className="px-5 py-3 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-50">
          {classGroups.map((classGroup) => (
            <tr key={classGroup.id} className="hover:bg-primary-50/50">
              <td className="px-5 py-4 text-primary-900">{getYearName(classGroup.academic_year_id)}</td>
              <td className="px-5 py-4 font-extrabold text-primary-900">
                {classGroup.education_level}
              </td>
              <td className="px-5 py-4 text-primary-900">{classGroup.name}</td>
              <td className="px-5 py-4">
                {classGroup.homeroom_teacher_name ?? (
                  <span className="text-primary-900/40">Belum ditetapkan</span>
                )}
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onEdit(classGroup)}
                  className="text-xs font-black text-primary-500 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!classGroups.length && (
        <div className="p-10 text-center text-sm font-semibold text-primary-900/50">
          Belum ada kelas/rombel.
        </div>
      )}
    </div>
  );
}

export default ClassGroupList;

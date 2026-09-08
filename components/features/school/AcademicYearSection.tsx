import { CiCalendar } from "react-icons/ci";
import { AcademicYear, ClassGroup } from "@/lib/types/schoolType";
import StatusBadge from "@/components/ui/Badge/StatusBadge";
import ClassGroupCard from "@/components/features/school/ClassGroupCard";

type AcademicYearSectionProps = {
  academicYear: AcademicYear;
  classGroups: ClassGroup[];
};

function AcademicYearSection({ academicYear, classGroups }: AcademicYearSectionProps) {
  return (
    <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CiCalendar size={20} className="text-primary-500" />
          <p className="text-sm font-black text-primary-900">Tahun Ajaran {academicYear.name}</p>
        </div>
        {academicYear.status === "active" ? (
          <StatusBadge label="Aktif" tone="success" />
        ) : (
          <StatusBadge label="Nonaktif" tone="muted" />
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classGroups.map((classGroup) => (
          <ClassGroupCard key={classGroup.id} classGroup={classGroup} />
        ))}
      </div>

      {!classGroups.length && (
        <p className="mt-4 text-center text-xs font-semibold text-primary-900/45">
          Belum ada kelas/rombel di tahun ajaran ini.
        </p>
      )}
    </div>
  );
}

export default AcademicYearSection;

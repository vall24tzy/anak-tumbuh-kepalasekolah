import { ClassGroup } from "@/lib/types/schoolType";
import { CiUser } from "react-icons/ci";
import StatusBadge from "@/components/ui/Badge/StatusBadge";

type ClassGroupCardProps = {
  classGroup: ClassGroup;
};

function ClassGroupCard({ classGroup }: ClassGroupCardProps) {
  return (
    <div className="rounded-2xl border border-primary-100 bg-white p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-primary-500">
        {classGroup.education_level}
      </p>
      <p className="mt-1 text-sm font-extrabold text-primary-900">{classGroup.name}</p>

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary-900/60">
        <CiUser size={16} />
        {classGroup.homeroom_teacher_name ?? "Belum ada Wali Kelas"}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-bold text-primary-900/50">
          {classGroup.total_students} siswa
        </span>
        {classGroup.homeroom_teacher_name ? (
          <StatusBadge label="Ada Wali Kelas" tone="success" />
        ) : (
          <StatusBadge label="Belum ditugaskan" tone="warning" />
        )}
      </div>
    </div>
  );
}

export default ClassGroupCard;

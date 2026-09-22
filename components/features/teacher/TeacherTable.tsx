import { CiEdit, CiTrash } from "react-icons/ci";
import { Teacher } from "@/lib/types/teacherType";
import StatusBadge from "@/components/ui/Badge/StatusBadge";

type TeacherTableProps = {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
};

export default function TeacherTable({ teachers, onEdit, onDelete }: TeacherTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-primary-50 text-primary-900/60">
          <tr>
            <th className="px-5 py-3 font-bold">Nama</th>
            <th className="px-5 py-3 font-bold">NIP / ID</th>
            <th className="px-5 py-3 font-bold">Rombel</th>
            <th className="px-5 py-3 font-bold">Status</th>
            <th className="px-5 py-3 text-center font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-50">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-primary-50/50">
              <td className="px-5 py-4 font-extrabold text-primary-900">{teacher.name}</td>
              <td className="px-5 py-4 font-mono text-primary-900">{teacher.nip}</td>
              <td className="px-5 py-4 text-primary-900">
                {teacher.class_group_name ? `${teacher.education_level} — ${teacher.class_group_name}` : <span className="text-primary-900/40">Belum ditugaskan</span>}
              </td>
              <td className="px-5 py-4">
                <StatusBadge label={teacher.status === "active" ? "Aktif" : "Nonaktif"} tone={teacher.status === "active" ? "success" : "muted"} />
              </td>
              <td className="px-5 py-4">
                <div className="flex justify-center gap-2">
                  <button type="button" onClick={() => onEdit(teacher)} className="rounded-xl border border-primary-100 bg-white p-2 text-primary-500 transition hover:bg-primary-50" title="Edit guru" aria-label={`Edit ${teacher.name}`}>
                    <CiEdit size={19} />
                  </button>
                  <button type="button" onClick={() => onDelete(teacher)} className="rounded-xl border border-red-100 bg-white p-2 text-red-500 transition hover:bg-red-50" title="Hapus guru" aria-label={`Hapus ${teacher.name}`}>
                    <CiTrash size={19} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!teachers.length && <div className="p-10 text-center text-sm font-semibold text-primary-900/50">Belum ada data guru.</div>}
    </div>
  );
}

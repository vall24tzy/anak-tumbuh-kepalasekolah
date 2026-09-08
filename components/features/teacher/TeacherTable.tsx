import { Teacher } from "@/lib/types/teacherType";
import StatusBadge from "@/components/ui/Badge/StatusBadge";

type TeacherTableProps = {
  teachers: Teacher[];
};

function TeacherTable({ teachers }: TeacherTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-primary-50 text-primary-900/60">
          <tr>
            <th className="px-5 py-3 font-bold">Nama</th>
            <th className="px-5 py-3 font-bold">Username</th>
            <th className="px-5 py-3 font-bold">Password</th>
            <th className="px-5 py-3 font-bold">Rombel</th>
            <th className="px-5 py-3 font-bold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-50">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-primary-50/50">
              <td className="px-5 py-4 font-extrabold text-primary-900">{teacher.name}</td>
              <td className="px-5 py-4 text-primary-900">{teacher.username}</td>
              <td className="px-5 py-4 font-mono text-primary-500">
                {teacher.password ?? <span className="text-primary-900/30">••••••</span>}
              </td>
              <td className="px-5 py-4 text-primary-900">
                {teacher.class_group_name ? (
                  <>
                    {teacher.education_level} — {teacher.class_group_name}
                  </>
                ) : (
                  <span className="text-primary-900/40">Belum ditugaskan</span>
                )}
              </td>
              <td className="px-5 py-4">
                {teacher.status === "active" ? (
                  <StatusBadge label="Aktif" tone="success" />
                ) : (
                  <StatusBadge label="Nonaktif" tone="muted" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!teachers.length && (
        <div className="p-10 text-center text-sm font-semibold text-primary-900/50">
          Belum ada data guru.
        </div>
      )}
    </div>
  );
}

export default TeacherTable;

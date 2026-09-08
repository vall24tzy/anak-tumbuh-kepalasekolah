import { AcademicYear } from "@/lib/types/schoolType";
import StatusBadge from "@/components/ui/Badge/StatusBadge";

type AcademicYearTableProps = {
  academicYears: AcademicYear[];
};

function AcademicYearTable({ academicYears }: AcademicYearTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-primary-100 bg-white shadow-sm">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-primary-50 text-primary-900/60">
          <tr>
            <th className="px-5 py-3 font-bold">Tahun Ajaran</th>
            <th className="px-5 py-3 font-bold">Mulai</th>
            <th className="px-5 py-3 font-bold">Selesai</th>
            <th className="px-5 py-3 font-bold">Status</th>
            <th className="px-5 py-3 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-50">
          {academicYears.map((year) => (
            <tr key={year.id} className="hover:bg-primary-50/50">
              <td className="px-5 py-4 font-extrabold text-primary-900">{year.name}</td>
              <td className="px-5 py-4 text-primary-900">{year.start_date}</td>
              <td className="px-5 py-4 text-primary-900">{year.end_date}</td>
              <td className="px-5 py-4">
                {year.status === "active" ? (
                  <StatusBadge label="Aktif" tone="success" />
                ) : (
                  <StatusBadge label="Nonaktif" tone="muted" />
                )}
              </td>
              <td className="px-5 py-4 text-xs font-semibold text-primary-900/40">—</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!academicYears.length && (
        <div className="p-10 text-center text-sm font-semibold text-primary-900/50">
          Belum ada tahun ajaran.
        </div>
      )}
    </div>
  );
}

export default AcademicYearTable;

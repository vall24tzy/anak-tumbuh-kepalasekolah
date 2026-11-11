// Tingkat rombel disimpan backend sebagai angka (grade_level); UI menampilkannya
// sebagai "Kelas {n}". Nama tingkat bebas ("TK A", dst) belum didukung backend.
export const gradeLevelToLabel = (gradeLevel: number | null | undefined): string =>
  gradeLevel ? `Kelas ${gradeLevel}` : "-";

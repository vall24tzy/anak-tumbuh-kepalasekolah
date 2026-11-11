// Hasil operasi tulis yang terdiri dari beberapa langkah (mis. buat rombel lalu
// tugaskan wali kelas). Langkah utama sudah tersimpan; `warning` terisi bila
// langkah lanjutan gagal, supaya pengguna tahu apa yang perlu diulang.
export type MutationOutcome = {
  message: string;
  warning: string | null;
};

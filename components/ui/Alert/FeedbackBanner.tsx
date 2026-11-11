type FeedbackBannerProps = {
  message?: string | null;
  warning?: string | null;
  error?: string | null;
  onClose: () => void;
};

// Banner hasil operasi di halaman: sukses (hijau), peringatan (kuning, langkah
// lanjutan gagal) atau error (merah, untuk aksi tanpa modal seperti hapus/aktifkan).
function FeedbackBanner({ message, warning, error, onClose }: FeedbackBannerProps) {
  if (!message && !warning && !error) return null;

  const tone = error
    ? "border-red-100 bg-red-50 text-red-700"
    : warning
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-emerald-100 bg-emerald-50 text-emerald-700";

  return (
    <div className={`flex items-start justify-between gap-3 rounded-2xl border p-3 text-sm font-bold ${tone}`}>
      <div className="space-y-1">
        {error ? (
          <p>{error}</p>
        ) : (
          <>
            {message && <p>{message}</p>}
            {warning && <p className="text-xs font-semibold">{warning}</p>}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg px-2 font-black transition hover:bg-black/5"
        aria-label="Tutup pesan"
      >
        ×
      </button>
    </div>
  );
}

export default FeedbackBanner;

type ErrorAlertProps = {
  message: string;
  onClose?: () => void;
};

function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700"
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 font-black text-red-500 transition hover:bg-red-100 hover:text-red-700"
          aria-label="Tutup pesan error"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorAlert;

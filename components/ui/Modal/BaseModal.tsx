import { ReactNode } from "react";

type BaseModalProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onClose: () => void;
  size?: "md" | "lg";
  children: ReactNode;
};

// Kerangka modal bersama (backdrop + card + header + tombol tutup) dipakai
// oleh semua modal form/wizard biar tiap file gak nulis ulang boilerplate ini.
function BaseModal({ title, eyebrow, subtitle, onClose, size = "md", children }: BaseModalProps) {
  const isLarge = size === "lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/50 p-4 backdrop-blur-sm">
      <div
        className={
          isLarge
            ? "flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl"
            : "w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
        }
      >
        <div className={isLarge ? "flex items-center justify-between border-b border-primary-50 px-5 py-4" : "flex items-center justify-between"}>
          <div>
            {eyebrow && (
              <p className="text-[10px] font-black uppercase tracking-wider text-primary-500">
                {eyebrow}
              </p>
            )}
            <h2 className={eyebrow ? "mt-1 text-lg font-black text-primary-900" : "text-lg font-black text-primary-900"}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-primary-900/50 transition hover:bg-primary-50"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {subtitle && (
          <p className={isLarge ? "px-5 pt-3 text-xs font-semibold text-primary-900/55" : "mt-1 text-xs font-semibold text-primary-900/55"}>
            {subtitle}
          </p>
        )}

        <div className={isLarge ? "flex-1 overflow-y-auto p-5" : "mt-4"}>{children}</div>
      </div>
    </div>
  );
}

export default BaseModal;

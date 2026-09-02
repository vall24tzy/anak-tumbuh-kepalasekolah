import { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
};

function PrimaryButton({ children, isLoading = false, disabled, ...rest }: PrimaryButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl border-b-4 border-primary-900 bg-primary-500 px-4 py-3.5 text-sm font-black text-white shadow-[0_8px_0_rgba(35,40,82,0.12)] transition duration-200 hover:scale-[1.02] hover:bg-primary-600 active:translate-y-1 active:border-b-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:text-base"
      {...rest}
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}

export default PrimaryButton;

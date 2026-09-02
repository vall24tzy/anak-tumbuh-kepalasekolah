import { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

function TextInput({ label, name, ...rest }: TextInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-black uppercase tracking-wider text-primary-900"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-primary-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
        {...rest}
      />
    </div>
  );
}

export default TextInput;

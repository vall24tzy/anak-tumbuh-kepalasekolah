import { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: SelectOption[];
};

function SelectInput({ label, name, options, ...rest }: SelectInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-black uppercase tracking-wider text-primary-900"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-primary-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;

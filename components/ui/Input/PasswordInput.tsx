"use client";

import { InputHTMLAttributes, useState } from "react";
import { CiLock, CiUnlock } from "react-icons/ci";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

function PasswordInput({ label, name, ...rest }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-black uppercase tracking-wider text-primary-900"
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={name}
          name={name}
          type={isVisible ? "text" : "password"}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm font-semibold text-primary-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20"
          {...rest}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary-500"
          aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {isVisible ? <CiUnlock size={22} /> : <CiLock size={22} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;

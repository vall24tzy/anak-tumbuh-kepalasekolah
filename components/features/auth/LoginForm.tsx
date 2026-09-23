"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { CiUser } from "react-icons/ci";
import { AppDispatch } from "@/redux/store";
import { login, clearAuthMessage } from "@/redux/features/auth/authSlice";
import { HEADMASTER_DASHBOARD_PATH } from "@/lib/constants/role";
import useAuth from "@/hook/useAuth";
import TextInput from "@/components/ui/Input/TextInput";
import PasswordInput from "@/components/ui/Input/PasswordInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import SuccessModal from "@/components/ui/Modal/SuccessModal";

function LoginForm() {
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    dispatch(clearAuthMessage());

    const result = await dispatch(login({ username: nip.trim(), password }));

    if (login.fulfilled.match(result)) {
      const { code, data, message, access_token } = result.payload;

      if (code === 200 && data) {
        localStorage.setItem("access_token", access_token);
        setShowSuccess(true);
        setTimeout(() => {
          router.push(HEADMASTER_DASHBOARD_PATH);
        }, 1200);
        return;
      }

      setFormError(message || "Username atau password salah.");
      return;
    }

    setFormError("Gagal melakukan login, silakan coba lagi.");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="relative">
        <TextInput
          label="NIP"
          name="username"
          type="text"
          inputMode="numeric"
          placeholder="Masukkan NIP Kepala Sekolah"
          autoComplete="username"
          autoFocus
          required
          value={nip}
          onChange={(event) => setNip(event.target.value)}
        />
        <CiUser size={22} className="absolute right-4 top-11 text-slate-400" />
      </div>

      <PasswordInput
        label="Password"
        name="password"
        placeholder="Masukkan NIP sebagai password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {formError && <ErrorAlert message={formError} onClose={() => setFormError(null)} />}

      <PrimaryButton isLoading={loading}>Masuk ke Dashboard</PrimaryButton>

      {showSuccess && <SuccessModal message="Berhasil masuk, mengalihkan ke dashboard..." />}
    </form>
  );
}

export default LoginForm;

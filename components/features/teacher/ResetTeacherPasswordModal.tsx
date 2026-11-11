"use client";

import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import useCooldown from "@/hook/useCooldown";
import { RATE_LIMIT_MESSAGE } from "@/lib/api/client";
import { clearSaveFeedback, resetTeacherPassword } from "@/redux/features/teacher/teacherSlice";
import { Teacher } from "@/lib/types/teacherType";
import TextInput from "@/components/ui/Input/TextInput";
import PrimaryButton from "@/components/ui/Button/PrimaryButton";
import ErrorAlert from "@/components/ui/Alert/ErrorAlert";
import BaseModal from "@/components/ui/Modal/BaseModal";

type ResetTeacherPasswordModalProps = {
  teacher: Teacher;
  onClose: () => void;
};

const MIN_PASSWORD_LENGTH = 8;

function ResetTeacherPasswordModal({ teacher, onClose }: ResetTeacherPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { remaining, start: startCooldown } = useCooldown();
  const dispatch = useDispatch<AppDispatch>();
  const { saving, saveError } = useSelector((state: RootState) => state.teacher);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    dispatch(clearSaveFeedback());

    if (password.length < MIN_PASSWORD_LENGTH) {
      setLocalError(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }

    const result = await dispatch(resetTeacherPassword({ id: teacher.id, newPassword: password }));
    if (resetTeacherPassword.fulfilled.match(result)) {
      onClose();
    } else if (result.payload === RATE_LIMIT_MESSAGE) {
      startCooldown();
    }
  };

  return (
    <BaseModal
      title="Reset Password Guru"
      subtitle={`${teacher.name} — sampaikan password baru langsung ke guru yang bersangkutan.`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Password Baru"
          name="new_password"
          type="text"
          placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {(localError || saveError) && <ErrorAlert message={localError ?? saveError ?? ""} />}
        <PrimaryButton isLoading={saving} disabled={remaining > 0}>
          {remaining > 0 ? `Coba lagi dalam ${remaining} detik` : "Reset Password"}
        </PrimaryButton>
      </form>
    </BaseModal>
  );
}

export default ResetTeacherPasswordModal;

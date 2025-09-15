import { useState } from "react";
import { useUpdateMe, useUpdatePassword } from "../api";

export type UseAccountFormsOptions = {
  initialUsername?: string;
};

export function useAccountForms(options?: UseAccountFormsOptions) {
  const { mutateAsync: updateMe, isPending: isUpdatingMe } = useUpdateMe();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  const initialUsername = options?.initialUsername ?? "";
  const [username, setUsername] = useState(initialUsername);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async () => {
    setMessage(null);
    setError(null);
    try {
      await updateMe({ username });
      setMessage("Профиль обновлён");
    } catch {
      setError("Не удалось обновить профиль");
    }
  };

  const changePassword = async () => {
    setMessage(null);
    setError(null);
    if (!oldPassword || !newPassword) {
      setError("Заполните все поля");
      return;
    }
    try {
      await updatePassword({ oldPassword, newPassword });
      setMessage("Пароль изменён");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setError("Не удалось изменить пароль");
    }
  };

  return {
    // Profile
    username,
    setUsername,
    saveProfile,
    isUpdatingMe,

    // Password
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    changePassword,
    isUpdatingPassword,

    // Messages
    message,
    error,
  };
}

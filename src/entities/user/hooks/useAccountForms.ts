import { useState, useEffect } from "react";
import { useUpdateMe, useUpdatePassword, useMe } from "../api";

export function useAccountForms() {
  const { data: me } = useMe();
  const { mutateAsync: updateMe, isPending: isUpdatingMe } = useUpdateMe();
  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } =
    useUpdatePassword();

  const [username, setUsername] = useState(me?.username ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (me?.username) setUsername(me.username);
  }, [me?.username]);

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

import { useEffect, useState } from "react";
import { useAuth } from "../../app/providers/useAuth";
import { BackLink } from "../../shared/ui/BackLink";
import {
  useMe,
  useUpdateMe,
  useUpdatePassword,
  useUserStatistic,
} from "../../entities/user/api";
import AccountInfoView from "./ui/AccountInfoView";
import AccountStatsView from "./ui/AccountStatsView";
import ProfileFormView from "./ui/ProfileFormView";
import PasswordFormView from "./ui/PasswordFormView";

export default function AccountPage() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;
  const { data: me } = useMe();
  const idForStat = me?.id ?? userId;
  const { data: stat, status: statStatus } = useUserStatistic(idForStat);
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

  const canEdit = !!authUser;

  const onSaveProfile = async () => {
    setMessage(null);
    setError(null);
    try {
      await updateMe({ username });
      setMessage("Профиль обновлён");
    } catch {
      setError("Не удалось обновить профиль");
    }
  };

  const onChangePassword = async () => {
    setMessage(null);
    setError(null);
    try {
      await updatePassword({ oldPassword, newPassword });
      setMessage("Пароль обновлён");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setError("Не удалось обновить пароль");
    }
  };

  return (
    <div className="space-y-6">
      <BackLink />

      <AccountInfoView id={me?.id} username={me?.username} role={me?.role} />

      <AccountStatsView statistic={stat?.statistic} status={statStatus} />

      {canEdit && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Настройки профиля</h2>
          <ProfileFormView
            username={username}
            onUsernameChange={setUsername}
            onSave={onSaveProfile}
            isPending={isUpdatingMe}
          />

          <PasswordFormView
            oldPassword={oldPassword}
            newPassword={newPassword}
            onOldPasswordChange={setOldPassword}
            onNewPasswordChange={setNewPassword}
            onSubmit={onChangePassword}
            isPending={isUpdatingPassword}
          />
        </section>
      )}

      {(message || error) && (
        <div className="text-sm">
          {message && <div className="text-green-600">{message}</div>}
          {error && <div className="text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
}

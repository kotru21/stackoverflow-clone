import { useAuth } from "@/app/providers/useAuth";
import { BackLink } from "@/shared/ui/BackLink";
import { useMe, useUserStatistic } from "@/entities/user/api";
import AccountInfoView from "./ui/AccountInfoView";
import AccountStatsView from "./ui/AccountStatsView";
import ProfileFormView from "./ui/ProfileFormView";
import PasswordFormView from "./ui/PasswordFormView";
import { useAccountForms } from "@/entities/user/hooks";

export default function AccountPage() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;
  const { data: me, status: meStatus } = useMe();
  const idForStat = me?.id ?? userId;
  const { data: stat, status: statStatus } = useUserStatistic(idForStat);

  const accountForms = useAccountForms();
  const canEdit = !!authUser;

  return (
    <div className="space-y-4">
      <BackLink />

      <AccountInfoView
        id={me?.id}
        username={me?.username}
        role={me?.role}
        loading={meStatus === "pending"}
      />

      <AccountStatsView statistic={stat?.statistic} status={statStatus} />

      {canEdit && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Настройки профиля</h2>
          <ProfileFormView
            username={accountForms.username}
            onUsernameChange={accountForms.setUsername}
            onSave={accountForms.saveProfile}
            isPending={accountForms.isUpdatingMe}
            loading={meStatus !== "success"}
          />

          <PasswordFormView
            oldPassword={accountForms.oldPassword}
            newPassword={accountForms.newPassword}
            onOldPasswordChange={accountForms.setOldPassword}
            onNewPasswordChange={accountForms.setNewPassword}
            onSubmit={accountForms.changePassword}
            isPending={accountForms.isUpdatingPassword}
            loading={meStatus !== "success"}
          />
        </section>
      )}

      {(accountForms.message || accountForms.error) && (
        <div className="text-sm">
          {accountForms.message && (
            <div className="text-green-600">{accountForms.message}</div>
          )}
          {accountForms.error && (
            <div className="text-red-600">{accountForms.error}</div>
          )}
        </div>
      )}
    </div>
  );
}

import { useAuth } from "@/app/providers/useAuth";
import { BackLink } from "@/shared/ui/BackLink";
import { useMe, useUserStatistic } from "@/entities/user/api";
import AccountInfoView from "./ui/AccountInfoView";
import AccountStatsView from "./ui/AccountStatsView";
import ProfileFormView from "./ui/ProfileFormView";
import PasswordFormView from "./ui/PasswordFormView";
import { useAccountForms } from "@/entities/user/hooks";

function AccountFormsSection({ initialUsername }: { initialUsername: string }) {
  const accountForms = useAccountForms({ initialUsername });
  return (
    <>
      <ProfileFormView
        username={accountForms.username}
        onUsernameChange={accountForms.setUsername}
        onSave={accountForms.saveProfile}
        isPending={accountForms.isUpdatingMe}
      />

      <PasswordFormView
        oldPassword={accountForms.oldPassword}
        newPassword={accountForms.newPassword}
        onOldPasswordChange={accountForms.setOldPassword}
        onNewPasswordChange={accountForms.setNewPassword}
        onSubmit={accountForms.changePassword}
        isPending={accountForms.isUpdatingPassword}
      />

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
    </>
  );
}

export default function AccountPage() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;
  const { data: me, status: meStatus } = useMe();
  const idForStat = me?.id ?? userId;
  const { data: stat, status: statStatus } = useUserStatistic(idForStat);
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
          {meStatus !== "success" ? (
            <>
              <ProfileFormView
                username=""
                onUsernameChange={() => {}}
                onSave={() => {}}
                isPending={false}
                loading
              />
              <PasswordFormView
                oldPassword=""
                newPassword=""
                onOldPasswordChange={() => {}}
                onNewPasswordChange={() => {}}
                onSubmit={() => {}}
                isPending={false}
                loading
              />
            </>
          ) : (
            <AccountFormsSection initialUsername={me!.username} />
          )}
        </section>
      )}
    </div>
  );
}

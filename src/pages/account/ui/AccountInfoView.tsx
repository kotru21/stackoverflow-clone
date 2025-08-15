import { memo } from "react";

export type AccountInfoViewProps = {
  id?: number;
  username?: string;
  role?: string;
};

export const AccountInfoView = memo(function AccountInfoView({
  id,
  username,
  role,
}: AccountInfoViewProps) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Аккаунт</h1>
      {typeof id === "number" && username && role ? (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div>
            Имя пользователя: <span className="font-mono">@{username}</span>
          </div>
          <div>
            Роль: <span className="font-mono">{role}</span>
          </div>
          <div>
            ID: <span className="font-mono">{id}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">
          Не удалось загрузить данные пользователя.
        </p>
      )}
    </section>
  );
});

export default AccountInfoView;

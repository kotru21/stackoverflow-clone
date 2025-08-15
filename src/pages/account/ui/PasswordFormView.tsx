import { memo } from "react";

export type PasswordFormViewProps = {
  oldPassword: string;
  newPassword: string;
  onOldPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
};

export const PasswordFormView = memo(function PasswordFormView({
  oldPassword,
  newPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onSubmit,
  isPending,
}: PasswordFormViewProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm">Старый пароль</label>
      <input
        type="password"
        className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
        value={oldPassword}
        onChange={(e) => onOldPasswordChange(e.target.value)}
      />
      <label className="block text-sm">Новый пароль</label>
      <input
        type="password"
        className="w-full border rounded p-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
        value={newPassword}
        onChange={(e) => onNewPasswordChange(e.target.value)}
      />
      <button
        type="button"
        disabled={!!isPending || !oldPassword || !newPassword}
        onClick={onSubmit}
        className="px-3 py-1.5 border rounded disabled:opacity-50">
        Обновить пароль
      </button>
    </div>
  );
});

export default PasswordFormView;

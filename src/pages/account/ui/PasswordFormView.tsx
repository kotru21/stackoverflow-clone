import { memo } from "react";
import { Skeleton } from "@/shared/ui/Skeleton";

export type PasswordFormViewProps = {
  oldPassword: string;
  newPassword: string;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
  loading?: boolean;
};

export const PasswordFormView = memo(function PasswordFormView({
  oldPassword,
  newPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onSubmit,
  isPending,
  loading,
}: PasswordFormViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Смена пароля</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">
            Старый пароль
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => onOldPasswordChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Новый пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPending}
          />
        </div>
        <button
          onClick={onSubmit}
          disabled={isPending || !oldPassword || !newPassword}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? "Сохранение..." : "Сменить пароль"}
        </button>
      </div>
    </div>
  );
});

export default PasswordFormView;

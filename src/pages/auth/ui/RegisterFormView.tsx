import { Link } from "react-router-dom";
import { memo } from "react";
import { Button } from "@/shared/ui/Button";
import type { FormEvent, InputHTMLAttributes } from "react";

export type RegisterFormViewProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  usernameInputProps: InputHTMLAttributes<HTMLInputElement>;
  passwordInputProps: InputHTMLAttributes<HTMLInputElement>;
  confirmInputProps: InputHTMLAttributes<HTMLInputElement>;
  errors?: {
    username?: string;
    password?: string;
    confirm?: string;
  };
  isSubmitting?: boolean;
};

function RegisterFormView({
  onSubmit,
  usernameInputProps,
  passwordInputProps,
  confirmInputProps,
  errors,
  isSubmitting,
}: RegisterFormViewProps) {
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...usernameInputProps}
          />
          {errors?.username && (
            <p className="text-xs text-red-600 mt-1">{errors.username}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...passwordInputProps}
          />
          {errors?.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...confirmInputProps}
          />
          {errors?.confirm && (
            <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          variant="primary"
          className="w-full">
          Создать аккаунт
        </Button>
      </form>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="underline text-blue-600 dark:text-blue-400">
          Войти
        </Link>
      </p>
    </div>
  );
}

export default memo(RegisterFormView);

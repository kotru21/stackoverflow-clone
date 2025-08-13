import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../app/providers/useAuth";
import { Link, useNavigate } from "react-router-dom";

const schema = z
  .object({
    username: z.string().min(5),
    password: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Пароли не совпадают",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await doRegister(data.username, data.password);
      navigate("/login", { replace: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ошибка регистрации";
      setError("root", { message });
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Регистрация</h1>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-neutral-800 dark:text-white"
            {...register("confirm")}
          />
          {errors.confirm && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirm.message}
            </p>
          )}
        </div>
        {errors.root?.message && (
          <p className="text-xs text-red-600">{errors.root.message}</p>
        )}
        <button
          disabled={isSubmitting}
          className="w-full bg-black text-white dark:bg-white dark:text-black rounded py-2 disabled:opacity-50">
          {isSubmitting ? "Создание..." : "Создать аккаунт"}
        </button>
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

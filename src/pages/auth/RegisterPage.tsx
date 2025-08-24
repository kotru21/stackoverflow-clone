import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/useAuth";
import { useNavigate } from "react-router-dom";
import RegisterFormView from "./ui/RegisterFormView";

const schema = z
  .object({
    username: z.string().trim().min(5),
    password: z
      .string()
      .trim()
      .min(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
        message:
          "Пароль должен содержать минимум 1 строчную, 1 заглавную букву, 1 цифру и 1 символ",
      }),
    confirm: z.string().trim().min(6),
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
    const username = data.username.trim();
    const password = data.password.trim();
    try {
      await doRegister(username, password);
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      let message = e instanceof Error ? e.message : "Ошибка регистрации";
      // Provide friendlier messages for common validation cases
      const hasStatus =
        typeof e === "object" &&
        e !== null &&
        "status" in (e as Record<string, unknown>);
      if (hasStatus) {
        const status = (e as Record<string, unknown>).status as
          | number
          | undefined;
        if (status === 409)
          message = "Пользователь с таким именем уже существует";
        if (status === 422) message = message || "Некорректные данные";
      }
      // Translate server's password policy message if it comes in English
      if (
        /Password must contain at least one lowercase letter, one uppercase letter, one number and one symbol!?/i.test(
          message
        )
      ) {
        message =
          "Пароль должен содержать минимум 1 строчную, 1 заглавную букву, 1 цифру и 1 символ";
      }
      if (message && /^validation failed!?$/i.test(message)) {
        message =
          "Проверьте имя пользователя (не короче 5) и пароль (не короче 6)";
      }
      setError("root", { message });
    }
  };

  return (
    <RegisterFormView
      onSubmit={handleSubmit(onSubmit)}
      usernameInputProps={register("username")}
      passwordInputProps={register("password")}
      confirmInputProps={register("confirm")}
      errors={{
        username: errors.username?.message,
        password: errors.password?.message,
        confirm: errors.confirm?.message,
        root: errors.root?.message,
      }}
      isSubmitting={isSubmitting}
    />
  );
}

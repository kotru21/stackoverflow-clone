import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/providers/useAuth";
import { toAppError } from "@/shared/api/app-error";
import { applyAppErrorToForm } from "@/shared/forms/applyAppError";
import { emitNotification } from "@/shared/notifications";
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
  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = form;

  const onSubmit = async (data: FormData) => {
    const username = data.username.trim();
    const password = data.password.trim();
    try {
      await doRegister(username, password);
      navigate("/login", { replace: true });
    } catch (e: unknown) {
      const appErr = toAppError(e);
      // 409 — конфликт имени
      if (appErr.status === 409) {
        setError("username", {
          message: "Пользователь с таким именем уже существует",
        });
        return;
      }
      if (appErr.kind === "validation") {
        applyAppErrorToForm(form, appErr);
        return;
      }
      const msg = appErr.message || "Ошибка регистрации";
      emitNotification({ type: "error", message: msg });
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
      }}
      isSubmitting={isSubmitting}
    />
  );
}

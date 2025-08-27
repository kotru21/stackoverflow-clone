import type { FieldValues, UseFormReturn } from "react-hook-form";
import { isAppError, toAppError } from "@/shared/api/app-error";

// Раскладывает AppError.kind === 'validation' details по полям формы
export function applyAppErrorToForm<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: unknown
) {
  const appErr = isAppError(error) ? error : toAppError(error);
  if (appErr.kind !== "validation") {
    form.setError("root", { message: appErr.message });
    return;
  }
  let assigned = false;
  if (Array.isArray(appErr.details)) {
    for (const d of appErr.details) {
      if (!d.field) continue;
      if (
        (form.getValues() as Record<string, unknown>)[d.field] !== undefined
      ) {
        // @ts-expect-error динамическое имя поля вне Path ограничений
        form.setError(d.field, { message: d.message || appErr.message });
        assigned = true;
      }
    }
  } else if (appErr.details && typeof appErr.details === "object") {
    for (const [field, msg] of Object.entries(appErr.details)) {
      if ((form.getValues() as Record<string, unknown>)[field] !== undefined) {
        // @ts-expect-error динамическое имя поля
        form.setError(field, { message: (msg as string) || appErr.message });
        assigned = true;
      }
    }
  }
  if (!assigned) {
    form.setError("root", { message: appErr.message });
  }
}

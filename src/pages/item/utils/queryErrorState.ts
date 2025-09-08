import type { QueryObserverResult } from "@tanstack/react-query";

// Универсальный helper для извлечения признаков notFound / forbidden из query result
// Основан на нашем AppError (error?.kind) + эвристике: success без data => notFound
export function deriveEntityAccessState<T>(
  result: Pick<QueryObserverResult<T>, "status" | "data" | "error">
) {
  const { status, data, error } = result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kind = (error as any)?.kind as string | undefined;
  const notFound = (status === "success" && !data) || kind === "not_found";
  const forbidden = kind === "forbidden";
  return { notFound, forbidden } as const;
}

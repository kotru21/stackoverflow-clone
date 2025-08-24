import axios from "axios";

//  /api (Vite proxy) или переопределение через VITE_API_BASE_URL
const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

export interface HttpError {
  status?: number;
  message?: string;
}

export function toHttpError(err: unknown): HttpError {
  if (typeof err === "object" && err !== null) {
    const obj = err as Record<string, unknown>;
    const response = (obj as { response?: unknown }).response;
    const resObj =
      typeof response === "object" && response !== null
        ? (response as Record<string, unknown>)
        : undefined;
    const status = resObj?.status as number | undefined;
    const data = resObj?.data as
      | { message?: unknown; error?: unknown; detail?: unknown }
      | undefined;
    let message: string | undefined;
    const pick = (v: unknown) =>
      typeof v === "string" && v.trim() ? v : undefined;
    if (data) {
      message =
        pick(data.message) ||
        pick(data.error) ||
        pick(data.detail) ||
        undefined;
    }
    if (!message && typeof (obj as { message?: unknown }).message === "string")
      message = (obj as { message?: string }).message;
    return { status, message };
  }
  return { message: String(err) };
}

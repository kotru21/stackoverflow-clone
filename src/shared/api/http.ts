import axios from "axios";

// Use relative '/api' by default to leverage Vite proxy (avoids CORS with credentials).
// Can be overridden via VITE_API_BASE_URL if your API supports proper CORS for credentials.
const API_BASE_URL =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_API_BASE_URL || "/api";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.response.use(
  (r) => r,
  (error) => Promise.reject(error)
);

export type HttpError = {
  status?: number;
  message?: string;
};

export function toHttpError(e: unknown): HttpError {
  if (typeof e === "object" && e !== null) {
    const anyE = e as Record<string, unknown>;
    const hasResponse =
      "response" in anyE &&
      typeof anyE.response === "object" &&
      anyE.response !== null;
    const status =
      hasResponse && "status" in (anyE.response as Record<string, unknown>)
        ? ((anyE.response as Record<string, unknown>).status as
            | number
            | undefined)
        : undefined;
    const data =
      hasResponse && "data" in (anyE.response as Record<string, unknown>)
        ? ((anyE.response as Record<string, unknown>).data as Record<
            string,
            unknown
          >)
        : undefined;
    // Try to pick a useful message from common API error shapes
    let message: string | undefined;
    if (data && typeof data === "object") {
      const rec = data as Record<string, unknown>;
      const msg = rec["message"];
      if (typeof msg === "string") message = msg;
      // NestJS/class-validator often returns { message: string[] }
      else if (Array.isArray(msg)) {
        const arr = msg as unknown[];
        const firstStr = arr.find((it) => typeof it === "string");
        if (typeof firstStr === "string") message = firstStr;
        else if (arr.length) {
          const first = arr[0];
          if (typeof first === "object" && first !== null) {
            const obj = first as Record<string, unknown>;
            const constraints = obj["constraints"];
            if (constraints && typeof constraints === "object") {
              const values = Object.values(
                constraints as Record<string, unknown>
              );
              const cFirst = values.find((v) => typeof v === "string");
              if (typeof cFirst === "string") message = cFirst;
            }
          }
        }
      } else {
        const errorMsg = rec["error"];
        const detail = rec["detail"];
        if (typeof errorMsg === "string") message = errorMsg;
        else if (typeof detail === "string") message = detail;
        else if (Array.isArray(rec["errors"])) {
          const arr = rec["errors"] as unknown[];
          // If API returns array of strings
          const firstString = arr.find((it) => typeof it === "string");
          if (typeof firstString === "string") message = firstString;
          else {
            // Try documented shape: { field: string; failures: string[]; receivedValue?: unknown }
            const firstObj = arr.find(
              (it) => typeof it === "object" && it !== null
            );
            if (firstObj) {
              const obj = firstObj as Record<string, unknown>;
              const failures = obj["failures"];
              if (Array.isArray(failures)) {
                const firstFailure = (failures as unknown[]).find(
                  (f) => typeof f === "string"
                );
                if (typeof firstFailure === "string") message = firstFailure;
              }
            }
          }
        }
      }
    }
    if (!message && typeof anyE.message === "string")
      message = anyE.message as string;
    return { status, message };
  }
  return { message: String(e) };
}

// Простой emitter уведомлений через window events + типы
export type NotificationType = "info" | "success" | "error" | "warning";
export interface NotificationPayload {
  id?: string | number;
  type?: NotificationType;
  message: string;
  ttlMs?: number; // время жизни
}

const EVENT_NAME = "app:notify";

export function emitNotification(payload: NotificationPayload) {
  if (typeof window === "undefined") return;
  const detail: NotificationPayload = {
    ttlMs: 4000,
    type: "info",
    ...payload,
    id: payload.id || Date.now() + Math.random(),
  };
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
}

export function subscribeNotifications(cb: (p: NotificationPayload) => void) {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<NotificationPayload>;
    cb(ce.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export function notifyError(message: string) {
  emitNotification({ type: "error", message });
}
export function notifySuccess(message: string) {
  emitNotification({ type: "success", message });
}
export function notifyInfo(message: string) {
  emitNotification({ type: "info", message });
}

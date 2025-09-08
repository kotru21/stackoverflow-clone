import { createContext } from "react";
import type { NotificationPayload } from "@/shared/notifications";

export interface NotificationsContextValue {
  items: NotificationPayload[];
  notify: (p: Omit<NotificationPayload, "id">) => void;
  remove: (id: NotificationPayload["id"]) => void;
}

export const NotificationsContext =
  createContext<NotificationsContextValue | null>(null);

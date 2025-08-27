import { useContext } from "react";
import { NotificationsContext } from "./notifications-core";

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("NotificationsProvider is missing");
  return ctx;
}

export function useNotify() {
  return useNotifications().notify;
}

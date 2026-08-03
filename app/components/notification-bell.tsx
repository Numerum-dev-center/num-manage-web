"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import api from "@/lib/api";
import type { AppNotification } from "@/lib/types/notification";

function formatRelative(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadUnreadCount = () => {
      api
        .get<{ count: number }>("/notifications/unread-count")
        .then((response) => setUnreadCount(response.data.count))
        .catch(() => {});
    };
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) return;

    api
      .get<AppNotification[]>("/notifications")
      .then((response) => setNotifications(response.data))
      .catch(() => setNotifications([]));

    if (unreadCount > 0) {
      setUnreadCount(0);
      api.patch("/notifications/read-all").catch(() => {});
    }
  };

  const handleClickNotification = (notification: AppNotification) => {
    setIsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="p-2 rounded-xl hover:bg-(--theme-surface-muted) text-(--theme-text-secondary) hover:text-(--theme-text-primary) relative transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-(--theme-accent) rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-lg z-50 flex flex-col">
          <div className="px-4 py-3 border-b border-(--theme-border) shrink-0">
            <h3 className="text-sm font-bold text-(--theme-text-primary)">Notifications</h3>
          </div>
          {notifications === null ? (
            <p className="p-4 text-sm text-(--theme-text-secondary)">Chargement...</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-(--theme-text-secondary)">Aucune notification pour le moment.</p>
          ) : (
            <ul className="divide-y divide-(--theme-border)">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleClickNotification(notification)}
                    className={`w-full text-left px-4 py-3 hover:bg-(--theme-surface-muted) transition-colors flex flex-col gap-0.5 ${
                      !notification.isRead ? "bg-(--theme-primary)/5" : ""
                    }`}
                  >
                    <span className="text-sm font-semibold text-(--theme-text-primary)">{notification.title}</span>
                    <span className="text-xs text-(--theme-text-secondary) line-clamp-2">{notification.message}</span>
                    <span className="text-[10px] text-(--theme-text-secondary) mt-0.5">
                      {formatRelative(notification.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/lib/stores/theme.store";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-300 transform active:scale-95 ${
        isDark
          ? "bg-(--theme-primary) text-(--theme-text-inverse) ring-1 ring-(--theme-border)"
          : "bg-transparent text-(--theme-text-secondary) hover:bg-(--theme-surface-muted) hover:text-(--theme-text-primary)"
      } ${className}`}
      title={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}

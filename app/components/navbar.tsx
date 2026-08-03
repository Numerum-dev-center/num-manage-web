
"use client";

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import ThemeToggle from './theme-toggle';

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useAuthStore((state) => state.user);

  const hoverUnderlineStyle =
    'relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-(--theme-accent) after:transition-all after:duration-300 group-hover:after:w-full cursor-pointer';

  return (
    <header className="h-16 bg-(--theme-card-bg) border-b border-(--theme-border) flex items-center justify-between gap-3 px-4 md:px-8 shrink-0 w-full transition-colors duration-300">

      {/* Bouton menu mobile (ouvre la sidebar en tiroir) */}
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 rounded-xl text-(--theme-text-secondary) hover:bg-(--theme-surface-muted) hover:text-(--theme-text-primary) transition-colors shrink-0"
        aria-label="Ouvrir le menu"
      >
        <Menu size={20} />
      </button>

      {/* Barre de recherche (Gauche) — masquée sur mobile pour éviter tout débordement horizontal */}
      <div className="relative w-80 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--theme-text-secondary)" size={16} />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-(--theme-input-bg) text-(--theme-text-primary) text-sm pl-9 pr-4 py-2 rounded-xl border border-(--theme-border) focus:border-(--theme-primary) focus:bg-(--theme-card-bg) outline-none transition-colors placeholder:text-(--theme-text-secondary) placeholder:opacity-70"
        />
      </div>

      {/* Zone Utilisateur & Actions (Droite) */}
      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-xl hover:bg-(--theme-surface-muted) text-(--theme-text-secondary) hover:text-(--theme-text-primary) relative transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-(--theme-accent) rounded-full" />
          </button>
        </div>

        <div className="w-px h-6 bg-(--theme-border)" />

        {/* Bloc Profil (déconnexion : bouton unique en bas de la sidebar) */}
        <Link href="/dashboard/profile" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-(--theme-primary)/10 border border-(--theme-border) flex items-center justify-center text-(--theme-primary) font-bold text-sm shrink-0">
            {user!.firstname.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex flex-col text-left">
            <span className={`text-sm font-bold text-(--theme-text-primary) ${hoverUnderlineStyle}`}>
              {user!.firstname}
            </span>
            <span className="text-[10px] text-(--theme-text-secondary) font-medium uppercase tracking-wider">Connecté</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
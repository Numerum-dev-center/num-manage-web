
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Sun, Moon, Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';


export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();
  const activeSection = useMemo(() => {
    if (!user) return 'student';
    return user.role; // 'admin' | 'manager' | 'student'
  }, [user]);

  useEffect(() => {
    const storedTheme = document.documentElement.getAttribute('data-theme');
    setIsDark(storedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme ? 'dark' : 'light');
  };
const handleLogout = async () => {
      await logout();
      router.push('/auth/login');
  };

  const hoverUnderlineStyle =
    'relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-(--theme-accent) after:transition-all after:duration-300 group-hover:after:w-full cursor-pointer';

  return (
    <header className="h-16 bg-(--theme-card-bg) border-b border-(--theme-border) flex items-center justify-between px-8 shrink-0 w-full transition-colors duration-300">

      {/* Barre de recherche (Gauche) */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--theme-text-secondary)" size={16} />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-(--theme-input-bg) text-(--theme-text-primary) text-sm pl-9 pr-4 py-2 rounded-xl border border-(--theme-border) focus:border-(--theme-primary) focus:bg-(--theme-card-bg) outline-none transition-colors placeholder:text-(--theme-text-secondary) placeholder:opacity-70"
        />
      </div>

      {/* Zone Utilisateur & Actions (Droite) */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 transform active:scale-95 ${isDark
                ? 'bg-(--theme-primary) text-(--theme-text-inverse) ring-1 ring-(--theme-border)'
                : 'bg-transparent text-(--theme-text-secondary) hover:bg-(--theme-surface-muted) hover:text-(--theme-text-primary)'
              }`}
            title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button className="p-2 rounded-xl hover:bg-(--theme-surface-muted) text-(--theme-text-secondary) hover:text-(--theme-text-primary) relative transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-(--theme-accent) rounded-full" />
          </button>
        </div>

        <div className="w-px h-6 bg-(--theme-border)" />

        {/* Bloc Profil + Déconnexion (Réponse au Ticket #288) */}
        <div className="flex  items-center gap-4">

          {/* Nom de l'utilisateur avec effet de soulignement au survol du groupe */}
          <div className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-(--theme-primary)/10 border border-(--theme-border) flex items-center justify-center text-(--theme-primary) font-bold text-sm shadow-inner shrink-0">
              {user!.firstname.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-sm font-bold text-(--theme-text-primary) ${hoverUnderlineStyle}`}>
                {user!.firstname}
              </span>
              <span className="text-[10px] text-(--theme-text-secondary) font-medium uppercase tracking-wider">Connecté</span>
            </div>
          </div>

          {/* Bouton Déconnexion */}
          <button
            onClick={ handleLogout}
            className="p-2.5 rounded-xl bg-(--theme-surface-muted) border border-(--theme-border) text-(--theme-accent) hover:bg-(--theme-accent) hover:text-(--theme-text-inverse) transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold group"
            title="Se déconnecter"
          >
            <LogOut size={16} className="group-hover:scale-105 transition-transform" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>

        </div>

      </div>
    </header>
  );
}
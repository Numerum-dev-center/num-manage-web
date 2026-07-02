
"use client";

import React,{ useState } from 'react';
import { Search, Sun,Moon, Bell, LogOut, User } from 'lucide-react';

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Navbar({ userName = "Alexandre Silva", onLogout }: NavbarProps) {
  
  // Fonction de déconnexion par défaut si aucune n'est passée en prop
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  const handleDefaultLogout = () => {
    console.log("Déconnexion de l'utilisateur...");
    // Insère ici ta logique (ex: signOut() de NextAuth, cookies.remove, etc.)
  };

  // Style de soulignement au survol demandé
  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ef4726] after:transition-all after:duration-300 group-hover:after:w-full cursor-pointer";

  return (
    <header className="h-16 bg-white border-b border-[#81bdaa]/30 flex items-center justify-between px-8 shrink-0 w-full">
      
      {/* Barre de recherche (Gauche) */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
        <input 
          type="text" 
          placeholder="Search anything..." 
          className="w-full bg-[#fcfefd]  text-[#076648] text-sm pl-9 pr-4 py-2 rounded-xl border border-[#81bdaa]/40 focus:border-[#076648] focus:bg-white outline-none transition-all placeholder-[#81bdaa]/70"
        />
      </div>

      {/* Zone Utilisateur & Actions (Droite) */}
      <div className="flex items-center gap-6">
        
        
        {/* Icônes Utilitaires */}
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 transform active:scale-95 ${
              isDark 
                ? 'bg-[#076648] text-[#fcfefd] ring-1 ring-[#81bdaa]/30' 
                : 'bg-transparent text-[#81bdaa] hover:bg-[#fcfefd] hover:text-[#076648]'
            }`}
            title={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
          >
            {isDark ? (
              <Moon size={18} className="animate-in fade-in zoom-in-75 duration-300" />
            ) : (
              <Sun size={18} className="animate-in fade-in zoom-in-75 duration-300" />
            )}
          </button>
          {/* Bouton cloche notification */}
          <button className="p-2 rounded-xl hover:bg-[#fcfefd] text-[#81bdaa] hover:text-[#076648] relative transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4726] rounded-full" />
          </button>
        </div>

        {/* Séparateur visuel */}
        <div className="w-px h-6  bg-[#81bdaa]/30" />

        {/* Bloc Profil + Déconnexion (Réponse au Ticket #288) */}
        <div className="flex  items-center gap-4">
          
          {/* Nom de l'utilisateur avec effet de soulignement au survol du groupe */}
          <div className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#076648]/10 border border-[#81bdaa]/40 flex items-center justify-center text-[#076648] font-bold text-sm shadow-inner shrink-0">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col text-left">
              <span className={`text-sm font-bold text-[#076648] ${hoverUnderlineStyle}`}>
                {userName}
              </span>
              <span className="text-[10px] text-[#81bdaa] font-medium uppercase tracking-wider">Connecté</span>
            </div>
          </div>

          {/* Bouton Déconnexion */}
          <button 
            onClick={onLogout || handleDefaultLogout}
            className="p-2.5 rounded-xl bg-[#fcfefd] border border-[#ef4726]/20 text-[#ef4726] hover:bg-[#ef4726] hover:text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold group"
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
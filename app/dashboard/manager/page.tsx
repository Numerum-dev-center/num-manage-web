
"use client";

import React, { useState } from 'react';
import { 
  LayoutDashboard, GraduationCap, Users, FileSpreadsheet, BarChart3,
  Settings, HelpCircle, Search, Sun, Moon, Bell, Plus, 
  Download, TrendingUp, TrendingDown, Star, Send, Sparkles, LogOut, ChevronDown
} from 'lucide-react';

export default function FormateurDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ef4726] after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  const kpis = [
    { title: "Apprenants actifs", value: "1,224", trend: "+ 15.5%", up: true },
    { title: "Taux de rétention", value: "94.2%", trend: "- 1.4%", up: false },
    { title: "Devoirs à corriger", value: "12", trend: "- 12.5%", up: false },
    { title: "Revenus ce mois", value: "$4,680", trend: "+ 8.4%", up: true }
  ];

  const courses = [
    { id: "#CRS-99", name: "Bootcamp Fullstack Next.js & Tailwind", students: "432 apprenants", revenue: "$124,839", rating: 5.0 },
    { id: "#CRS-01", name: "Masterclass TypeScript de Zéro à Expert", students: "310 apprenants", revenue: "$92,662", rating: 4.9 },
    { id: "#CRS-04", name: "UI/UX Design appliqué au développement web", students: "215 apprenants", revenue: "$74,048", rating: 4.7 },
    { id: "#CRS-02", name: "DevOps : Docker, GitHub Actions & Vercel", students: "124 apprenants", revenue: "$62,820", rating: 4.6 },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] font-sans antialiased transition-colors duration-300">
      
      {/* SIDEBAR FORMATEUR */}
      <aside className="w-64 bg-white dark:bg-[#042d20] border-r border-[#81bdaa]/30 dark:border-[#81bdaa]/10 flex flex-col justify-between p-5 shrink-0 transition-colors duration-300">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-[#ef4726] flex items-center justify-center text-white font-black text-sm">N</div>
            <span className="text-base font-bold text-[#076648] dark:text-[#fcfefd] tracking-tight">Numerum dev center</span>
          </div>

          <nav className="flex flex-col gap-1">
            <p className="text-[10px] font-bold text-[#81bdaa] uppercase tracking-wider px-2 mb-2">Espace Formateur</p>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#076648]/10 text-[#076648] dark:bg-[#fcfefd]/10 dark:text-[#fcfefd]">
              <LayoutDashboard size={18} /> <span className={hoverUnderlineStyle}>Tableau de bord</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <GraduationCap size={18} /> <span className={hoverUnderlineStyle}>Gestion des Cours</span>
            </button>
            <button className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <div className="flex items-center gap-3">
                <Users size={18} /> <span className={hoverUnderlineStyle}>Suivi des Élèves</span>
              </div>
              <span className="bg-[#ef4726] text-white text-xs px-2 py-0.5 rounded-full font-bold">46</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <FileSpreadsheet size={18} /> <span className={hoverUnderlineStyle}>Évaluations / Quiz</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <BarChart3 size={18} /> <span className={hoverUnderlineStyle}>Performances</span>
            </button>

            <p className="text-[10px] font-bold text-[#81bdaa] uppercase tracking-wider px-2 mt-5 mb-2">Paramètres</p>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <Settings size={18} /> <span className={hoverUnderlineStyle}>Configurations</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] group transition-all">
              <HelpCircle size={18} /> <span className={hoverUnderlineStyle}>Centre d'aide</span>
            </button>
          </nav>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#076648] to-[#81bdaa]/40 rounded-2xl text-[#fcfefd] relative overflow-hidden shadow-sm mt-4">
          <h4 className="text-sm font-bold">Outils Formateur</h4>
          <p className="text-[11px] text-[#fcfefd]/80 mt-1 mb-3">Débloquez les générateurs d'examens automatisés et l'export scolarité complet.</p>
          <button className="w-full bg-[#ef4726] text-white py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#ef4726]/90 transition-colors">Upgrade Panel</button>
        </div>
      </aside>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* NAVBAR SUPÉRIEURE */}
        <header className="h-16 bg-white dark:bg-[#042d20] border-b border-[#81bdaa]/30 dark:border-[#81bdaa]/10 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un étudiant, une note..." 
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-[#076648] dark:text-[#fcfefd] text-sm pl-9 pr-4 py-2 rounded-xl border border-[#81bdaa]/40 focus:border-[#076648] focus:bg-white outline-none transition-all placeholder-[#81bdaa]/70"
            />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-xl transition-all transform active:scale-95 ${isDark ? 'bg-[#ef4726] text-white' : 'text-[#81bdaa] hover:text-[#076648]'}`}>
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="p-2 rounded-xl text-[#81bdaa] hover:text-[#076648] relative">
              <Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4726] rounded-full" />
            </button>
            <div className="w-px h-6 bg-[#81bdaa]/30" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#81bdaa]/20 border border-[#81bdaa]/40 flex items-center justify-center font-bold text-xs text-[#076648] dark:text-[#fcfefd]">AS</div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-[#076648] dark:text-[#fcfefd]">Alexandre Silva</span>
                  <span className="text-[10px] text-[#81bdaa] font-semibold tracking-wider">FORMATEUR</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fcfefd] border border-[#ef4726]/30 text-[#ef4726] rounded-xl text-xs font-bold hover:bg-[#ef4726] hover:text-white transition-all">
                <LogOut size={14} /> Déconnexion
              </button>
            </div>
          </div>
        </header>

        {/* CONTAINER DASHBOARD */}
        <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-[#076648] dark:text-[#fcfefd]"><span className={hoverUnderlineStyle}>Supervision des Classes</span></h1>
            <div className="flex items-center gap-2.5">
              <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/40 rounded-xl text-xs font-semibold text-[#076648] dark:text-[#fcfefd]">
                Jan 1, 2026 - Feb 1, 2026 <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/40 rounded-xl text-xs font-semibold text-[#076648] dark:text-[#fcfefd]"><Plus size={14} /> Nouveau cours</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#076648] rounded-xl text-xs font-semibold text-[#fcfefd]">
                <Download size={14} /> Exporter Excel
              </button>
            </div>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex flex-col gap-2">
                <span className="text-xs font-medium text-[#81bdaa]">{kpi.title}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#076648] dark:text-[#fcfefd]">{kpi.value}</span>
                  <span className={`text-xs font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${kpi.up ? 'bg-[#076648]/10 text-[#076648]' : 'bg-[#ef4726]/10 text-[#ef4726]'}`}>
                    {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* GRAPHES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 p-6 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl min-h-[320px] flex flex-col justify-between">
              <div>
                <span className="text-xs font-medium text-[#81bdaa]">Taux d'engagement des classes (Mensuel)</span>
                <h3 className="text-2xl font-black text-[#076648] dark:text-[#fcfefd] mt-0.5">Activité globale de l'école</h3>
              </div>
              <div className="w-full h-44 mt-4 relative">
                <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
                  <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,50" fill="none" stroke="#076648" strokeWidth="3" />
                  <circle cx="270" cy="40" r="5" fill="#ef4726" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-[#076648] dark:text-[#fcfefd] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Pics de corrections</span></h3>
                <div className="flex items-end justify-between h-28 pt-4">
                  {[30, 45, 35, 95, 60, 40, 25].map((val, idx) => (
                    <div key={idx} className="w-3 bg-[#fcfefd] dark:bg-[#032117] h-20 relative rounded-full overflow-hidden">
                      <div className={`absolute bottom-0 w-full ${idx === 3 ? 'bg-[#ef4726]' : 'bg-[#076648]'}`} style={{ height: `${val}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex-1 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-bold text-[#076648] dark:text-[#fcfefd] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Taux de complétion</span></h3>
                  <p className="text-[11px] text-[#81bdaa]">Pourcentage moyen de validation des acquis.</p>
                </div>
                <div className="text-xl font-black text-[#076648] dark:text-[#fcfefd]">72%</div>
              </div>
            </div>
          </div>

          {/* TABLE & AI */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#81bdaa]/20">
                <h3 className="text-sm font-bold text-[#076648] dark:text-[#fcfefd]"><span className={hoverUnderlineStyle}>Performance des cours distribués</span></h3>
              </div>
              <table className="w-full text-left text-xs text-[#076648] dark:text-[#fcfefd]">
                <thead>
                  <tr className="bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] font-bold">
                    <th className="p-3 px-5">ID</th>
                    <th className="p-3 px-5">Titre du cours dispensé</th>
                    <th className="p-3 px-5">Total Inscrits</th>
                    <th className="p-3 px-5">Revenus générés</th>
                    <th className="p-3 px-5">Note moyenne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#81bdaa]/10">
                  {courses.map((row, index) => (
                    <tr key={index} className="hover:bg-[#fcfefd] dark:hover:bg-[#032117]/30">
                      <td className="p-3.5 px-5 text-[#81bdaa]">{row.id}</td>
                      <td className="p-3.5 px-5 font-bold">{row.name}</td>
                      <td className="p-3.5 px-5 text-[#81bdaa]">{row.students}</td>
                      <td className="p-3.5 px-5 font-bold text-[#ef4726]">{row.revenue}</td>
                      <td className="p-3.5 px-5 text-[#ef4726] flex items-center gap-1"><Star size={12} fill="currentColor" /> {row.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-br from-[#076648] to-[#054430] text-[#fcfefd] rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#81bdaa] font-black tracking-widest">AI CORE ENGINE</span>
                <h3 className="text-base font-bold"><span className={hoverUnderlineStyle}>Assistant Formateur</span></h3>
                <p className="text-xs text-[#fcfefd]/80 mt-1">Générez un plan de cours automatisé, créez un nouveau quiz ou analysez le décrochage de vos élèves.</p>
              </div>
              <div className="relative mt-4">
                <input 
                  type="text" placeholder="Générer un exercice sur TypeScript..." value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                  className="w-full bg-[#fcfefd]/10 text-xs pl-4 pr-10 py-3 rounded-xl text-white placeholder-[#81bdaa] outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#ef4726] text-white rounded-lg"><Send size={12} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}
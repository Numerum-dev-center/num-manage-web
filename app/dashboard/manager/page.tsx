"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  Send,
  ChevronDown,
} from "lucide-react";

export default function FormateurDashboard() {
  const [aiInput, setAiInput] = useState("");

  const hoverUnderlineStyle =
    "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[var(--theme-accent)] after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  const kpis = [
    { title: "Apprenants actifs", value: "1,224", trend: "+ 15.5%", up: true },
    { title: "Taux de rétention", value: "94.2%", trend: "- 1.4%", up: false },
    { title: "Devoirs à corriger", value: "12", trend: "- 12.5%", up: false },
    { title: "Revenus ce mois", value: "$4,680", trend: "+ 8.4%", up: true },
  ];

  const courses = [
    { id: "#CRS-99", name: "Bootcamp Fullstack Next.js & Tailwind", students: "432 apprenants", revenue: "$124,839", rating: 5.0 },
    { id: "#CRS-01", name: "Masterclass TypeScript de Zéro à Expert", students: "310 apprenants", revenue: "$92,662", rating: 4.9 },
    { id: "#CRS-04", name: "UI/UX Design appliqué au développement web", students: "215 apprenants", revenue: "$74,048", rating: 4.7 },
    { id: "#CRS-02", name: "DevOps : Docker, GitHub Actions & Vercel", students: "124 apprenants", revenue: "$62,820", rating: 4.6 },
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--theme-text-primary)]">
          <span className={hoverUnderlineStyle}>Supervision des Classes</span>
        </h1>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-3 py-2 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-xl text-xs font-semibold text-[var(--theme-text-primary)] hover:border-[var(--theme-primary)] transition-all">
            Jan 1, 2026 - Feb 1, 2026 <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-xl text-xs font-semibold text-[var(--theme-text-primary)] shadow-sm hover:border-[var(--theme-primary)] transition-all">
            <Plus size={14} /> Nouveau cours
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-[var(--theme-primary)] rounded-xl text-xs font-semibold text-[var(--theme-text-inverse)] shadow-sm hover:bg-[var(--theme-primary-hover)] transition-colors">
            <Download size={14} /> Exporter Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl flex flex-col gap-2">
            <span className="text-xs font-medium text-[var(--theme-text-secondary)]">{kpi.title}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-[var(--theme-text-primary)]">{kpi.value}</span>
              <span className={`text-xs font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${kpi.up ? 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]' : 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl shadow-sm flex flex-col justify-between min-h-80">
          <div>
            <span className="text-xs font-medium text-[var(--theme-text-secondary)]">Taux d'engagement des classes (Mensuel)</span>
            <h3 className="text-2xl font-black text-[var(--theme-text-primary)] mt-0.5">Activité globale de l'école</h3>
          </div>
          <div className="w-full h-44 mt-4 relative">
            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--theme-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20" fill="none" stroke="var(--theme-primary)" strokeWidth="3" strokeLinecap="round" />
              <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20 L500,100 L0,100 Z" fill="url(#chartGrad)" />
              <circle cx="340" cy="32" r="5" fill="var(--theme-accent)" stroke="var(--theme-card-bg)" strokeWidth="2" className="drop-shadow-sm" />
            </svg>
            <div className="absolute top-4 left-[64%] bg-[var(--theme-primary)] text-[var(--theme-text-inverse)] text-[10px] p-2 rounded-lg shadow-md flex flex-col gap-0.5">
              <span className="font-bold">$12,324 this month</span>
              <span className="text-[var(--theme-text-secondary)] font-medium">Jan 18, 2026</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-5 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl shadow-sm flex-1 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-[var(--theme-text-primary)] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Pics de corrections</span></h3>
            <div className="flex items-end justify-between h-28 pt-4 px-2">
              {[30, 45, 35, 95, 60, 40, 25].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-full max-w-3.5 bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] rounded-full h-20 relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 w-full rounded-full transition-all ${idx === 3 ? 'bg-[var(--theme-accent)]' : 'bg-[var(--theme-primary)]'}`} style={{ height: `${val}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--theme-text-secondary)] font-semibold">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl shadow-sm flex-1 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold text-[var(--theme-text-primary)] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Taux de complétion</span></h3>
              <p className="text-[11px] text-[var(--theme-text-secondary)]">Pourcentage moyen de validation des acquis.</p>
            </div>
            <div className="text-xl font-black text-[var(--theme-text-primary)]">72%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--theme-card-bg)] border border-[var(--theme-border)] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[var(--theme-border)]">
            <h3 className="text-sm font-bold text-[var(--theme-text-primary)]"><span className={hoverUnderlineStyle}>Performance des cours distribués</span></h3>
          </div>
          <table className="w-full text-left text-xs text-[var(--theme-text-primary)]">
            <thead>
              <tr className="bg-[var(--theme-surface-muted)] text-[var(--theme-text-secondary)] font-bold">
                <th className="p-3 px-5">ID</th>
                <th className="p-3 px-5">Titre du cours dispensé</th>
                <th className="p-3 px-5">Total Inscrits</th>
                <th className="p-3 px-5">Revenus générés</th>
                <th className="p-3 px-5">Note moyenne</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)]">
              {courses.map((row, index) => (
                <tr key={index} className="hover:bg-[var(--theme-surface-muted)]">
                  <td className="p-3.5 px-5 text-[var(--theme-text-secondary)]">{row.id}</td>
                  <td className="p-3.5 px-5 font-bold">{row.name}</td>
                  <td className="p-3.5 px-5 text-[var(--theme-text-secondary)]">{row.students}</td>
                  <td className="p-3.5 px-5 font-bold text-[var(--theme-accent)]">{row.revenue}</td>
                  <td className="p-3.5 px-5 text-[var(--theme-accent)] flex items-center gap-1"><Star size={12} fill="currentColor" /> {row.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-linear-to-br from-[var(--theme-primary)] to-[var(--theme-primary-hover)] text-[var(--theme-text-inverse)] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[var(--theme-text-secondary)] font-black tracking-widest">AI CORE ENGINE</span>
            <h3 className="text-base font-bold"><span className={hoverUnderlineStyle}>Assistant Formateur</span></h3>
            <p className="text-xs text-[var(--theme-text-inverse)]/80 mt-1">Générez un plan de cours automatisé, créez un nouveau quiz ou analysez le décrochage de vos élèves.</p>
          </div>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Générer un exercice sur TypeScript..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="w-full bg-[var(--theme-input-bg)]/10 text-xs pl-4 pr-10 py-3 rounded-xl text-[var(--theme-text-inverse)] placeholder:text-[var(--theme-text-secondary)] outline-none"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[var(--theme-accent)] text-[var(--theme-text-inverse)] rounded-lg">
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

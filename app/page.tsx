"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Sparkles, Code2, GraduationCap, Users, 
  Terminal, Shield, CheckCircle2, Menu, X, ChevronRight, Play
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ef4726] after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] font-sans antialiased selection:bg-[#ef4726] selection:text-white overflow-x-hidden transition-colors duration-300">
      
      {/* EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN (GLOW EFFECTS) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#076648]/10 dark:bg-[#076648]/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#ef4726]/5 dark:bg-[#ef4726]/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full bg-[#fcfefd]/80 dark:bg-[#032117]/80 backdrop-blur-md z-50 border-b border-[#81bdaa]/20">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ef4726] flex items-center justify-center text-white font-black text-base shadow-md shadow-[#ef4726]/20">
              N
            </div>
            <span className="text-lg font-black tracking-tight text-[#076648] dark:text-[#fcfefd]">
              Numerum<span className="text-[#ef4726]">.</span>
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#076648]/80 dark:text-[#fcfefd]/80">
            <a href="#features" className={hoverUnderlineStyle}>Plateforme</a>
            <a href="#bento" className={hoverUnderlineStyle}>Écosystème</a>
            <a href="#stats" className={hoverUnderlineStyle}>Impact</a>
            <a href="#pricing" className={hoverUnderlineStyle}>Cursus</a>
          </nav>

          {/* Actions Cta */}
          <div className="hidden md:flex items-center gap-4">
            
            <button  onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-5 py-2.5 bg-[#076648] text-[#fcfefd] dark:bg-[#fcfefd] dark:text-[#076648] rounded-xl text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              Inscription <ChevronRight size={16} />
            </button>
            <button  onClick={() => router.push('/auth/login')} className="text-sm font-bold text-[#076648] dark:text-[#fcfefd] hover:opacity-80 transition-opacity">
              Connexion
            </button>
          </div>

          {/* Bouton Mobile */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#076648] dark:text-[#fcfefd]">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-[#fcfefd] dark:bg-[#032117] border-b border-[#81bdaa]/20 p-6 flex flex-col gap-4 animate-fade-in">
            <a href="#features" className="text-lg font-semibold">Plateforme</a>
            <a href="#bento" className="text-lg font-semibold">Écosystème</a>
            <a href="#stats" className="text-lg font-semibold">Impact</a>
            <button className="w-full py-3 border border-[#076648]/20 dark:border-[#fcfefd]/20 rounded-xl font-bold">Connexion</button>
            <button className="w-full py-3 bg-[#ef4726] text-white rounded-xl font-bold shadow-lg">Rejoindre le Hub</button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        {/* Badge Flottant */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ef4726]/10 text-[#ef4726] rounded-full text-xs font-bold tracking-wide uppercase mb-6 border border-[#ef4726]/20 animate-bounce">
          <Sparkles size={12} className="fill-current" /> Next-Gen Software Engineering Hub
        </div>

        {/* Titre Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] text-[#076648] dark:text-white">
          L'ingénierie logicielle <br />
          <span className="bg-gradient-to-r from-[#076648] via-[#81bdaa] to-[#ef4726] bg-clip-text text-transparent">
            propulsée par la production.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-base sm:text-xl text-[#81bdaa] dark:text-[#fcfefd]/70 max-w-3xl leading-relaxed">
          Un centre de développement hybride unifiant apprenants d'élite et formateurs chevronnés. Concevez, déployez et supervisez des architectures modernes soutenues par l'intelligence artificielle.
        </p>

        {/* CTAs Tactiques */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 bg-[#ef4726] text-white font-bold rounded-xl shadow-lg shadow-[#ef4726]/30 hover:bg-[#ef4726]/90 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2 group">
            Espace Apprenant <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white dark:bg-[#042d20] border-2 border-[#076648]/20 dark:border-[#81bdaa]/20 font-bold rounded-xl hover:bg-[#076648]/5 dark:hover:bg-[#042d20]/50 transition-all flex items-center justify-center gap-2">
            <Play size={16} fill="currentColor" /> Démo Formateur
          </button>
        </div>

        {/* Mockup Dashboard Abstrait */}
        <div className="mt-16 w-full rounded-2xl border border-[#81bdaa]/30 bg-white/50 dark:bg-[#042d20]/50 p-3 shadow-2xl backdrop-blur-sm group overflow-hidden">
          <div className="w-full h-[400px] rounded-xl bg-[#032117] border border-[#81bdaa]/20 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#076648_1px,transparent_1px),linear-gradient(to_bottom,#076648_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-[#076648]/30 border border-[#81bdaa]/30 text-[#ef4726] animate-pulse">
                <Terminal size={32} />
              </div>
              <span className="text-xs font-mono text-[#81bdaa]">root@numerum-dev-center:~# dynamic-dashboards-loaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section id="bento" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight"><span className={hoverUnderlineStyle}>Une infrastructure, deux piliers</span></h2>
          <p className="text-sm text-[#81bdaa] mt-2">Découvrez l'organisation en bento box de notre écosystème connecté.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Box 1: Espace Apprenant */}
          <div className="md:col-span-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#076648] transition-all shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#076648]/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 bg-[#076648]/10 rounded-2xl flex items-center justify-center text-[#076648] dark:text-[#81bdaa] mb-6">
                <Code2 size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Espace d'Apprentissage Actif</h3>
              <p className="text-sm text-[#81bdaa] leading-relaxed max-w-xl">
                Suivez vos modules Next.js, validez vos acquis sur Tailwind v4 et observez vos KPIs d'apprentissage grimper. Conçu pour le tracking de performance individuel d'élite.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#ef4726] cursor-pointer group/link">
              Explorer le dashboard apprenant <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Box 2: Les Cursus */}
          <div className="bg-gradient-to-br from-[#076648] to-[#042d20] text-[#fcfefd] border border-[#076648] rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-12 h-12 bg-[#fcfefd]/10 rounded-2xl flex items-center justify-center text-[#ef4726] mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cursus Stack</h3>
              <p className="text-xs text-[#fcfefd]/70 leading-relaxed">
                Des architectures Micro-frontends aux optimisations PostgreSQL poussées. Des parcours calibrés pour le marché international.
              </p>
            </div>
            <div className="mt-8 border-t border-[#81bdaa]/20 pt-4 flex items-center justify-between text-xs font-mono text-[#81bdaa]">
              <span>5 Modules Majeurs</span>
              <span className="text-[#ef4726]">100% Pratique</span>
            </div>
          </div>

          {/* Bento Box 3: AI Core Engine */}
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#ef4726]/50 transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 bg-[#ef4726]/10 rounded-2xl flex items-center justify-center text-[#ef4726] mb-6 animate-pulse">
                <Sparkles size={24} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Core Assistant</h3>
              <p className="text-xs text-[#81bdaa] leading-relaxed">
                Intégration d'un tuteur IA pour générer des fiches de révision de code instantanées et analyser les goulots d'étranglement des élèves.
              </p>
            </div>
          </div>

          {/* Bento Box 4: Espace Formateur */}
          <div className="md:col-span-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#076648] transition-all shadow-sm">
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-[#ef4726]/5 rounded-tl-full pointer-events-none transition-all" />
            <div>
              <div className="w-12 h-12 bg-[#81bdaa]/20 rounded-2xl flex items-center justify-center text-[#076648] dark:text-[#fcfefd] mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Supervision & Pilotage Formateur</h3>
              <p className="text-sm text-[#81bdaa] leading-relaxed max-w-xl">
                Suivi global des classes, taux de rétention, analytics d'engagement et outils de correction automatisés pour piloter des centaines d'élèves sans friction.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#076648] dark:text-[#fcfefd] cursor-pointer group/link">
              Accéder au panel de contrôle <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* STATS IMPACT SECTION */}
      <section id="stats" className="py-20 bg-[#076648]/5 dark:bg-[#042d20]/30 border-y border-[#81bdaa]/20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#ef4726]">+94%</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#81bdaa]">Taux de complétion</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#076648] dark:text-white">1,200+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#81bdaa]">Apprenants actifs</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#ef4726]">5/5</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#81bdaa]">Satisfaction Cursus</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-[#076648] dark:text-white">48h</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#81bdaa]">Délai max de Recrutement</span>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative">
        <div className="p-8 sm:p-14 bg-gradient-to-br from-[#076648] to-[#032117] text-[#fcfefd] rounded-3xl border border-[#81bdaa]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef4726]/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Prêt à transformer <br />votre ingénierie ?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#81bdaa] max-w-2xl mx-auto">
            Rejoignez Numerum dev center dès aujourd'hui. Configurez votre espace selon votre profil et commencez à bâtir l'avenir du web.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-[#ef4726] text-white font-bold rounded-xl shadow-lg shadow-[#ef4726]/20 hover:bg-[#ef4726]/90 transition-all text-sm">
              Créer mon compte d'accès
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm">
              Contacter le support
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-[#81bdaa] font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#ef4726]" /> Aucun engagement</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#ef4726]" /> SSO & Multi-rôles natif</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#ef4726]" /> Conforme Tailwind v4</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#81bdaa]/20 py-8 px-6 text-center text-xs text-[#81bdaa] font-medium">
        <p>&copy; 2026 Numerum dev center. Tous droits réservés. Cursus ingénieur logiciel d'élite.</p>
      </footer>

    </div>
  );
}
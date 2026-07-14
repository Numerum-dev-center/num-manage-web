"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Sparkles, Code2, GraduationCap, Users,
  Terminal, CheckCircle2, Menu, X, ChevronRight, Play
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-(--theme-accent) after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  return (
    <div className="min-h-screen w-full bg-(--theme-page-bg) text-(--theme-text-primary) font-sans antialiased selection:bg-(--theme-accent) selection:text-(--theme-text-inverse) overflow-x-hidden transition-colors duration-300">

      {/* EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN (GLOW EFFECTS) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-(--theme-primary)/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-(--theme-accent)/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className="fixed top-0 w-full bg-(--theme-page-bg)/80 backdrop-blur-md z-50 border-b border-(--theme-border)">
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-(--theme-accent) flex items-center justify-center text-(--theme-text-inverse) font-black text-base shadow-md shadow-(--theme-accent)/20">
              N
            </div>
            <span className="text-lg font-black tracking-tight text-(--theme-text-primary)">
              Numerum<span className="text-(--theme-accent)">.</span>
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-(--theme-text-primary)/80">
            <a href="#features" className={hoverUnderlineStyle}>Plateforme</a>
            <a href="#bento" className={hoverUnderlineStyle}>Écosystème</a>
            <a href="#stats" className={hoverUnderlineStyle}>Impact</a>
            <a href="#pricing" className={hoverUnderlineStyle}>Cursus</a>
          </nav>

          {/* Actions Cta */}
          <div className="hidden md:flex items-center gap-4">

            <button  onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-5 py-2.5 bg-(--theme-primary) text-(--theme-text-inverse) rounded-xl text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              Inscription <ChevronRight size={16} />
            </button>
            <button  onClick={() => router.push('/auth/login')} className="text-sm font-bold text-(--theme-text-primary) hover:opacity-80 transition-opacity">
              Connexion
            </button>
          </div>

          {/* Bouton Mobile */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-(--theme-text-primary)">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-(--theme-page-bg) border-b border-(--theme-border) p-6 flex flex-col gap-4 animate-fade-in">
            <a href="#features" className="text-lg font-semibold">Plateforme</a>
            <a href="#bento" className="text-lg font-semibold">Écosystème</a>
            <a href="#stats" className="text-lg font-semibold">Impact</a>
            <button className="w-full py-3 border border-(--theme-border-strong) rounded-xl font-bold">Connexion</button>
            <button className="w-full py-3 bg-(--theme-accent) text-(--theme-text-inverse) rounded-xl font-bold shadow-lg">Rejoindre le Hub</button>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative">
        {/* Badge Flottant */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-(--theme-accent)/10 text-(--theme-accent) rounded-full text-xs font-bold tracking-wide uppercase mb-6 border border-(--theme-accent)/20 animate-bounce">
          <Sparkles size={12} className="fill-current" /> Next-Gen Software Engineering Hub
        </div>

        {/* Titre Principal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.1] text-(--theme-text-primary)">
          L'ingénierie logicielle <br />
          <span className="bg-linear-to-r from-(--theme-primary) via-(--theme-text-secondary) to-(--theme-accent) bg-clip-text text-transparent">
            propulsée par la production.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-base sm:text-xl text-(--theme-text-secondary) max-w-3xl leading-relaxed">
          Un centre de développement hybride unifiant apprenants d'élite et formateurs chevronnés. Concevez, déployez et supervisez des architectures modernes soutenues par l'intelligence artificielle.
        </p>

        {/* CTAs Tactiques */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 bg-(--theme-accent) text-(--theme-text-inverse) font-bold rounded-xl shadow-lg shadow-(--theme-accent)/30 hover:bg-(--theme-accent)/90 hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2 group">
            Espace Apprenant <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-(--theme-card-bg) border-2 border-(--theme-border) font-bold rounded-xl hover:bg-(--theme-primary)/5 transition-all flex items-center justify-center gap-2">
            <Play size={16} fill="currentColor" /> Démo Formateur
          </button>
        </div>

        {/* Mockup Dashboard Abstrait */}
        <div className="mt-16 w-full rounded-2xl border border-(--theme-border) bg-(--theme-card-bg)/50 p-3 shadow-2xl backdrop-blur-sm group overflow-hidden">
          <div className="w-full h-[400px] rounded-xl bg-(--theme-sidebar-bg) border border-(--theme-sidebar-border) relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--theme-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--theme-primary)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
            <div className="z-10 flex flex-col items-center gap-3">
              <div className="p-4 rounded-full bg-(--theme-primary)/30 border border-(--theme-border-strong) text-(--theme-accent) animate-pulse">
                <Terminal size={32} />
              </div>
              <span className="text-xs font-mono text-(--theme-sidebar-muted)">root@numerum-dev-center:~# dynamic-dashboards-loaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section id="bento" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight"><span className={hoverUnderlineStyle}>Une infrastructure, deux piliers</span></h2>
          <p className="text-sm text-(--theme-text-secondary) mt-2">Découvrez l'organisation en bento box de notre écosystème connecté.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bento Box 1: Espace Apprenant */}
          <div className="md:col-span-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-(--theme-primary) transition-all shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--theme-primary)/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 bg-(--theme-primary)/10 rounded-2xl flex items-center justify-center text-(--theme-primary) mb-6">
                <Code2 size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Espace d'Apprentissage Actif</h3>
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed max-w-xl">
                Suivez vos modules Next.js, validez vos acquis sur Tailwind v4 et observez vos KPIs d'apprentissage grimper. Conçu pour le tracking de performance individuel d'élite.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-(--theme-accent) cursor-pointer group/link">
              Explorer le dashboard apprenant <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento Box 2: Les Cursus */}
          <div className="bg-linear-to-br from-(--theme-primary) to-(--theme-primary-hover) text-(--theme-text-inverse) border border-(--theme-primary) rounded-3xl p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-12 h-12 bg-(--theme-text-inverse)/10 rounded-2xl flex items-center justify-center text-(--theme-accent) mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Cursus Stack</h3>
              <p className="text-xs text-(--theme-text-inverse)/70 leading-relaxed">
                Des architectures Micro-frontends aux optimisations PostgreSQL poussées. Des parcours calibrés pour le marché international.
              </p>
            </div>
            <div className="mt-8 border-t border-(--theme-border) pt-4 flex items-center justify-between text-xs font-mono text-(--theme-text-secondary)">
              <span>5 Modules Majeurs</span>
              <span className="text-(--theme-accent)">100% Pratique</span>
            </div>
          </div>

          {/* Bento Box 3: AI Core Engine */}
          <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-(--theme-accent)/50 transition-all shadow-sm">
            <div>
              <div className="w-12 h-12 bg-(--theme-accent)/10 rounded-2xl flex items-center justify-center text-(--theme-accent) mb-6 animate-pulse">
                <Sparkles size={24} fill="currentColor" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Core Assistant</h3>
              <p className="text-xs text-(--theme-text-secondary) leading-relaxed">
                Intégration d'un tuteur IA pour générer des fiches de révision de code instantanées et analyser les goulots d'étranglement des élèves.
              </p>
            </div>
          </div>

          {/* Bento Box 4: Espace Formateur */}
          <div className="md:col-span-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-(--theme-primary) transition-all shadow-sm">
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-(--theme-accent)/5 rounded-tl-full pointer-events-none transition-all" />
            <div>
              <div className="w-12 h-12 bg-(--theme-text-secondary)/20 rounded-2xl flex items-center justify-center text-(--theme-text-primary) mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Supervision & Pilotage Formateur</h3>
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed max-w-xl">
                Suivi global des classes, taux de rétention, analytics d'engagement et outils de correction automatisés pour piloter des centaines d'élèves sans friction.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-(--theme-text-primary) cursor-pointer group/link">
              Accéder au panel de contrôle <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* STATS IMPACT SECTION */}
      <section id="stats" className="py-20 bg-(--theme-primary)/5 border-y border-(--theme-border) px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-accent)">+94%</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Taux de complétion</span>
          </div> */}
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-text-primary)">20+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Apprenants actifs</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-accent)">4/5</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Satisfaction Cursus</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-text-primary)">3/7</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Disponibilité</span>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative">
        <div className="p-8 sm:p-14 bg-linear-to-br from-(--theme-primary) to-(--theme-primary-hover) text-(--theme-text-inverse) rounded-3xl border border-(--theme-border) relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-(--theme-accent)/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Prêt à transformer <br />votre ingénierie ?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-(--theme-text-secondary) max-w-2xl mx-auto">
            Rejoignez Numerum dev center dès aujourd'hui. Configurez votre espace selon votre profil et commencez à bâtir l'avenir du web.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-(--theme-accent) text-(--theme-text-inverse) font-bold rounded-xl shadow-lg shadow-(--theme-accent)/20 hover:bg-(--theme-accent)/90 transition-all text-sm">
              Créer mon compte d'accès
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-(--theme-text-inverse)/10 border border-(--theme-text-inverse)/20 text-(--theme-text-inverse) font-bold rounded-xl hover:bg-(--theme-text-inverse)/20 transition-all text-sm">
              Contacter le support
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-(--theme-text-secondary) font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-(--theme-accent)" /> Aucun engagement</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-(--theme-accent)" /> SSO & Multi-rôles natif</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-(--theme-accent)" /> Conforme Tailwind v4</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-(--theme-border) py-8 px-6 text-center text-xs text-(--theme-text-secondary) font-medium">
        <p>&copy; 2026 Numerum dev center. Tous droits réservés. Cursus ingénieur logiciel d'élite.</p>
      </footer>

    </div>
  );
}

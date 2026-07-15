"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Sparkles, Code2, GraduationCap, Users,
  CheckCircle2, Menu, X, ChevronRight,
  Handshake, Target, Quote, Rocket
} from 'lucide-react';
import { siReact, siNextdotjs, siNestjs, siTypescript, siMysql, siTailwindcss, siDocker, siGit } from 'simple-icons';
import ThemeToggle from '@/app/components/theme-toggle';

function TechIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current shrink-0">
      <path d={path} />
    </svg>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </div>
  );
}

const TECH_STACK = [
  { name: 'React', icon: siReact },
  { name: 'Next.js', icon: siNextdotjs },
  { name: 'NestJS', icon: siNestjs },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'MySQL', icon: siMysql },
  { name: 'Tailwind CSS', icon: siTailwindcss },
  { name: 'Docker', icon: siDocker },
  { name: 'Git', icon: siGit },
];

const BLOB_SHAPES = [
  { shape: 'blob-1', tint: 'bg-(--theme-accent)/20' },
  { shape: 'blob-2', tint: 'bg-(--theme-primary)/20' },
  { shape: 'blob-3', tint: 'bg-(--theme-accent)/20' },
];

const PROGRAMMES = [
  {
    index: '01',
    title: 'Bootcamp Fondamentaux',
    description: "Bases solides en algorithmique, Git, TypeScript et travail en équipe agile pour démarrer du bon pied.",
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80&fit=crop',
  },
  {
    index: '02',
    title: 'Stage en entreprise',
    description: "Immersion complète dans une équipe de développement partenaire : revue de code, sprints, déploiements réels.",
    image: '/stage_en_entreprise.png',
  },
  {
    index: '03',
    title: 'Spécialisation & Certification',
    description: "Approfondissement sur une stack (frontend, backend, data) et certification reconnue par nos entreprises partenaires.",
    image: '/specialisation.png',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-(--theme-accent) after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen w-full bg-(--theme-page-bg) text-(--theme-text-primary) font-sans antialiased selection:bg-(--theme-accent) selection:text-(--theme-text-inverse) overflow-x-hidden transition-colors duration-300">

      {/* EFFETS DE LUMIÈRE D'ARRIÈRE-PLAN (GLOW EFFECTS) */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-(--theme-primary)/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-150 h-150 bg-(--theme-accent)/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* NAVBAR */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || mobileMenuOpen ? 'bg-(--theme-page-bg)/80 backdrop-blur-md border-b border-(--theme-border)' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-(--theme-accent) flex items-center justify-center text-(--theme-text-inverse) font-black text-base shadow-md shadow-(--theme-accent)/20">
              N
            </div>
            <span className={`text-lg font-black tracking-tight transition-colors duration-500 ${scrolled || mobileMenuOpen ? 'text-(--theme-text-primary)' : 'text-white'}`}>
              Numerum<span className="text-(--theme-accent)">.</span>
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold transition-colors duration-500 ${scrolled ? 'text-(--theme-text-primary)/80' : 'text-white/90'}`}>
            <a href="#bento" className={hoverUnderlineStyle}>Plateforme</a>
            <a href="#programmes" className={hoverUnderlineStyle}>Parcours</a>
            <a href="#stats" className={hoverUnderlineStyle}>Impact</a>
            <a href="#temoignages" className={hoverUnderlineStyle}>Témoignages</a>
          </nav>

          {/* Actions Cta */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle className={!scrolled ? '!text-white' : ''} />

            <button  onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-5 py-2.5 bg-(--theme-primary) text-(--theme-text-inverse) rounded-xl text-sm font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
              Inscription <ChevronRight size={16} />
            </button>
            <button  onClick={() => router.push('/auth/login')} className={`text-sm font-bold transition-colors duration-500 hover:opacity-80 ${scrolled ? 'text-(--theme-text-primary)' : 'text-white'}`}>
              Connexion
            </button>
          </div>

          {/* Bouton Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle className={!scrolled ? '!text-white' : ''} />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 transition-colors duration-500 ${scrolled || mobileMenuOpen ? 'text-(--theme-text-primary)' : 'text-white'}`}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden w-full bg-(--theme-page-bg) border-b border-(--theme-border) p-6 flex flex-col gap-4 animate-fade-in">
            <a href="#bento" className="text-lg font-semibold">Plateforme</a>
            <a href="#programmes" className="text-lg font-semibold">Parcours</a>
            <a href="#stats" className="text-lg font-semibold">Impact</a>
            <a href="#temoignages" className="text-lg font-semibold">Témoignages</a>
            <button onClick={() => router.push('/auth/login')} className="w-full py-3 border border-(--theme-border-strong) rounded-xl font-bold">Connexion</button>
            <button onClick={() => router.push('/auth/register')} className="w-full py-3 bg-(--theme-accent) text-(--theme-text-inverse) rounded-xl font-bold shadow-lg">Rejoindre le centre</button>
          </div>
        )}
      </header>

      {/* HERO SECTION — photo plein écran, sans marge, sous la navbar transparente */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <Image
          src="/aceuil.png"
          alt="Apprenants développeurs travaillant ensemble sur leurs ordinateurs portables"
          fill
          preload
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/15 to-black/55" />

        {/* Badge Flottant, superposé sur la photo sous la navbar */}
        <Reveal className="absolute top-24 sm:top-28 left-6 sm:left-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-(--theme-card-bg)/90 backdrop-blur-sm text-(--theme-accent) rounded-full text-xs font-bold tracking-wide uppercase border border-(--theme-accent)/20 shadow-lg">
            <Sparkles size={12} className="fill-current" /> Formation & stages en entreprise tech
          </div>
        </Reveal>

        {/* Contenu superposé, ancré en bas de la photo */}
        <Reveal delay={120} className="absolute inset-x-0 bottom-0 pb-14 sm:pb-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] max-w-2xl">
              Former des développeurs <span className="text-(--theme-accent)">prêts pour l&apos;entreprise</span>, dès le premier stage.
            </h1>

            <div className="w-full lg:w-auto lg:max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 shadow-xl shrink-0">
              <p className="text-sm text-white/85 leading-relaxed">
                Nos apprenants pratiquent les outils et méthodes utilisés en entreprise&nbsp;: revue de code, CI/CD, travail d&apos;équipe agile.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a href="#programmes" className="flex-1 px-5 py-3 border-2 border-white/30 text-white font-bold rounded-xl text-sm text-center hover:bg-white/10 transition-all">
                  Voir les parcours
                </a>
                <button onClick={() => router.push('/auth/register')} className="flex-1 px-5 py-3 bg-(--theme-accent) text-(--theme-text-inverse) font-bold rounded-xl text-sm shadow-lg shadow-(--theme-accent)/30 hover:bg-(--theme-accent)/90 transition-all flex items-center justify-center gap-2 group">
                  Rejoindre le centre <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STACK TECHNIQUE PRATIQUÉE */}
      <section className="py-14 bg-(--theme-primary)/5 border-y border-(--theme-border)">
        <Reveal className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary) mb-6">
            Les technologies pratiquées dès le premier stage
          </p>
        </Reveal>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex items-center gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
            {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                style={{ '--brand': `#${tech.icon.hex}` } as React.CSSProperties}
                className="flex items-center gap-3 px-5 py-3 rounded-full border border-(--theme-border) bg-(--theme-card-bg) shrink-0 shadow-sm text-[var(--brand)] hover:text-(--theme-text-primary)/25 transition-colors duration-300"
              >
                <TechIcon path={tech.icon.path} />
                <span className="text-[11px] font-semibold text-(--theme-text-secondary)/80 tracking-wide whitespace-nowrap">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À PROPOS + PARCOURS */}
      <section id="programmes" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Colonne À propos */}
          <Reveal className="flex flex-col h-full">
            <span className="inline-block px-3 py-1 bg-(--theme-accent)/10 text-(--theme-accent) rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-(--theme-accent)/20 self-start">
              À propos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-(--theme-text-primary)">
              Un centre de formation pensé comme une vraie entreprise tech.
            </h2>
            <p className="mt-6 text-sm sm:text-base text-(--theme-text-secondary) leading-relaxed max-w-lg">
              Nous combinons un socle technique exigeant et une mise en situation réelle&nbsp;: nos apprenants livrent du code en production, collaborent avec des formateurs issus de l&apos;industrie et rejoignent des entreprises partenaires en stage dès qu&apos;ils sont prêts.
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-(--theme-accent)/10 text-(--theme-accent) flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
                <span className="text-xs font-bold text-(--theme-text-primary) max-w-[7rem] leading-snug">Cursus certifiant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-(--theme-primary)/10 text-(--theme-primary) flex items-center justify-center shrink-0">
                  <Handshake size={20} />
                </div>
                <span className="text-xs font-bold text-(--theme-text-primary) max-w-[7rem] leading-snug">Stage garanti</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-(--theme-accent)/10 text-(--theme-accent) flex items-center justify-center shrink-0">
                  <Target size={20} />
                </div>
                <span className="text-xs font-bold text-(--theme-text-primary) max-w-[7rem] leading-snug">Suivi individuel</span>
              </div>
            </div>

            {/* Carte de mise en avant, comble l'espace sous le texte */}
            <div className="mt-10 flex-1 flex items-center gap-5 p-6 rounded-2xl border border-(--theme-border) bg-(--theme-card-bg) shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center shrink-0">
                <Rocket size={22} />
              </div>
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed">
                <span className="font-black text-(--theme-text-primary)">Entreprises partenaires</span> prêtes à accueillir nos apprenants dès la fin du bootcamp, dans toute la France.
              </p>
            </div>
          </Reveal>

          {/* Colonne Parcours numérotés */}
          <Reveal delay={150} className="flex flex-col gap-10 h-full">
            {PROGRAMMES.map((p, i) => {
              const blob = BLOB_SHAPES[i % BLOB_SHAPES.length];
              return (
                <div key={p.index} className="group flex flex-col sm:flex-row sm:items-center gap-6 pb-10 border-b border-(--theme-border) last:border-0 last:pb-0 flex-1">
                  <div className="flex-1 order-2 sm:order-1">
                    <span className="inline-block px-2.5 py-1 bg-(--theme-primary)/10 text-(--theme-primary) rounded-md text-[11px] font-bold tracking-wide mb-3">
                      Parcours {p.index}
                    </span>
                    <h3 className="text-lg font-bold text-(--theme-text-primary)">{p.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-(--theme-text-secondary) leading-relaxed">{p.description}</p>
                  </div>
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 mx-auto sm:mx-0 order-1 sm:order-2">
                    {/* Lueur organique derrière la photo */}
                    <div className={`absolute -inset-3 ${blob.tint} ${blob.shape} blur-lg opacity-70 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className={`relative w-full h-full overflow-hidden ${blob.shape} border-2 border-(--theme-border) shadow-lg`}>
                      <Image src={p.image} alt={p.title} fill sizes="176px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* BENTO GRID SECTION */}
      <section id="bento" className="relative py-20 overflow-hidden">
        {/* Fond photo fixe (effet parallaxe) — position fixed, rognée par le overflow-hidden de la section */}
        <div className="fixed inset-0 -z-20 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=70&fit=crop"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-(--theme-page-bg)/40" />

        <div className="relative max-w-7xl mx-auto px-6">
          <Reveal className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight"><span className={hoverUnderlineStyle}>Une infrastructure, deux piliers</span></h2>
            <p className="text-sm text-(--theme-text-secondary) mt-2">Découvrez l&apos;organisation en bento box de notre écosystème connecté.</p>
          </Reveal>

          <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Bento Box 1: Espace Apprenant */}
          <div className="md:col-span-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-(--theme-primary) transition-all shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-(--theme-primary)/5 blob-1 pointer-events-none transition-all group-hover:scale-110" />
            <div>
              <div className="w-12 h-12 bg-(--theme-primary)/10 rounded-2xl flex items-center justify-center text-(--theme-primary) mb-6">
                <Code2 size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Espace d&apos;Apprentissage Actif</h3>
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed max-w-xl">
                Suivez vos modules Next.js, validez vos acquis sur Tailwind v4 et observez vos KPIs d&apos;apprentissage grimper. Conçu pour le tracking de performance individuel d&apos;élite.
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
            <div className="mt-8 border-t border-(--theme-text-inverse)/20 pt-4 flex items-center justify-between text-xs font-mono text-(--theme-text-inverse)/70">
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
                Intégration d&apos;un tuteur IA pour générer des fiches de révision de code instantanées et analyser les goulots d&apos;étranglement des élèves.
              </p>
            </div>
          </div>

          {/* Bento Box 4: Espace Formateur */}
          <div className="md:col-span-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-(--theme-primary) transition-all shadow-sm">
            <div className="absolute bottom-0 right-0 w-44 h-44 bg-(--theme-accent)/5 blob-3 pointer-events-none transition-all" />
            <div>
              <div className="w-12 h-12 bg-(--theme-text-secondary)/20 rounded-2xl flex items-center justify-center text-(--theme-text-primary) mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Supervision & Pilotage Formateur</h3>
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed max-w-xl">
                Suivi global des classes, taux de rétention, analytics d&apos;engagement et outils de correction automatisés pour piloter des centaines d&apos;élèves sans friction.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-(--theme-text-primary) cursor-pointer group/link">
              Accéder au panel de contrôle <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
            </div>
          </div>

          </Reveal>
        </div>
      </section>

      {/* STATS IMPACT SECTION */}
      <section id="stats" className="py-20 bg-(--theme-primary)/5 border-y border-(--theme-border) px-6">
        <Reveal className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-accent)">+94%</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Taux de complétion</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-text-primary)">1,200+</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Apprenants actifs</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-accent)">5/5</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Satisfaction Cursus</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-4xl sm:text-5xl font-black text-(--theme-text-primary)">48h</span>
            <span className="text-xs font-bold uppercase tracking-widest text-(--theme-text-secondary)">Délai max de Recrutement</span>
          </div>
        </Reveal>
      </section>

      {/* TÉMOIGNAGE */}
      <section id="temoignages" className="py-20 px-6 max-w-5xl mx-auto">
        <Reveal className="bg-(--theme-card-bg) border border-(--theme-border) rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-12 shadow-sm">
          <div className="group relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shrink-0 border-4 border-(--theme-accent)/20">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80&fit=crop"
              alt="Ancienne apprenante du centre, aujourd'hui développeuse fullstack"
              fill
              sizes="144px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div>
            <Quote className="text-(--theme-accent) mb-3" size={28} fill="currentColor" />
            <p className="text-base sm:text-lg font-medium text-(--theme-text-primary) leading-relaxed">
              Mon stage chez notre entreprise partenaire a démarré dès la troisième semaine de bootcamp. Le suivi des formateurs et la pratique en conditions réelles m&apos;ont permis d&apos;être opérationnelle dès le premier jour.
            </p>
            <p className="mt-4 text-sm font-bold text-(--theme-text-secondary)">
              Léa M. <span className="font-normal opacity-70">— ancienne apprenante, aujourd&apos;hui développeuse fullstack</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* FINAL CALL TO ACTION (CTA) */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center relative">
        <Reveal className="p-8 sm:p-14 bg-linear-to-br from-(--theme-primary) to-(--theme-primary-hover) text-(--theme-text-inverse) rounded-3xl border border-(--theme-border) relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-(--theme-accent)/25 blob-2 blur-3xl pointer-events-none -z-10" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-(--theme-text-inverse)/10 blob-1 blur-3xl pointer-events-none -z-10" />

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Prêt à transformer <br />votre ingénierie ?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-(--theme-text-inverse)/80 max-w-2xl mx-auto">
            Rejoignez Numerum dev center dès aujourd&apos;hui. Configurez votre espace selon votre profil et commencez à bâtir l&apos;avenir du web.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => router.push('/auth/register')} className="w-full sm:w-auto px-8 py-3.5 bg-(--theme-accent) text-(--theme-text-inverse) font-bold rounded-xl shadow-lg shadow-(--theme-accent)/20 hover:bg-(--theme-accent)/90 transition-all text-sm">
              Créer mon compte d&apos;accès
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-(--theme-text-inverse)/10 border border-(--theme-text-inverse)/20 text-(--theme-text-inverse) font-bold rounded-xl hover:bg-(--theme-text-inverse)/20 transition-all text-sm">
              Contacter le support
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-(--theme-text-inverse)/10 border border-(--theme-text-inverse)/15 text-xs text-(--theme-text-inverse)/85 font-semibold"><CheckCircle2 size={14} className="text-(--theme-accent)" /> Aucun engagement</span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-(--theme-text-inverse)/10 border border-(--theme-text-inverse)/15 text-xs text-(--theme-text-inverse)/85 font-semibold"><CheckCircle2 size={14} className="text-(--theme-accent)" /> SSO & Multi-rôles natif</span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-(--theme-text-inverse)/10 border border-(--theme-text-inverse)/15 text-xs text-(--theme-text-inverse)/85 font-semibold"><CheckCircle2 size={14} className="text-(--theme-accent)" /> Conforme Tailwind v4</span>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-(--theme-border) py-8 px-6 text-center text-xs text-(--theme-text-secondary) font-medium">
        <p>&copy; 2026 Numerum dev center. Tous droits réservés. Cursus ingénieur logiciel d&apos;élite.</p>
      </footer>

    </div>
  );
}

"use client";

import Link from "next/link";
import { Code2, GraduationCap, ShieldCheck } from "lucide-react";
import ThemeToggle from "@/app/components/theme-toggle";

const VALUE_PROPS = [
  { icon: GraduationCap, text: "Un espace unique pour apprenants et formateurs." },
  { icon: Code2, text: "Suivi de promotions, projets et présences au même endroit." },
  { icon: ShieldCheck, text: "Accès sécurisé par rôle (admin, formateur, apprenant)." },
];

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-(--theme-page-bg) text-(--theme-text-primary) transition-colors duration-300">
      {/* Panneau marketing — visible uniquement à partir des grands écrans */}
      <aside className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-linear-to-br from-(--theme-primary) to-(--theme-primary-hover) text-(--theme-text-inverse)">
        {/* Trame façon plan d'ingénierie, bien marquée */}
        <svg className="absolute inset-0 w-full h-full text-(--theme-text-inverse) opacity-[0.18] pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="auth-blueprint-grid" width="96" height="96" patternUnits="userSpaceOnUse">
              <path d="M 96 0 L 0 0 0 96" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-blueprint-grid)" />
        </svg>

        <div className="absolute top-0 right-0 w-96 h-96 bg-(--theme-accent)/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-(--theme-text-inverse)/10 rounded-full blur-[100px] pointer-events-none" />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-(--theme-accent) flex items-center justify-center font-black text-base">
            N
          </div>
          <span className="text-lg font-black tracking-tight">
            Numerum<span className="text-(--theme-accent)">.</span>
          </span>
        </Link>

        <div className="relative z-10 flex flex-col gap-8 max-w-md">
          <h2 className="text-4xl font-black tracking-tight leading-tight">
            L&apos;ingénierie logicielle propulsée par la production.
          </h2>
          <div className="flex flex-col gap-4">
            {VALUE_PROPS.map(({ icon: Icon, text }, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-(--theme-text-inverse)/10 flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <p className="text-sm text-(--theme-text-inverse)/85">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-(--theme-text-inverse)/60">
          &copy; 2026 Numerum Dev Center. Centre de formation nouvelle génération.
        </p>
      </aside>

      {/* Panneau formulaire */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6">
          <Link
            href="/"
            className="text-sm font-semibold text-(--theme-text-secondary) hover:text-(--theme-text-primary) transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
          <ThemeToggle />
        </header>

        <div className="flex-1 flex items-center justify-center p-6 pb-16">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-(--theme-text-primary)">{title}</h1>
              <p className="text-sm text-(--theme-text-secondary) mt-1">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

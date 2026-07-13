"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, GraduationCap, ClipboardList, Megaphone } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import api from "@/lib/api";

interface ApiUser {
  id: string;
  role: "admin" | "manager" | "student";
}

const UPCOMING = [
  { title: "Annonces", sprint: "S5", description: "Publier des annonces à destination de mes promotions." },
  { title: "Présences", sprint: "S6", description: "Émarger mes séances par QR Code et suivre l'assiduité." },
  { title: "Projets & Évaluations", sprint: "S7", description: "Créer des projets, recevoir et corriger les soumissions." },
];

export default function FormateurDashboard() {
  const user = useAuthStore((state) => state.user);
  const [studentCount, setStudentCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<ApiUser[]>("/users")
      .then((response) => {
        if (!cancelled) {
          setStudentCount(response.data.filter((u) => u.role === "student").length);
        }
      })
      .catch(() => {
        if (!cancelled) setStudentCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">
          Bonjour{user ? ` ${user.firstname}` : ""}
        </h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Votre espace de supervision pédagogique.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-(--theme-text-secondary)">Apprenants sur la plateforme</span>
            <Users size={16} className="text-(--theme-primary)" />
          </div>
          <span className="text-2xl font-bold text-(--theme-text-primary) tracking-tight">
            {studentCount ?? "—"}
          </span>
        </div>
        <Link
          href="/dashboard/manager/promotions"
          className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl flex flex-col gap-2 justify-center hover:border-(--theme-primary) transition-colors"
        >
          <div className="flex items-center gap-2 text-(--theme-text-secondary)">
            <GraduationCap size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Mes promotions</span>
          </div>
          <p className="text-xs text-(--theme-text-secondary)">Voir et gérer mes promotions →</p>
        </Link>
        <div className="p-5 bg-(--theme-card-bg) border border-dashed border-(--theme-border) rounded-2xl flex flex-col gap-2 justify-center">
          <div className="flex items-center gap-2 text-(--theme-text-secondary)">
            <ClipboardList size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Corrections en attente</span>
          </div>
          <p className="text-xs text-(--theme-text-secondary)">À venir — Sprint S7</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-(--theme-text-secondary) mb-3 flex items-center gap-2">
          <Megaphone size={14} /> Prochainement sur la roadmap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING.map((item, idx) => (
            <div key={idx} className="p-5 bg-(--theme-card-bg) border border-dashed border-(--theme-border) rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-(--theme-text-primary)">{item.title}</h3>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                  {item.sprint}
                </span>
              </div>
              <p className="text-xs text-(--theme-text-secondary) leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

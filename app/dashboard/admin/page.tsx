"use client";

import { useEffect, useState } from "react";
import { Users, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import api from "@/lib/api";

interface ApiUser {
  id: string;
  role: "admin" | "manager" | "student";
  isActive: boolean;
}

const UPCOMING = [
  { title: "Annonces", sprint: "S5", description: "Diffusion d'annonces et notifications par email aux promotions." },
  { title: "Présences", sprint: "S6", description: "Émargement par QR Code signé et suivi de présence." },
  { title: "Certificats", sprint: "S9", description: "Génération de certificats PDF avec vérification publique par QR Code." },
  { title: "Rapports RH", sprint: "S10", description: "Tableaux de bord RH et export des indicateurs de formation." },
];

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<ApiUser[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<ApiUser[]>("/users")
      .then((response) => {
        if (!cancelled) setUsers(response.data);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const kpis = [
    {
      title: "Utilisateurs",
      icon: Users,
      value: users ? users.length : "—",
    },
    {
      title: "Formateurs",
      icon: ShieldCheck,
      value: users ? users.filter((u) => u.role === "manager").length : "—",
    },
    {
      title: "Apprenants",
      icon: GraduationCap,
      value: users ? users.filter((u) => u.role === "student").length : "—",
    },
    {
      title: "Comptes actifs",
      icon: UserCheck,
      value: users ? users.filter((u) => u.isActive).length : "—",
    },
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">
          Vue d&apos;ensemble{user ? `, ${user.firstname}` : ""}
        </h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          État de la plateforme Numerum Dev Center.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-(--theme-text-secondary)">{kpi.title}</span>
              <kpi.icon size={16} className="text-(--theme-primary)" />
            </div>
            <span className="text-2xl font-bold text-(--theme-text-primary) tracking-tight">{kpi.value}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-(--theme-text-secondary) mb-3">
          Prochainement sur la roadmap
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

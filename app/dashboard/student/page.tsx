"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, GraduationCap, Calendar, Megaphone, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import api from "@/lib/api";
import type { Promotion } from "@/lib/types/promotion";

const UPCOMING = [
  { title: "Annonces", icon: Megaphone, sprint: "S5", description: "Les annonces de vos formateurs seront diffusées ici." },
  { title: "Présences", icon: Calendar, sprint: "S6", description: "Émargement et historique de présence par QR Code." },
  { title: "Projets", icon: ClipboardList, sprint: "S7", description: "Vos projets et rendus de soumissions." },
];

export default function StudentDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [promotion, setPromotion] = useState<Promotion | null | undefined>(undefined);

  useEffect(() => {
    api
      .get<{ promotion: Promotion | null }>("/mon-espace/ma-promotion")
      .then((response) => setPromotion(response.data.promotion))
      .catch(() => setPromotion(null));
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      <main className="flex-1 flex flex-col p-8 md:overflow-y-auto min-w-0 gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-(--theme-text-primary)">
            Salut{user ? ` ${user.firstname}` : ""}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-(--theme-card-bg) border border-(--theme-border) pl-4 pr-10 py-2 rounded-xl text-sm outline-none focus:border-(--theme-primary) transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-(--theme-text-secondary)" size={16} />
            </div>
            <button className="p-2.5 rounded-xl border border-(--theme-border) bg-(--theme-card-bg) hover:bg-(--theme-surface-muted) relative transition-colors">
              <Bell size={18} className="text-(--theme-text-primary)" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-(--theme-accent) rounded-full" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPCOMING.map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-(--theme-card-bg) border border-dashed border-(--theme-border) flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-(--theme-text-primary)">
                  <item.icon size={18} />
                  <h3 className="text-sm font-bold">{item.title}</h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                  {item.sprint}
                </span>
              </div>
              <p className="text-xs text-(--theme-text-secondary) leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-(--theme-text-primary)">Mon parcours</h2>
          {promotion ? (
            <div className="flex-1 border border-(--theme-border) rounded-xl flex flex-col items-center justify-center gap-3 p-8">
              <GraduationCap size={24} className="text-(--theme-primary)" />
              <p className="text-sm font-semibold text-(--theme-text-primary)">{promotion.name}</p>
              <Link
                href="/dashboard/student/promotion"
                className="text-xs font-semibold text-(--theme-primary) hover:underline"
              >
                Voir ma promotion →
              </Link>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-(--theme-border) rounded-xl flex items-center justify-center p-8 bg-(--theme-surface-muted)/50">
              <p className="text-sm text-(--theme-text-secondary) italic text-center max-w-sm">
                Aucune promotion ne vous est encore affectée. Cet espace affichera votre parcours de formation dès que votre formateur vous aura inscrit à une promotion.
              </p>
            </div>
          )}
        </div>
      </main>

      <aside className="w-full md:w-80 bg-(--theme-card-bg) border-t md:border-t-0 md:border-l border-(--theme-border) p-6 flex flex-col gap-8 md:overflow-y-auto shrink-0">
        <div className="flex flex-col items-center text-center p-6 bg-(--theme-surface-muted) rounded-2xl border border-(--theme-border)">
          <div className="w-20 h-20 rounded-full bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center text-2xl font-bold mb-3">
            {user ? `${user.firstname[0] ?? ""}${user.lastname[0] ?? ""}`.toUpperCase() : "?"}
          </div>
          <h2 className="text-lg font-bold text-(--theme-text-primary)">
            {user ? `${user.firstname} ${user.lastname}` : "..."}
          </h2>
          <p className="text-xs text-(--theme-text-secondary) font-medium mt-0.5">Apprenant</p>
          <button
            onClick={() => router.push("/dashboard/profile")}
            className="mt-4 px-4 py-1.5 text-xs font-semibold border border-(--theme-border-strong) rounded-lg hover:border-(--theme-primary) transition-colors"
          >
            Modifier le profil
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-(--theme-text-primary) tracking-wide uppercase">
            Prochainement
          </h3>
          <p className="text-xs text-(--theme-text-secondary) leading-relaxed">
            Les annonces, présences et échéances de projets apparaîtront ici au fil des prochains sprints (S5-S7).
          </p>
        </div>
      </aside>
    </div>
  );
}

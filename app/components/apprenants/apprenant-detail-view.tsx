"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, GraduationCap, Mail, Phone } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantSummary } from "@/lib/types/user";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ApprenantDetailView({
  basePath,
  promotionsBasePath,
  apprenantId,
}: {
  basePath: string;
  promotionsBasePath: string;
  apprenantId: string;
}) {
  const [apprenant, setApprenant] = useState<ApprenantSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApprenantSummary>(`/users/${apprenantId}`)
      .then((response) => setApprenant(response.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [apprenantId]);

  if (error) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm font-medium text-(--theme-error)">{error}</p>
      </main>
    );
  }

  if (!apprenant) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      </main>
    );
  }

  const initials = `${apprenant.firstname[0] ?? ""}${apprenant.lastname[0] ?? ""}`.toUpperCase();

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-3xl">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux apprenants
      </Link>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center text-xl font-bold shrink-0">
          {initials || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-(--theme-text-primary)">
            {apprenant.firstname} {apprenant.lastname}
          </h1>
          <p className="text-sm text-(--theme-text-secondary)">Apprenant</p>
        </div>
        <span
          className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shrink-0 ${
            apprenant.isActive
              ? "bg-(--theme-primary)/10 text-(--theme-primary)"
              : "bg-(--theme-surface-muted) text-(--theme-text-secondary)"
          }`}
        >
          {apprenant.isActive ? "Actif" : "Inactif"}
        </span>
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">Profil</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-(--theme-text-secondary)">
            <Mail size={15} />
            {apprenant.email}
          </div>
          <div className="flex items-center gap-2 text-(--theme-text-secondary)">
            <Phone size={15} />
            {apprenant.phoneNumber || "—"}
          </div>
        </div>
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">Promotion</h2>
        {apprenant.promotion ? (
          <Link
            href={`${promotionsBasePath}/${apprenant.promotion.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-(--theme-text-primary) hover:text-(--theme-primary) w-fit"
          >
            <GraduationCap size={16} />
            {apprenant.promotion.name}
            {apprenant.promotion.isArchived && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                Archivée
              </span>
            )}
          </Link>
        ) : (
          <p className="text-sm text-(--theme-text-secondary)">Aucune promotion affectée pour le moment.</p>
        )}
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">Historique</h2>
        <div className="flex items-center gap-2 text-sm text-(--theme-text-secondary)">
          <Calendar size={15} />
          Membre depuis le {formatDate(apprenant.createdAt)}
        </div>
        <div className="flex items-center gap-2 text-sm text-(--theme-text-secondary)">
          <GraduationCap size={15} />
          {apprenant.promotion
            ? `Actuellement affecté à ${apprenant.promotion.name}`
            : "Pas encore affecté à une promotion"}
        </div>
      </div>
    </main>
  );
}

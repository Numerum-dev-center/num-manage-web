"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  FolderGit2,
  GraduationCap,
  Plus,
} from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ProjetAvecStats } from "@/lib/types/projet";
import StatutStepper from "./statut-stepper";

function formatDateHeure(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ProjetsManagerView({ basePath }: { basePath: string }) {
  const [projets, setProjets] = useState<ProjetAvecStats[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProjetAvecStats[]>("/admin/projets")
      .then((response) => setProjets(response.data))
      .catch((err) => {
        setProjets([]);
        setError(getErrorMessage(err));
      });
  }, []);

  const enRetardCount = projets?.filter((p) => p.enRetard).length ?? 0;

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--theme-text-primary)">Projets</h1>
          <p className="text-sm text-(--theme-text-secondary) mt-1">
            Suivez l&apos;avancement des projets assignés à vos promotions.
          </p>
        </div>
        <Link
          href={`${basePath}/creer`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors"
        >
          <Plus size={16} />
          Nouveau projet
        </Link>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {enRetardCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-(--theme-error)/10 border border-(--theme-error)/30 text-(--theme-error) text-sm font-semibold">
          <AlertTriangle size={16} />
          {enRetardCount} projet{enRetardCount > 1 ? "s" : ""} avec une échéance dépassée et des rendus manquants
        </div>
      )}

      {projets === null ? (
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      ) : projets.length === 0 ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-12 text-center flex flex-col items-center gap-2">
          <FolderGit2 size={32} className="text-(--theme-text-secondary)" />
          <p className="text-sm font-medium text-(--theme-text-primary)">Aucun projet créé pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projets.map((projet) => (
            <div
              key={projet.id}
              className={`bg-(--theme-card-bg) border rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden ${
                projet.enRetard ? "border-(--theme-error)/40 ring-1 ring-(--theme-error)/20" : "border-(--theme-border)"
              }`}
            >
              {projet.enRetard && <div className="absolute inset-y-0 left-0 w-1.5 bg-(--theme-error)" />}

              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-(--theme-primary)/10 text-(--theme-primary) flex items-center gap-1.5">
                  <GraduationCap size={12} />
                  {projet.promotion?.name ?? "—"}
                </span>
                <span className="text-[10px] font-mono font-semibold text-(--theme-text-secondary) shrink-0">
                  {projet.totalSoumissions}/{projet.totalApprenants} rendus
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-(--theme-text-primary) leading-snug">{projet.titre}</h3>
                <p className="text-xs text-(--theme-text-secondary) line-clamp-2 mt-1.5">{projet.description}</p>
                <p className="text-[11px] text-(--theme-text-secondary) mt-1.5 font-medium">
                  Technos : {projet.technologies}
                </p>
              </div>

              <StatutStepper statut={projet.statut} enRetard={projet.enRetard} />

              <div className="flex items-center justify-between text-xs pt-3 border-t border-(--theme-border) gap-2">
                <span
                  className={`flex items-center gap-1.5 font-semibold ${
                    projet.enRetard ? "text-(--theme-error)" : "text-(--theme-text-secondary)"
                  }`}
                >
                  <Calendar size={13} />
                  {formatDateHeure(projet.dateLimite)}
                </span>
                <Link
                  href={`${basePath}/${projet.id}/soumissions`}
                  className="flex items-center gap-1.5 font-semibold text-(--theme-primary) hover:opacity-80"
                >
                  <ClipboardCheck size={13} />
                  Voir les soumissions
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

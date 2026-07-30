"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, Calendar, FolderGit2, Upload, User } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ProjetPourApprenant } from "@/lib/types/projet";
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

export default function ProjetsStudentView() {
  const [projets, setProjets] = useState<ProjetPourApprenant[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProjetPourApprenant[]>("/projets")
      .then((response) => setProjets(response.data))
      .catch((err) => {
        setProjets([]);
        setError(getErrorMessage(err));
      });
  }, []);

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Mes projets</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Les travaux pratiques assignés à votre promotion et le suivi de vos rendus.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {projets === null ? (
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      ) : projets.length === 0 ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-12 text-center flex flex-col items-center gap-2">
          <FolderGit2 size={32} className="text-(--theme-text-secondary)" />
          <p className="text-sm font-medium text-(--theme-text-primary)">
            Aucun projet assigné pour le moment.
          </p>
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

              <div className="flex items-center justify-between gap-2 text-xs text-(--theme-text-secondary)">
                <span className="flex items-center gap-1.5">
                  <User size={13} />
                  {projet.createdBy ? `${projet.createdBy.firstname} ${projet.createdBy.lastname}` : "Formateur"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-(--theme-text-primary) leading-snug">{projet.titre}</h3>
                <p className="text-xs text-(--theme-text-secondary) line-clamp-2 mt-1.5">{projet.description}</p>
              </div>

              <StatutStepper statut={projet.statut} enRetard={projet.enRetard} />

              {projet.statut === "evalue" && projet.maSoumission?.note != null && (
                <div className="p-3 bg-(--theme-primary)/10 border border-(--theme-primary)/20 rounded-xl flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-(--theme-primary) flex items-center gap-1">
                      <Award size={12} />
                      Note obtenue
                    </span>
                    <span className="text-sm font-black text-(--theme-primary)">
                      {projet.maSoumission.note} / 20
                    </span>
                  </div>
                  {projet.maSoumission.feedback && (
                    <p className="text-[11px] text-(--theme-text-secondary) italic border-t border-(--theme-primary)/10 pt-1.5 mt-0.5">
                      « {projet.maSoumission.feedback} »
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-3 border-t border-(--theme-border) gap-2">
                <span
                  className={`flex items-center gap-1.5 font-semibold ${
                    projet.enRetard ? "text-(--theme-error)" : "text-(--theme-text-secondary)"
                  }`}
                >
                  <Calendar size={13} />
                  {formatDateHeure(projet.dateLimite)}
                </span>

                {projet.statut === "en_cours" ? (
                  <Link
                    href={`/dashboard/student/projets/${projet.id}/soumettre`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) font-semibold hover:bg-(--theme-primary-hover) transition-colors"
                  >
                    <Upload size={13} />
                    {projet.enRetard ? "Soumettre (en retard)" : "Soumettre"}
                  </Link>
                ) : (
                  <Link
                    href={`/dashboard/student/projets/${projet.id}/soumettre`}
                    className="flex items-center gap-1.5 font-semibold text-(--theme-primary) hover:opacity-80"
                  >
                    Voir mon dépôt
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

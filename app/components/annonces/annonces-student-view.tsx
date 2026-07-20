"use client";

import { useEffect, useState } from "react";
import { Calendar, Megaphone, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Annonce } from "@/lib/types/annonce";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isNew(createdAt: string): boolean {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs >= 0 && diffMs < ONE_DAY_MS;
}

function formatDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnoncesStudentView() {
  const [annonces, setAnnonces] = useState<Annonce[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Annonce[]>("/mon-espace/annonces")
      .then((response) => setAnnonces(response.data))
      .catch((err) => {
        setAnnonces([]);
        setError(getErrorMessage(err));
      });
  }, []);

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Annonces</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Les informations partagées par vos formateurs pour votre promotion.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {annonces === null ? (
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      ) : annonces.length === 0 ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-8 text-center">
          <p className="text-sm text-(--theme-text-secondary)">
            Aucune annonce pour le moment. Revenez plus tard.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {annonces.map((annonce) => (
            <article
              key={annonce.id}
              className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-(--theme-text-primary) font-semibold">
                  <Megaphone size={16} className="text-(--theme-accent) shrink-0" />
                  {annonce.title}
                </div>
                {isNew(annonce.createdAt) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-(--theme-accent) text-(--theme-text-inverse) px-2 py-0.5 rounded-full">
                    <Sparkles size={10} /> Nouveau
                  </span>
                )}
              </div>
              <p className="text-sm text-(--theme-text-secondary) whitespace-pre-line">{annonce.content}</p>
              <p className="text-xs text-(--theme-text-secondary) flex items-center gap-1.5 mt-1">
                <Calendar size={12} /> {formatDate(annonce.createdAt)}
                {annonce.createdBy && ` · ${annonce.createdBy.firstname} ${annonce.createdBy.lastname}`}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

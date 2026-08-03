"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Code2, Globe, Loader2, Users } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantAvecPoste, PosteProjet, ProjetAvecStats, Soumission } from "@/lib/types/projet";
import { POSTE_PROJET_LABELS, POSTE_PROJET_OPTIONS } from "@/lib/types/projet";

function formatDateHeure(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function NoterForm({
  soumission,
  onNoted,
}: {
  soumission: Soumission;
  onNoted: (updated: Soumission) => void;
}) {
  const [note, setNote] = useState(soumission.note?.toString() ?? "");
  const [feedback, setFeedback] = useState(soumission.feedback ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsedNote = Number(note);
    if (!note.trim() || Number.isNaN(parsedNote) || parsedNote < 0 || parsedNote > 20) {
      setError("Entrez une note entre 0 et 20");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await api.patch<Soumission>(`/soumissions/${soumission.id}`, {
        note: parsedNote,
        feedback: feedback.trim() || undefined,
      });
      onNoted(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3 pt-3 border-t border-(--theme-border)">
      {error && <p className="text-xs font-medium text-(--theme-error)">{error}</p>}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-(--theme-text-primary) shrink-0">Note / 20</label>
        <input
          type="number"
          min={0}
          max={20}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-20 px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none"
        />
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={2}
        placeholder="Retour à l'apprenant (optionnel)"
        className="w-full px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none resize-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start flex items-center gap-2 px-3.5 py-2 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-xs font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        {soumission.note != null ? "Mettre à jour la note" : "Valider la note"}
      </button>
    </form>
  );
}

export default function ProjetSoumissionsView({
  basePath,
  projetId,
}: {
  basePath: string;
  projetId: string;
}) {
  const [projet, setProjet] = useState<ProjetAvecStats | null>(null);
  const [soumissions, setSoumissions] = useState<Soumission[] | null>(null);
  const [postes, setPostes] = useState<ApprenantAvecPoste[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ProjetAvecStats>(`/admin/projets/${projetId}`)
      .then((response) => setProjet(response.data))
      .catch((err) => setError(getErrorMessage(err)));

    api
      .get<Soumission[]>(`/admin/projets/${projetId}/soumissions`)
      .then((response) => setSoumissions(response.data))
      .catch((err) => {
        setSoumissions([]);
        setError(getErrorMessage(err));
      });

    api
      .get<ApprenantAvecPoste[]>(`/admin/projets/${projetId}/postes`)
      .then((response) => setPostes(response.data))
      .catch(() => setPostes([]));
  }, [projetId]);

  const handleNoted = (updated: Soumission) => {
    setSoumissions((current) =>
      (current ?? []).map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const handlePosteChange = async (apprenantId: string, poste: PosteProjet) => {
    // Optimiste : le badge change tout de suite, on ne bloque pas sur le réseau.
    const previous = postes;
    setPostes((current) =>
      (current ?? []).map((entry) =>
        entry.apprenant.id === apprenantId ? { ...entry, poste } : entry,
      ),
    );
    try {
      await api.patch(`/admin/projets/${projetId}/postes/${apprenantId}`, { poste });
    } catch (err) {
      setPostes(previous);
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux projets
      </Link>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {projet && (
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-(--theme-text-primary)">{projet.titre}</h1>
            {projet.enRetard && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-md bg-(--theme-error) text-white">
                <AlertTriangle size={11} />
                Délai dépassé
              </span>
            )}
          </div>
          <p className="text-sm text-(--theme-text-secondary) mt-1">
            {projet.promotion?.name} · Limite : {formatDateHeure(projet.dateLimite)} · {projet.totalSoumissions}/
            {projet.totalApprenants} rendus, {projet.totalEvaluees} noté(s)
          </p>
        </div>
      )}

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-(--theme-text-primary) flex items-center gap-2">
          <Users size={18} />
          Postes de l&apos;équipe
        </h2>
        {postes === null ? (
          <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
        ) : postes.length === 0 ? (
          <p className="text-sm text-(--theme-text-secondary)">Aucun apprenant dans cette promotion.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {postes.map(({ apprenant, poste }) => (
              <li
                key={apprenant.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-(--theme-surface-muted)"
              >
                <span className="text-sm text-(--theme-text-primary) truncate">
                  {apprenant.firstname} {apprenant.lastname}
                </span>
                <select
                  value={poste ?? ""}
                  onChange={(e) => handlePosteChange(apprenant.id, e.target.value as PosteProjet)}
                  className="shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
                >
                  <option value="" disabled>
                    Non assigné
                  </option>
                  {POSTE_PROJET_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {POSTE_PROJET_LABELS[option]}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>

      {soumissions === null ? (
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      ) : soumissions.length === 0 ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-8 text-center">
          <p className="text-sm text-(--theme-text-secondary)">Aucune soumission reçue pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {soumissions.map((soumission) => (
            <div
              key={soumission.id}
              className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-(--theme-text-primary) truncate">
                    {soumission.apprenant
                      ? `${soumission.apprenant.firstname} ${soumission.apprenant.lastname}`
                      : "Apprenant"}
                  </span>
                  {(() => {
                    const poste = postes?.find((p) => p.apprenant.id === soumission.apprenantId)?.poste;
                    return poste ? (
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                        {POSTE_PROJET_LABELS[poste]}
                      </span>
                    ) : null;
                  })()}
                </span>
                {soumission.note != null && (
                  <span className="shrink-0 text-xs font-black px-2.5 py-1 rounded-md bg-(--theme-primary)/10 text-(--theme-primary)">
                    {soumission.note}/20
                  </span>
                )}
              </div>

              <a
                href={soumission.lienGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-(--theme-text-secondary) hover:text-(--theme-primary) truncate"
              >
                <Code2 size={13} className="shrink-0" />
                {soumission.lienGithub}
              </a>
              <a
                href={soumission.lienDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-(--theme-text-secondary) hover:text-(--theme-primary) truncate"
              >
                <Globe size={13} className="shrink-0" />
                {soumission.lienDemo}
              </a>

              {soumission.commentaire && (
                <p className="text-xs text-(--theme-text-secondary) italic mt-1">« {soumission.commentaire} »</p>
              )}

              <NoterForm soumission={soumission} onNoted={handleNoted} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

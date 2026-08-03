"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Award, Loader2, Send, Users } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { PosteProjet, ProjetPourApprenant, Soumission } from "@/lib/types/projet";
import { POSTE_PROJET_LABELS, POSTE_PROJET_OPTIONS } from "@/lib/types/projet";

const soumissionSchema = z.object({
  lienGithub: z.string().url("Lien GitHub invalide").includes("github.com", {
    message: "Le lien doit pointer vers un dépôt GitHub",
  }),
  lienDemo: z.string().url("Lien de démo invalide"),
  commentaire: z.string().optional(),
});

type SoumissionFormData = z.infer<typeof soumissionSchema>;

function formatDateHeure(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ProjetSoumettreView({ projetId }: { projetId: string }) {
  const router = useRouter();
  const [projet, setProjet] = useState<ProjetPourApprenant | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SoumissionFormData>({
    lienGithub: "",
    lienDemo: "",
    commentaire: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    api
      .get<ProjetPourApprenant>(`/projets/${projetId}/soumettre`)
      .then((response) => {
        setProjet(response.data);
        if (response.data.maSoumission) {
          setFormData({
            lienGithub: response.data.maSoumission.lienGithub,
            lienDemo: response.data.maSoumission.lienDemo,
            commentaire: response.data.maSoumission.commentaire ?? "",
          });
        }
      })
      .catch((err) => setLoadError(getErrorMessage(err)));
  }, [projetId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = soumissionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        lienGithub: fieldErrors.lienGithub?.[0],
        lienDemo: fieldErrors.lienDemo?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<Soumission>(`/projets/${projetId}/soumettre`, {
        lienGithub: result.data.lienGithub,
        lienDemo: result.data.lienDemo,
        commentaire: result.data.commentaire || undefined,
      });
      setJustSubmitted(true);
      setProjet((current) =>
        current ? { ...current, statut: "soumis", maSoumission: response.data } : current,
      );
      setTimeout(() => router.push("/dashboard/student/projets"), 2000);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePosteChange = async (poste: PosteProjet) => {
    // Optimiste : le poste change tout de suite dans l'UI, sans attendre le réseau.
    const previous = projet;
    setProjet((current) => (current ? { ...current, maPoste: poste } : current));
    try {
      await api.patch(`/projets/${projetId}/poste`, { poste });
    } catch (err) {
      setProjet(previous);
      setMessage(getErrorMessage(err));
    }
  };

  if (loadError) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm font-medium text-(--theme-error)">{loadError}</p>
      </main>
    );
  }

  const dejaEvalue = projet?.statut === "evalue";

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <Link
        href="/dashboard/student/projets"
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour à mes projets
      </Link>

      {projet && (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-2">
          <h1 className="text-xl font-bold text-(--theme-text-primary)">{projet.titre}</h1>
          <p className="text-sm text-(--theme-text-secondary) whitespace-pre-line">{projet.description}</p>
          <p className="text-xs text-(--theme-text-secondary) mt-1">Technologies : {projet.technologies}</p>
          <p
            className={`text-xs font-semibold mt-1 ${
              projet.enRetard ? "text-(--theme-error)" : "text-(--theme-text-secondary)"
            }`}
          >
            Date limite : {formatDateHeure(projet.dateLimite)}
          </p>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-(--theme-border)">
            <Users size={14} className="text-(--theme-text-secondary) shrink-0" />
            <label className="text-xs font-semibold text-(--theme-text-primary) shrink-0">
              Mon poste sur ce projet
            </label>
            <select
              value={projet.maPoste ?? ""}
              onChange={(e) => handlePosteChange(e.target.value as PosteProjet)}
              disabled={dejaEvalue}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none disabled:opacity-70"
            >
              <option value="" disabled>
                Non choisi
              </option>
              {POSTE_PROJET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {POSTE_PROJET_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {projet?.enRetard && projet.statut === "en_cours" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-(--theme-error)/10 border border-(--theme-error)/30 text-(--theme-error) text-sm font-semibold">
          <AlertTriangle size={16} />
          La date limite est dépassée : votre dépôt sera enregistré en retard.
        </div>
      )}

      {dejaEvalue && projet?.maSoumission ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-primary)/30 rounded-2xl p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-(--theme-primary) font-bold">
            <Award size={18} />
            Projet évalué : {projet.maSoumission.note} / 20
          </div>
          {projet.maSoumission.feedback && (
            <p className="text-sm text-(--theme-text-secondary) italic">« {projet.maSoumission.feedback} »</p>
          )}
          <div className="text-xs text-(--theme-text-secondary) flex flex-col gap-1 pt-2 border-t border-(--theme-border)">
            <span>Dépôt GitHub : {projet.maSoumission.lienGithub}</span>
            <span>Démo : {projet.maSoumission.lienDemo}</span>
          </div>
        </div>
      ) : justSubmitted ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-primary)/30 rounded-2xl p-8 text-center flex flex-col items-center gap-2">
          <Award size={32} className="text-(--theme-primary)" />
          <p className="text-sm font-bold text-(--theme-text-primary)">Travail transmis avec succès !</p>
          <p className="text-xs text-(--theme-text-secondary)">Redirection vers vos projets...</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 border-b border-(--theme-border) pb-3">
            <Send size={18} className="text-(--theme-primary)" />
            <h2 className="text-sm font-bold text-(--theme-text-primary)">
              {projet?.maSoumission ? "Modifier mon dépôt" : "Soumettre mon travail"}
            </h2>
          </div>

          {message && <p className="text-sm font-medium text-(--theme-error)">{message}</p>}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Lien du dépôt GitHub</label>
            <input
              type="url"
              name="lienGithub"
              value={formData.lienGithub}
              onChange={handleChange}
              placeholder="https://github.com/votre-compte/votre-projet"
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.lienGithub ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.lienGithub && <p className="text-xs text-(--theme-error)">{errors.lienGithub}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Lien de la démo en ligne</label>
            <input
              type="url"
              name="lienDemo"
              value={formData.lienDemo}
              onChange={handleChange}
              placeholder="https://votre-projet.vercel.app"
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.lienDemo ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.lienDemo && <p className="text-xs text-(--theme-error)">{errors.lienDemo}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">
              Commentaire pour le formateur (optionnel)
            </label>
            <textarea
              name="commentaire"
              value={formData.commentaire}
              onChange={handleChange}
              rows={3}
              placeholder="Fonctionnalités bonus, difficultés rencontrées..."
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting
              ? "Envoi..."
              : projet?.maSoumission
                ? "Mettre à jour mon dépôt"
                : "Envoyer mon devoir"}
          </button>
        </form>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Projet, PromotionOption } from "@/lib/types/projet";

const createProjetSchema = z.object({
  titre: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(1, "La description est obligatoire"),
  technologies: z.string().min(1, "Précisez au moins une technologie"),
  dateLimite: z.string().min(1, "La date limite est obligatoire"),
  promotionId: z.string().min(1, "Sélectionnez une promotion"),
});

type CreateProjetFormData = z.infer<typeof createProjetSchema>;

export default function ProjetCreateView({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [promotions, setPromotions] = useState<PromotionOption[] | null>(null);
  const [formData, setFormData] = useState<CreateProjetFormData>({
    titre: "",
    description: "",
    technologies: "",
    dateLimite: "",
    promotionId: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ promotions: PromotionOption[] }>("/admin/projets/creer")
      .then((response) => setPromotions(response.data.promotions))
      .catch(() => setPromotions([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = createProjetSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        titre: fieldErrors.titre?.[0],
        description: fieldErrors.description?.[0],
        technologies: fieldErrors.technologies?.[0],
        dateLimite: fieldErrors.dateLimite?.[0],
        promotionId: fieldErrors.promotionId?.[0],
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<Projet>("/admin/projets", result.data);
      router.push(`${basePath}/${response.data.id}/soumissions`);
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-2xl">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux projets
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Nouveau projet</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Assignez un projet pratique à une promotion, avec une date limite de rendu.
        </p>
      </div>

      {message && <p className="text-sm font-medium text-(--theme-error)">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Titre du projet</label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Ex : API RESTful pour la gestion des stocks"
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
              errors.titre ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.titre && <p className="text-xs text-(--theme-error)">{errors.titre}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Description &amp; consignes</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Objectifs, livrables attendus, contraintes..."
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none resize-none ${
              errors.description ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.description && <p className="text-xs text-(--theme-error)">{errors.description}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Technologies</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            placeholder="Ex : Node.js, Express, MySQL"
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
              errors.technologies ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.technologies && <p className="text-xs text-(--theme-error)">{errors.technologies}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Date et heure limite</label>
            <input
              type="datetime-local"
              name="dateLimite"
              value={formData.dateLimite}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.dateLimite ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.dateLimite && <p className="text-xs text-(--theme-error)">{errors.dateLimite}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Promotion ciblée</label>
            <select
              name="promotionId"
              value={formData.promotionId}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.promotionId ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            >
              <option value="">Sélectionner une promotion</option>
              {promotions?.map((promotion) => (
                <option key={promotion.id} value={promotion.id}>
                  {promotion.name}
                </option>
              ))}
            </select>
            {errors.promotionId && <p className="text-xs text-(--theme-error)">{errors.promotionId}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Création..." : "Publier le projet"}
        </button>
      </form>
    </main>
  );
}

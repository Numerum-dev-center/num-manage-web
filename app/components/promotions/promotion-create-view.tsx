"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantSummary } from "@/lib/types/user";
import type { Promotion } from "@/lib/types/promotion";

const createPromotionSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    formateurId: z.string().optional(),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["endDate"],
  });

type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;

export default function PromotionCreateView({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [formateurs, setFormateurs] = useState<ApprenantSummary[] | null>(null);
  const [formData, setFormData] = useState<CreatePromotionFormData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    formateurId: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<ApprenantSummary[]>("/users")
      .then((response) => setFormateurs(response.data.filter((u) => u.role === "manager")))
      .catch(() => setFormateurs([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = createPromotionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        endDate: fieldErrors.endDate?.[0],
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: result.data.name,
        description: result.data.description || undefined,
        startDate: result.data.startDate || undefined,
        endDate: result.data.endDate || undefined,
        formateurId: result.data.formateurId || undefined,
      };
      await api.post<Promotion>("/promotions", payload);
      router.push(basePath);
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux promotions
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Nouvelle promotion</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Renseignez les informations de la promotion et assignez-lui un formateur.
        </p>
      </div>

      {message && <p className="text-sm font-medium text-(--theme-error)">{message.text}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
              errors.name ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.name && <p className="text-xs text-(--theme-error)">{errors.name}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Date de début</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Date de fin</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.endDate ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.endDate && <p className="text-xs text-(--theme-error)">{errors.endDate}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Formateur</label>
          <select
            name="formateurId"
            value={formData.formateurId}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
          >
            <option value="">Aucun formateur assigné</option>
            {formateurs?.map((formateur) => (
              <option key={formateur.id} value={formateur.id}>
                {formateur.firstname} {formateur.lastname} ({formateur.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Création..." : "Créer la promotion"}
        </button>
      </form>
    </main>
  );
}

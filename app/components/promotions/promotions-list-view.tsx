"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archive, GraduationCap, Loader2, Plus, Users } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Promotion } from "@/lib/types/promotion";

const createPromotionSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
});
type CreatePromotionFormData = z.infer<typeof createPromotionSchema>;

export default function PromotionsListView({ basePath }: { basePath: string }) {
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState<CreatePromotionFormData>({ name: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadPromotions = () => {
    api
      .get<Promotion[]>("/promotions", { params: { includeArchived: true } })
      .then((response) => setPromotions(response.data))
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = createPromotionSchema.safeParse(formData);
    if (!result.success) {
      setErrors({ name: result.error.flatten().fieldErrors.name?.[0] });
      return;
    }
    setIsCreating(true);
    try {
      await api.post("/promotions", result.data);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      setMessage({ type: "success", text: "Promotion créée avec succès" });
      loadPromotions();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsCreating(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/promotions/${id}/archive`);
      loadPromotions();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--theme-text-primary)">Promotions</h1>
          <p className="text-sm text-(--theme-text-secondary) mt-1">
            Gérez vos promotions et affectez-y des apprenants.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors"
        >
          <Plus size={16} />
          Nouvelle promotion
        </button>
      </div>

      {message && (
        <p
          className={`text-sm font-medium ${
            message.type === "success" ? "text-(--theme-primary)" : "text-(--theme-error)"
          }`}
        >
          {message.text}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
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
          <button
            type="submit"
            disabled={isCreating}
            className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
          >
            {isCreating && <Loader2 size={16} className="animate-spin" />}
            {isCreating ? "Création..." : "Créer la promotion"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions === null && <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>}
        {promotions?.length === 0 && (
          <p className="text-sm text-(--theme-text-secondary)">Aucune promotion pour le moment.</p>
        )}
        {promotions?.map((promotion) => (
          <Link
            key={promotion.id}
            href={`${basePath}/${promotion.id}`}
            className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex flex-col gap-3 hover:border-(--theme-primary) transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-(--theme-text-primary)">
                <GraduationCap size={18} />
                <h3 className="text-sm font-bold">{promotion.name}</h3>
              </div>
              {promotion.isArchived && (
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                  Archivée
                </span>
              )}
            </div>
            {promotion.description && (
              <p className="text-xs text-(--theme-text-secondary) leading-relaxed">{promotion.description}</p>
            )}
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="flex items-center gap-1.5 text-xs text-(--theme-text-secondary)">
                <Users size={14} />
                {promotion.apprenants?.length ?? 0} apprenant(s)
              </span>
              {!promotion.isArchived && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleArchive(promotion.id);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) hover:text-(--theme-error) transition-colors"
                >
                  <Archive size={14} />
                  Archiver
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

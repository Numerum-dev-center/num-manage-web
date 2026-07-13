"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Archive, Loader2, UserMinus, UserPlus } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Promotion } from "@/lib/types/promotion";
import type { ApprenantSummary } from "@/lib/types/user";

const updatePromotionSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
});
type UpdatePromotionFormData = z.infer<typeof updatePromotionSchema>;

export default function PromotionDetailView({
  basePath,
  promotionId,
}: {
  basePath: string;
  promotionId: string;
}) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [allApprenants, setAllApprenants] = useState<ApprenantSummary[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<UpdatePromotionFormData>({ name: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const loadPromotion = () => {
    api
      .get<Promotion>(`/promotions/${promotionId}`)
      .then((response) => {
        setPromotion(response.data);
        setFormData({ name: response.data.name, description: response.data.description ?? "" });
      })
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  useEffect(() => {
    loadPromotion();
    api
      .get<ApprenantSummary[]>("/users")
      .then((response) => setAllApprenants(response.data.filter((u) => u.role === "student")))
      .catch(() => setAllApprenants([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = updatePromotionSchema.safeParse(formData);
    if (!result.success) {
      setErrors({ name: result.error.flatten().fieldErrors.name?.[0] });
      return;
    }
    setIsSaving(true);
    try {
      await api.patch(`/promotions/${promotionId}`, result.data);
      setMessage({ type: "success", text: "Promotion mise à jour" });
      loadPromotion();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    try {
      await api.patch(`/promotions/${promotionId}/archive`);
      loadPromotion();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  const handleRemoveApprenant = async (userId: string) => {
    try {
      await api.delete(`/promotions/${promotionId}/apprenants/${userId}`);
      loadPromotion();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  const toggleSelected = (userId: string) => {
    setSelectedIds((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) return;
    setIsAssigning(true);
    setMessage(null);
    try {
      await api.patch(`/promotions/${promotionId}/apprenants`, { apprenantIds: selectedIds });
      setSelectedIds([]);
      setMessage({ type: "success", text: "Apprenants affectés avec succès" });
      loadPromotion();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!promotion) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      </main>
    );
  }

  const assignedIds = new Set(promotion.apprenants?.map((a) => a.id));
  const availableApprenants = (allApprenants ?? []).filter((a) => !assignedIds.has(a.id));

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-4xl">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux promotions
      </Link>

      {message && (
        <p
          className={`text-sm font-medium ${
            message.type === "success" ? "text-(--theme-primary)" : "text-(--theme-error)"
          }`}
        >
          {message.text}
        </p>
      )}

      <form
        onSubmit={handleSave}
        className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-(--theme-text-primary)">Détails de la promotion</h1>
          {promotion.isArchived ? (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
              Archivée
            </span>
          ) : (
            <button
              type="button"
              onClick={handleArchive}
              className="flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) hover:text-(--theme-error) transition-colors"
            >
              <Archive size={14} />
              Archiver
            </button>
          )}
        </div>
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
          disabled={isSaving}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">
          Apprenants ({promotion.apprenants?.length ?? 0})
        </h2>
        {(promotion.apprenants?.length ?? 0) === 0 ? (
          <p className="text-sm text-(--theme-text-secondary)">Aucun apprenant affecté pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {promotion.apprenants!.map((apprenant) => (
              <li
                key={apprenant.id}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-(--theme-surface-muted)"
              >
                <span className="text-sm text-(--theme-text-primary)">
                  {apprenant.firstname} {apprenant.lastname}
                  <span className="text-(--theme-text-secondary)"> · {apprenant.email}</span>
                </span>
                {!promotion.isArchived && (
                  <button
                    type="button"
                    onClick={() => handleRemoveApprenant(apprenant.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) hover:text-(--theme-error) transition-colors"
                  >
                    <UserMinus size={14} />
                    Retirer
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!promotion.isArchived && (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-(--theme-text-primary)">Affecter des apprenants</h2>
          {availableApprenants.length === 0 ? (
            <p className="text-sm text-(--theme-text-secondary)">
              Aucun apprenant disponible (déjà affectés ailleurs ou aucun apprenant sur la plateforme).
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {availableApprenants.map((apprenant) => (
                  <li key={apprenant.id}>
                    <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-(--theme-surface-muted) cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(apprenant.id)}
                        onChange={() => toggleSelected(apprenant.id)}
                      />
                      <span className="text-sm text-(--theme-text-primary)">
                        {apprenant.firstname} {apprenant.lastname}
                        <span className="text-(--theme-text-secondary)"> · {apprenant.email}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleAssign}
                disabled={isAssigning || selectedIds.length === 0}
                className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
              >
                {isAssigning ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {isAssigning ? "Affectation..." : `Affecter (${selectedIds.length})`}
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}

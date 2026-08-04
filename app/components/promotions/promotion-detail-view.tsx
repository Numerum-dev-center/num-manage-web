"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Archive, ArchiveRestore, Loader2, UserMinus, UserPlus } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Promotion } from "@/lib/types/promotion";
import type { ApprenantSummary } from "@/lib/types/user";

const updatePromotionSchema = z
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
  const [formateurs, setFormateurs] = useState<ApprenantSummary[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAddApprenant, setShowAddApprenant] = useState(false);
  const [formData, setFormData] = useState<UpdatePromotionFormData>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    formateurId: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadPromotion = () => {
    api
      .get<Promotion>(`/promotions/${promotionId}`)
      .then((response) => {
        setPromotion(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description ?? "",
          startDate: response.data.startDate?.slice(0, 10) ?? "",
          endDate: response.data.endDate?.slice(0, 10) ?? "",
          formateurId: response.data.formateur?.id ?? "",
        });
      })
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  useEffect(() => {
    loadPromotion();
    api
      .get<ApprenantSummary[]>("/users")
      .then((response) => {
        setAllApprenants(response.data.filter((u) => u.role === "student"));
        setFormateurs(response.data.filter((u) => u.role === "manager"));
      })
      .catch(() => {
        setAllApprenants([]);
        setFormateurs([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = updatePromotionSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0], endDate: fieldErrors.endDate?.[0] });
      return;
    }
    setIsSaving(true);
    try {
      await api.patch(`/promotions/${promotionId}`, {
        name: result.data.name,
        description: result.data.description || undefined,
        startDate: result.data.startDate || undefined,
        endDate: result.data.endDate || undefined,
        // `null` explicite (et non `undefined`) pour bien vider le formateur
        // en base quand "Aucun formateur assigné" est sélectionné.
        formateurId: result.data.formateurId || null,
      });
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

  const handleUnarchive = async () => {
    try {
      await api.patch(`/promotions/${promotionId}/unarchive`);
      loadPromotion();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  const handleRemoveApprenant = async (userId: string) => {
    // Retrait optimiste : on met à jour la liste immédiatement pour ne pas
    // bloquer le clic sur un autre apprenant pendant l'appel réseau ; on
    // remet l'apprenant en cas d'échec.
    const previous = promotion;
    setPromotion((current) =>
      current && current.apprenants
        ? { ...current, apprenants: current.apprenants.filter((a) => a.id !== userId) }
        : current
    );
    try {
      await api.delete(`/promotions/${promotionId}/apprenants/${userId}`);
    } catch (err) {
      setPromotion(previous);
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
    // Affectation optimiste : la liste et le panneau se mettent à jour tout
    // de suite, sans attendre la réponse réseau ; on revient en arrière en
    // cas d'échec.
    const idsToAssign = selectedIds;
    const previous = promotion;
    const newlyAssigned = (allApprenants ?? []).filter((a) => idsToAssign.includes(a.id));
    setPromotion((current) =>
      current ? { ...current, apprenants: [...(current.apprenants ?? []), ...newlyAssigned] } : current
    );
    setSelectedIds([]);
    setShowAddApprenant(false);
    setMessage(null);
    try {
      await api.patch(`/promotions/${promotionId}/apprenants`, { apprenantIds: idsToAssign });
      setMessage({ type: "success", text: "Apprenants affectés avec succès" });
    } catch (err) {
      setPromotion(previous);
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  };

  if (!promotion) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      </main>
    );
  }

  // Un apprenant n'appartient qu'à une seule promotion : on n'affiche ici que
  // ceux qui n'en ont encore aucune, pour ne jamais en retirer une autre par
  // erreur en le réaffectant silencieusement ici.
  const availableApprenants = (allApprenants ?? []).filter((a) => !a.promotionId);

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-4xl mx-auto w-full">
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
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                Archivée
              </span>
              <button
                type="button"
                onClick={handleUnarchive}
                className="flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) hover:text-(--theme-primary) transition-colors"
              >
                <ArchiveRestore size={14} />
                Réactiver
              </button>
            </div>
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
          disabled={isSaving}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-(--theme-text-primary)">
            Apprenants ({promotion.apprenants?.length ?? 0})
          </h2>
          {!promotion.isArchived && (
            <button
              type="button"
              onClick={() => setShowAddApprenant((current) => !current)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-xs font-semibold hover:bg-(--theme-primary-hover) transition-colors"
            >
              <UserPlus size={14} />
              Ajouter un apprenant
            </button>
          )}
        </div>

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
                  {apprenant.specialite && (
                    <span className="text-(--theme-text-secondary)"> · {apprenant.specialite}</span>
                  )}
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

        {showAddApprenant && !promotion.isArchived && (
          <div className="border-t border-(--theme-border) pt-4 flex flex-col gap-4">
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
                          {apprenant.specialite && (
                            <span className="text-(--theme-text-secondary)"> · {apprenant.specialite}</span>
                          )}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handleAssign}
                  disabled={selectedIds.length === 0}
                  className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
                >
                  <UserPlus size={16} />
                  {`Confirmer (${selectedIds.length})`}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

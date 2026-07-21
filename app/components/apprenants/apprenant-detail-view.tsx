"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, GraduationCap, Loader2, Power, Trash2 } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantSummary } from "@/lib/types/user";

const updateApprenantSchema = z.object({
  firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phoneNumber: z.string().optional(),
  specialite: z.string().optional(),
});

type UpdateApprenantFormData = z.infer<typeof updateApprenantSchema>;

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ApprenantDetailView({
  basePath,
  promotionsBasePath,
  apprenantId,
}: {
  basePath: string;
  promotionsBasePath: string;
  apprenantId: string;
}) {
  const router = useRouter();
  const [apprenant, setApprenant] = useState<ApprenantSummary | null>(null);
  const [formData, setFormData] = useState<UpdateApprenantFormData>({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    specialite: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadApprenant = () => {
    api
      .get<ApprenantSummary>(`/users/${apprenantId}`)
      .then((response) => {
        setApprenant(response.data);
        setFormData({
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber ?? "",
          specialite: response.data.specialite ?? "",
        });
      })
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  useEffect(() => {
    loadApprenant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apprenantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = updateApprenantSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstname: fieldErrors.firstname?.[0],
        lastname: fieldErrors.lastname?.[0],
        email: fieldErrors.email?.[0],
      });
      return;
    }
    setIsSaving(true);
    try {
      await api.patch(`/users/${apprenantId}`, {
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        email: result.data.email,
        phoneNumber: result.data.phoneNumber || undefined,
        specialite: result.data.specialite || undefined,
      });
      setMessage({ type: "success", text: "Apprenant mis à jour" });
      loadApprenant();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setIsToggling(true);
    setMessage(null);
    try {
      await api.patch(`/users/${apprenantId}/toggle-active`);
      loadApprenant();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!apprenant) return;
    if (!confirm(`Supprimer l'apprenant "${apprenant.firstname} ${apprenant.lastname}" ?`)) return;
    setIsDeleting(true);
    setMessage(null);
    try {
      await api.delete(`/users/${apprenantId}`);
      router.push(basePath);
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
      setIsDeleting(false);
    }
  };

  if (!apprenant) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-3xl">
      <Link
        href={basePath}
        className="flex items-center gap-2 text-sm text-(--theme-text-secondary) hover:text-(--theme-text-primary) w-fit"
      >
        <ArrowLeft size={16} />
        Retour aux apprenants
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
          <h1 className="text-xl font-bold text-(--theme-text-primary)">Profil de l&apos;apprenant</h1>
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
              apprenant.isActive
                ? "bg-(--theme-primary)/10 text-(--theme-primary)"
                : "bg-(--theme-surface-muted) text-(--theme-text-secondary)"
            }`}
          >
            {apprenant.isActive ? "Actif" : "Inactif"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Prénom</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.firstname ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.firstname && <p className="text-xs text-(--theme-error)">{errors.firstname}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Nom</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                errors.lastname ? "border-(--theme-error)" : "border-(--theme-border-strong)"
              }`}
            />
            {errors.lastname && <p className="text-xs text-(--theme-error)">{errors.lastname}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
              errors.email ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.email && <p className="text-xs text-(--theme-error)">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Téléphone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Spécialité</label>
            <input
              type="text"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              placeholder="Ex : Développeur Full-Stack"
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isToggling}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--theme-border-strong) text-sm font-semibold text-(--theme-text-primary) hover:bg-(--theme-surface-muted) transition-colors disabled:opacity-70"
          >
            {isToggling ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
            {apprenant.isActive ? "Désactiver" : "Activer"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-(--theme-error)/30 text-sm font-semibold text-(--theme-error) hover:bg-(--theme-error)/10 transition-colors disabled:opacity-70 ml-auto"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Supprimer
          </button>
        </div>
      </form>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">Promotion</h2>
        {apprenant.promotion ? (
          <Link
            href={`${promotionsBasePath}/${apprenant.promotion.id}`}
            className="flex items-center gap-2 text-sm font-semibold text-(--theme-text-primary) hover:text-(--theme-primary) w-fit"
          >
            <GraduationCap size={16} />
            {apprenant.promotion.name}
            {apprenant.promotion.isArchived && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-(--theme-surface-muted) text-(--theme-text-secondary)">
                Archivée
              </span>
            )}
          </Link>
        ) : (
          <p className="text-sm text-(--theme-text-secondary)">
            Aucune promotion affectée pour le moment — rendez-vous sur la fiche d&apos;une promotion pour l&apos;y ajouter.
          </p>
        )}
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-(--theme-text-primary)">Historique</h2>
        <div className="flex items-center gap-2 text-sm text-(--theme-text-secondary)">
          <Calendar size={15} />
          Membre depuis le {formatDate(apprenant.createdAt)}
        </div>
      </div>
    </main>
  );
}

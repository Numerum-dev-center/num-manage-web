"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { z } from "zod";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantSummary } from "@/lib/types/user";

const createApprenantSchema = z.object({
  firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phoneNumber: z.string().optional(),
  specialite: z.string().optional(),
});

type CreateApprenantFormData = z.infer<typeof createApprenantSchema>;

export default function ApprenantCreateView({ basePath }: { basePath: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateApprenantFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phoneNumber: "",
    specialite: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const result = createApprenantSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstname: fieldErrors.firstname?.[0],
        lastname: fieldErrors.lastname?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        firstname: result.data.firstname,
        lastname: result.data.lastname,
        email: result.data.email,
        password: result.data.password,
        phoneNumber: result.data.phoneNumber || undefined,
        specialite: result.data.specialite || undefined,
      };
      const response = await api.post<ApprenantSummary>("/users", payload);
      router.push(`${basePath}/${response.data.id}`);
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
        Retour aux apprenants
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Nouvel apprenant</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Créez un compte apprenant. Vous pourrez l&apos;affecter à une promotion ensuite.
        </p>
      </div>

      {message && <p className="text-sm font-medium text-(--theme-error)">{message.text}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4"
      >
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
              errors.password ? "border-(--theme-error)" : "border-(--theme-border-strong)"
            }`}
          />
          {errors.password && <p className="text-xs text-(--theme-error)">{errors.password}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Téléphone (optionnel)</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Spécialité (optionnel)</label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting ? "Création..." : "Créer l'apprenant"}
        </button>
      </form>
    </main>
  );
}

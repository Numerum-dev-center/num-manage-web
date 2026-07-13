"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Archive, Calendar, GraduationCap, Plus, Users } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Promotion } from "@/lib/types/promotion";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR");
}

export default function PromotionsListView({ basePath }: { basePath: string }) {
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadPromotions = (includeArchived: boolean) => {
    setPromotions(null);
    api
      .get<Promotion[]>("/promotions", { params: { includeArchived } })
      // includeArchived=true renvoie actives + archivées : sur l'onglet "Archivées",
      // on ne garde que celles qui le sont réellement.
      .then((response) => {
        setPromotions(includeArchived ? response.data.filter((p) => p.isArchived) : response.data);
      })
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  useEffect(() => {
    loadPromotions(showArchived);
  }, [showArchived]);

  const handleArchive = async (id: string) => {
    try {
      await api.patch(`/promotions/${id}/archive`);
      setMessage({ type: "success", text: "Promotion archivée : elle n'apparaît plus dans la liste active" });
      loadPromotions(showArchived);
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
        <Link
          href={`${basePath}/creer`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors"
        >
          <Plus size={16} />
          Nouvelle promotion
        </Link>
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

      <div className="flex items-center gap-2 border-b border-(--theme-border)">
        <button
          type="button"
          onClick={() => setShowArchived(false)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            !showArchived
              ? "border-(--theme-primary) text-(--theme-text-primary)"
              : "border-transparent text-(--theme-text-secondary) hover:text-(--theme-text-primary)"
          }`}
        >
          Actives
        </button>
        <button
          type="button"
          onClick={() => setShowArchived(true)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
            showArchived
              ? "border-(--theme-primary) text-(--theme-text-primary)"
              : "border-transparent text-(--theme-text-secondary) hover:text-(--theme-text-primary)"
          }`}
        >
          Archivées
        </button>
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-180">
            <thead>
              <tr className="bg-(--theme-surface-muted) text-(--theme-text-secondary) text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 font-semibold">Formateur</th>
                <th className="px-6 py-3 font-semibold">Dates</th>
                <th className="px-6 py-3 font-semibold text-center">Apprenants</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--theme-border)">
              {promotions === null && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-(--theme-text-secondary)">
                    Chargement...
                  </td>
                </tr>
              )}
              {promotions?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-(--theme-text-secondary)">
                    {showArchived ? "Aucune promotion archivée." : "Aucune promotion active pour le moment."}
                  </td>
                </tr>
              )}
              {promotions?.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-(--theme-surface-muted)/60 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`${basePath}/${promotion.id}`}
                      className="flex items-center gap-2 font-semibold text-(--theme-text-primary) hover:text-(--theme-primary)"
                    >
                      <GraduationCap size={16} />
                      {promotion.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-(--theme-text-secondary)">
                    {promotion.formateur ? `${promotion.formateur.firstname} ${promotion.formateur.lastname}` : "—"}
                  </td>
                  <td className="px-6 py-4 text-(--theme-text-secondary)">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Calendar size={13} />
                      {formatDate(promotion.startDate)} → {formatDate(promotion.endDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) bg-(--theme-surface-muted) px-2.5 py-1 rounded-full">
                      <Users size={13} />
                      {promotion.apprenants?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        promotion.isArchived
                          ? "bg-(--theme-surface-muted) text-(--theme-text-secondary)"
                          : "bg-(--theme-primary)/10 text-(--theme-primary)"
                      }`}
                    >
                      {promotion.isArchived ? "Archivée" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!promotion.isArchived && (
                      <button
                        type="button"
                        onClick={() => handleArchive(promotion.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-(--theme-text-secondary) hover:text-(--theme-error) transition-colors"
                      >
                        <Archive size={14} />
                        Archiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

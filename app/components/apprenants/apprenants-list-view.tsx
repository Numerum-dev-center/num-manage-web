"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { ApprenantSummary } from "@/lib/types/user";
import type { Promotion } from "@/lib/types/promotion";

export default function ApprenantsListView({ basePath }: { basePath: string }) {
  const [apprenants, setApprenants] = useState<ApprenantSummary[] | null>(null);
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [promotionFilter, setPromotionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApprenantSummary[]>("/users")
      .then((response) => setApprenants(response.data.filter((u) => u.role === "student")))
      .catch((err) => setError(getErrorMessage(err)));
    api
      .get<Promotion[]>("/promotions", { params: { includeArchived: true } })
      .then((response) => setPromotions(response.data))
      .catch(() => setPromotions([]));
  }, []);

  const filtered = (apprenants ?? []).filter((apprenant) => {
    if (promotionFilter === "none" && apprenant.promotionId) return false;
    if (promotionFilter !== "all" && promotionFilter !== "none" && apprenant.promotionId !== promotionFilter) {
      return false;
    }
    if (statusFilter === "active" && !apprenant.isActive) return false;
    if (statusFilter === "inactive" && apprenant.isActive) return false;
    return true;
  });

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--theme-text-primary)">Apprenants</h1>
          <p className="text-sm text-(--theme-text-secondary) mt-1">
            Retrouvez tous les apprenants et filtrez-les par promotion et par statut.
          </p>
        </div>
        <Link
          href={`${basePath}/creer`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors"
        >
          <Plus size={16} />
          Nouvel apprenant
        </Link>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={promotionFilter}
          onChange={(e) => setPromotionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none"
        >
          <option value="all">Toutes les promotions</option>
          <option value="none">Sans promotion</option>
          {promotions?.map((promotion) => (
            <option key={promotion.id} value={promotion.id}>
              {promotion.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="inactive">Inactif</option>
        </select>
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-160">
            <thead>
              <tr className="bg-(--theme-surface-muted) text-(--theme-text-secondary) text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Nom</th>
                <th className="px-6 py-3 font-semibold">Spécialité</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Promotion</th>
                <th className="px-6 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--theme-border)">
              {apprenants === null && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-(--theme-text-secondary)">
                    Chargement...
                  </td>
                </tr>
              )}
              {apprenants !== null && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-(--theme-text-secondary)">
                    Aucun apprenant ne correspond à ces filtres.
                  </td>
                </tr>
              )}
              {filtered.map((apprenant) => (
                <tr key={apprenant.id} className="hover:bg-(--theme-surface-muted)/60 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`${basePath}/${apprenant.id}`}
                      className="flex items-center gap-2 font-semibold text-(--theme-text-primary) hover:text-(--theme-primary)"
                    >
                      <GraduationCap size={16} />
                      {apprenant.firstname} {apprenant.lastname}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-(--theme-text-secondary)">{apprenant.specialite || "—"}</td>
                  <td className="px-6 py-4 text-(--theme-text-secondary)">{apprenant.email}</td>
                  <td className="px-6 py-4 text-(--theme-text-secondary)">
                    {apprenant.promotion?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        apprenant.isActive
                          ? "bg-(--theme-primary)/10 text-(--theme-primary)"
                          : "bg-(--theme-surface-muted) text-(--theme-text-secondary)"
                      }`}
                    >
                      {apprenant.isActive ? "Actif" : "Inactif"}
                    </span>
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

"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Users } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Promotion } from "@/lib/types/promotion";
import type { ApprenantSummary } from "@/lib/types/user";

interface MaPromotionResponse {
  promotion: Promotion | null;
  camarades: ApprenantSummary[];
}

export default function StudentPromotionPage() {
  const [data, setData] = useState<MaPromotionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<MaPromotionResponse>("/mon-espace/ma-promotion")
      .then((response) => setData(response.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Ma promotion</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Retrouvez votre promotion et vos camarades de formation.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {!data && !error && <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>}

      {data && !data.promotion && (
        <div className="bg-(--theme-card-bg) border border-dashed border-(--theme-border) rounded-2xl flex items-center justify-center p-8">
          <p className="text-sm text-(--theme-text-secondary) italic text-center max-w-sm">
            Aucune promotion ne vous est encore affectée. Cet espace affichera votre parcours de formation dès que
            votre formateur vous aura inscrit à une promotion.
          </p>
        </div>
      )}

      {data?.promotion && (
        <>
          <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-(--theme-text-primary)">
              <GraduationCap size={20} />
              <h2 className="text-lg font-bold">{data.promotion.name}</h2>
            </div>
            {data.promotion.description && (
              <p className="text-sm text-(--theme-text-secondary) leading-relaxed">{data.promotion.description}</p>
            )}
          </div>

          <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-(--theme-text-primary)">
              <Users size={18} />
              Mes camarades ({data.camarades.length})
            </h2>
            {data.camarades.length === 0 ? (
              <p className="text-sm text-(--theme-text-secondary)">
                Vous êtes pour l&apos;instant seul(e) dans cette promotion.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.camarades.map((camarade) => (
                  <li
                    key={camarade.id}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-(--theme-surface-muted)"
                  >
                    <div className="w-9 h-9 rounded-full bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center text-sm font-bold shrink-0">
                      {`${camarade.firstname[0] ?? ""}${camarade.lastname[0] ?? ""}`.toUpperCase()}
                    </div>
                    <span className="text-sm text-(--theme-text-primary) truncate">
                      {camarade.firstname} {camarade.lastname}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Calendar, Loader2, Megaphone, Sparkles } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Annonce } from "@/lib/types/annonce";
import type { Promotion } from "@/lib/types/promotion";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function isNew(createdAt: string): boolean {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs >= 0 && diffMs < ONE_DAY_MS;
}

function formatDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AnnoncesManagerView() {
  const [annonces, setAnnonces] = useState<Annonce[] | null>(null);
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [promotionFilter, setPromotionFilter] = useState("");
  const [selectedPromotionId, setSelectedPromotionId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<Promotion[]>("/promotions?includeArchived=true")
      .then((response) => setPromotions(response.data))
      .catch(() => setPromotions([]));
  }, []);

  useEffect(() => {
    setAnnonces(null);
    api
      .get<Annonce[]>("/annonces", {
        params: promotionFilter ? { promotionId: promotionFilter } : undefined,
      })
      .then((response) => setAnnonces(response.data))
      .catch((err) => {
        setAnnonces([]);
        setMessage({ type: "error", text: getErrorMessage(err) });
      });
  }, [promotionFilter]);

  const loadAnnonces = () => {
    api
      .get<Annonce[]>("/annonces", {
        params: promotionFilter ? { promotionId: promotionFilter } : undefined,
      })
      .then((response) => setAnnonces(response.data))
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!selectedPromotionId) {
      setMessage({ type: "error", text: "Sélectionnez une promotion cible" });
      return;
    }
    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Renseignez un titre et un contenu" });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/annonces", {
        promotionId: selectedPromotionId,
        title: title.trim(),
        content: content.trim(),
      });
      setMessage({ type: "success", text: "Annonce publiée avec succès" });
      setTitle("");
      setContent("");
      loadAnnonces();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Annonces</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Publiez une annonce et ciblez la promotion qui doit la recevoir.
        </p>
      </div>

      {message && (
        <p className={`text-sm font-medium ${message.type === "error" ? "text-(--theme-error)" : "text-(--theme-primary)"}`}>
          {message.text}
        </p>
      )}

      <form
        onSubmit={handlePublish}
        className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 flex flex-col gap-4 max-w-2xl"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Promotion ciblée</label>
          <select
            value={selectedPromotionId}
            onChange={(e) => setSelectedPromotionId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
          >
            <option value="">Sélectionner une promotion</option>
            {promotions?.filter((p) => !p.isArchived).map((promotion) => (
              <option key={promotion.id} value={promotion.id}>
                {promotion.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Changement de salle - Semaine 3"
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Contenu</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Détaillez votre annonce..."
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Megaphone size={16} />}
          {isSubmitting ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-(--theme-text-primary)">Filtrer par promotion</label>
        <select
          value={promotionFilter}
          onChange={(e) => setPromotionFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none"
        >
          <option value="">Toutes les promotions</option>
          {promotions?.map((promotion) => (
            <option key={promotion.id} value={promotion.id}>
              {promotion.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {annonces === null ? (
          <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
        ) : annonces.length === 0 ? (
          <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 text-center">
            <p className="text-sm text-(--theme-text-secondary)">Aucune annonce pour le moment.</p>
          </div>
        ) : (
          annonces.map((annonce) => (
            <article
              key={annonce.id}
              className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-(--theme-text-secondary)">
                    {annonce.promotion?.name ?? "—"}
                  </span>
                  {isNew(annonce.createdAt) && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-(--theme-accent) text-(--theme-text-inverse) px-2 py-0.5 rounded-full">
                      <Sparkles size={10} /> Nouveau
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-xs text-(--theme-text-secondary)">
                  <Calendar size={12} /> {formatDate(annonce.createdAt)}
                </span>
              </div>
              <h2 className="text-base font-bold text-(--theme-text-primary)">{annonce.title}</h2>
              <p className="text-sm text-(--theme-text-secondary) whitespace-pre-line">{annonce.content}</p>
              {annonce.createdBy && (
                <p className="text-xs text-(--theme-text-secondary) mt-1">
                  Publié par {annonce.createdBy.firstname} {annonce.createdBy.lastname}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}

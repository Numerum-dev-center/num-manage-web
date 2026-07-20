"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileArchive, FileText, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Ressource, RessourceType } from "@/lib/types/ressource";
import type { Promotion } from "@/lib/types/promotion";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo
const ALLOWED_EXTENSIONS = [".pdf", ".zip"];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function isLikelyUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RessourcesManagerView() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ressources, setRessources] = useState<Ressource[] | null>(null);
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [promotionFilter, setPromotionFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | RessourceType>("");
  const [selectedPromotionId, setSelectedPromotionId] = useState("");
  const [title, setTitle] = useState("");
  const [depositMode, setDepositMode] = useState<"file" | "lien">("file");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Promotion[]>("/promotions?includeArchived=true")
      .then((response) => setPromotions(response.data))
      .catch(() => setPromotions([]));
  }, []);

  useEffect(() => {
    setRessources(null);
    api
      .get<Ressource[]>("/ressources", {
        params: {
          ...(promotionFilter ? { promotionId: promotionFilter } : {}),
          ...(typeFilter ? { type: typeFilter } : {}),
        },
      })
      .then((response) => setRessources(response.data))
      .catch((err) => {
        setRessources([]);
        setMessage({ type: "error", text: getErrorMessage(err) });
      });
  }, [promotionFilter, typeFilter]);

  const loadRessources = () => {
    api
      .get<Ressource[]>("/ressources", {
        params: {
          ...(promotionFilter ? { promotionId: promotionFilter } : {}),
          ...(typeFilter ? { type: typeFilter } : {}),
        },
      })
      .then((response) => setRessources(response.data))
      .catch((err) => setMessage({ type: "error", text: getErrorMessage(err) }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (!hasAllowedExtension(selected.name)) {
      setFileError("Seuls les fichiers PDF et ZIP sont autorisés");
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFileError("Le fichier dépasse la taille maximale de 10 Mo");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!selectedPromotionId) {
      setMessage({ type: "error", text: "Sélectionnez une promotion cible" });
      return;
    }

    const formData = new FormData();
    formData.append("promotionId", selectedPromotionId);
    if (title.trim()) formData.append("title", title.trim());

    if (depositMode === "file") {
      if (!file) {
        setMessage({ type: "error", text: "Sélectionnez un fichier PDF ou ZIP (10 Mo max)" });
        return;
      }
      formData.append("file", file);
    } else {
      if (!url.trim() || !isLikelyUrl(url.trim())) {
        setUrlError("Saisissez un lien valide (http:// ou https://)");
        return;
      }
      formData.append("url", url.trim());
    }

    setIsSubmitting(true);
    try {
      await api.post("/ressources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Ressource envoyée avec succès" });
      setTitle("");
      setFile(null);
      setUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadRessources();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (ressource: Ressource) => {
    if (ressource.type === "lien") {
      if (ressource.url) window.open(ressource.url, "_blank", "noopener,noreferrer");
      return;
    }
    setDownloadingId(ressource.id);
    try {
      const response = await api.get(`/ressources/${ressource.id}/download`, {
        responseType: "blob",
      });
      const objectUrl = URL.createObjectURL(response.data as Blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = ressource.filename ?? ressource.title;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (ressource: Ressource) => {
    if (!confirm(`Supprimer la ressource "${ressource.title}" ?`)) return;
    setDeletingId(ressource.id);
    try {
      await api.delete(`/ressources/${ressource.id}`);
      loadRessources();
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Ressources pédagogiques</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Téléversez des supports de cours (PDF ou ZIP, 10 Mo max) et ciblez la promotion qui pourra les télécharger.
        </p>
      </div>

      {message && (
        <p className={`text-sm font-medium ${message.type === "error" ? "text-(--theme-error)" : "text-(--theme-primary)"}`}>
          {message.text}
        </p>
      )}

      <form
        onSubmit={handleUpload}
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
          <label className="text-sm font-semibold text-(--theme-text-primary)">Titre (optionnel)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Par défaut : le nom du fichier"
            className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-(--theme-text-primary)">Type de ressource</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDepositMode("file");
                setUrlError(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                depositMode === "file"
                  ? "bg-(--theme-primary) text-(--theme-text-inverse) border-(--theme-primary)"
                  : "bg-(--theme-input-bg) text-(--theme-text-secondary) border-(--theme-border-strong)"
              }`}
            >
              Fichier
            </button>
            <button
              type="button"
              onClick={() => {
                setDepositMode("lien");
                setFileError(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                depositMode === "lien"
                  ? "bg-(--theme-primary) text-(--theme-text-inverse) border-(--theme-primary)"
                  : "bg-(--theme-input-bg) text-(--theme-text-secondary) border-(--theme-border-strong)"
              }`}
            >
              Lien externe
            </button>
          </div>
        </div>

        {depositMode === "file" ? (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Fichier (PDF ou ZIP, 10 Mo max)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.zip"
              onChange={handleFileChange}
              className="w-full text-sm text-(--theme-text-secondary) file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-(--theme-primary) file:text-(--theme-text-inverse) file:font-semibold file:cursor-pointer"
            />
            {fileError && <p className="text-xs text-(--theme-error)">{fileError}</p>}
            {file && !fileError && (
              <p className="text-xs text-(--theme-text-secondary)">
                {file.name} — {formatSize(file.size)}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-(--theme-text-primary)">Lien externe</label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError(null);
              }}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) outline-none"
            />
            {urlError && <p className="text-xs text-(--theme-error)">{urlError}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {isSubmitting ? "Envoi..." : "Envoyer la ressource"}
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

        <label className="text-sm font-semibold text-(--theme-text-primary)">Type</label>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "" | RessourceType)}
          className="px-3 py-2 rounded-lg border border-(--theme-border-strong) bg-(--theme-input-bg) text-(--theme-text-primary) text-sm outline-none"
        >
          <option value="">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="zip">ZIP</option>
          <option value="lien">Lien</option>
        </select>
      </div>

      <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl overflow-hidden">
        {ressources === null ? (
          <p className="p-6 text-sm text-(--theme-text-secondary)">Chargement...</p>
        ) : ressources.length === 0 ? (
          <p className="p-6 text-sm text-(--theme-text-secondary)">Aucune ressource pour le moment.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--theme-border) text-left text-(--theme-text-secondary)">
                <th className="px-6 py-3 font-semibold">Ressource</th>
                <th className="px-6 py-3 font-semibold">Promotion</th>
                <th className="px-6 py-3 font-semibold">Taille</th>
                <th className="px-6 py-3 font-semibold">Envoyée par</th>
                <th className="px-6 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {ressources.map((ressource) => (
                <tr key={ressource.id} className="border-b border-(--theme-border) last:border-0">
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-2 text-(--theme-text-primary) font-medium">
                      {ressource.type === "pdf" ? (
                        <FileText size={16} className="text-(--theme-accent) shrink-0" />
                      ) : ressource.type === "zip" ? (
                        <FileArchive size={16} className="text-(--theme-accent) shrink-0" />
                      ) : (
                        <Link2 size={16} className="text-(--theme-accent) shrink-0" />
                      )}
                      {ressource.title}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-(--theme-text-secondary)">{ressource.promotion?.name ?? "—"}</td>
                  <td className="px-6 py-3 text-(--theme-text-secondary)">
                    {ressource.size !== null ? formatSize(ressource.size) : "—"}
                  </td>
                  <td className="px-6 py-3 text-(--theme-text-secondary)">
                    {ressource.uploadedBy ? `${ressource.uploadedBy.firstname} ${ressource.uploadedBy.lastname}` : "—"}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleDownload(ressource)}
                        disabled={downloadingId === ressource.id}
                        className="flex items-center gap-1.5 text-(--theme-primary) font-semibold hover:opacity-80 disabled:opacity-50"
                      >
                        {downloadingId === ressource.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : ressource.type === "lien" ? (
                          <Link2 size={14} />
                        ) : (
                          <Download size={14} />
                        )}
                        {ressource.type === "lien" ? "Ouvrir" : "Télécharger"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ressource)}
                        disabled={deletingId === ressource.id}
                        className="flex items-center gap-1.5 text-(--theme-error) font-semibold hover:opacity-80 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

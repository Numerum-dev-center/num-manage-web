"use client";

import { useEffect, useState } from "react";
import { Download, FileArchive, FileText, Link2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Ressource } from "@/lib/types/ressource";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function RessourcesStudentView() {
  const [ressources, setRessources] = useState<Ressource[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Ressource[]>("/mon-espace/ressources")
      .then((response) => setRessources(response.data))
      .catch((err) => {
        setRessources([]);
        setError(getErrorMessage(err));
      });
  }, []);

  const handleDownload = async (ressource: Ressource) => {
    if (ressource.type === "lien") {
      if (ressource.url) window.open(ressource.url, "_blank", "noopener,noreferrer");
      return;
    }
    setDownloadingId(ressource.id);
    setError(null);
    try {
      const response = await api.get(`/ressources/${ressource.id}/telecharger`, {
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
      setError(getErrorMessage(err));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">Ressources pédagogiques</h1>
        <p className="text-sm text-(--theme-text-secondary) mt-1">
          Les supports de cours partagés par vos formateurs pour votre promotion.
        </p>
      </div>

      {error && <p className="text-sm font-medium text-(--theme-error)">{error}</p>}

      {ressources === null ? (
        <p className="text-sm text-(--theme-text-secondary)">Chargement...</p>
      ) : ressources.length === 0 ? (
        <div className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-8 text-center">
          <p className="text-sm text-(--theme-text-secondary)">
            Aucune ressource disponible pour le moment. Revenez plus tard, votre formateur n&apos;a pas encore partagé de support.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ressources.map((ressource) => (
            <div
              key={ressource.id}
              className="bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2 text-(--theme-text-primary) font-semibold">
                {ressource.type === "pdf" ? (
                  <FileText size={18} className="text-(--theme-accent) shrink-0" />
                ) : ressource.type === "zip" ? (
                  <FileArchive size={18} className="text-(--theme-accent) shrink-0" />
                ) : (
                  <Link2 size={18} className="text-(--theme-accent) shrink-0" />
                )}
                <span className="truncate">{ressource.title}</span>
              </div>
              <p className="text-xs text-(--theme-text-secondary)">
                {ressource.size !== null ? formatSize(ressource.size) : "Lien externe"}
                {ressource.uploadedBy && ` · ${ressource.uploadedBy.firstname} ${ressource.uploadedBy.lastname}`}
              </p>
              <button
                type="button"
                onClick={() => handleDownload(ressource)}
                disabled={downloadingId === ressource.id}
                className="mt-1 self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-(--theme-primary) text-(--theme-text-inverse) text-sm font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70"
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

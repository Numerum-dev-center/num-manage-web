import { AlertTriangle, Check } from "lucide-react";
import type { StatutProjet } from "@/lib/types/projet";

const ETAPES: { key: StatutProjet; label: string }[] = [
  { key: "non_commence", label: "Non commencé" },
  { key: "en_cours", label: "En cours" },
  { key: "soumis", label: "Soumis" },
  { key: "evalue", label: "Évalué" },
];

const INDEX: Record<StatutProjet, number> = {
  non_commence: 0,
  en_cours: 1,
  soumis: 2,
  evalue: 3,
};

/**
 * Stepper 4 étapes (ticket Lead #382 / Fullstack #396) : Non commencé → En
 * cours → Soumis → Évalué. Le projet existant implique toujours au moins
 * l'étape 1 franchie (cf. StatutProjet dans l'API).
 */
export default function StatutStepper({
  statut,
  enRetard = false,
}: {
  statut: StatutProjet;
  enRetard?: boolean;
}) {
  const currentIndex = INDEX[statut];

  return (
    <div className="flex items-center w-full">
      {ETAPES.map((etape, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const isLate = current && enRetard && statut === "en_cours";

        return (
          <div key={etape.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                  isLate
                    ? "bg-(--theme-error) border-(--theme-error) text-white"
                    : done || current
                      ? "bg-(--theme-primary) border-(--theme-primary) text-(--theme-text-inverse)"
                      : "bg-(--theme-surface-muted) border-(--theme-border-strong) text-(--theme-text-secondary)"
                }`}
              >
                {isLate ? (
                  <AlertTriangle size={12} />
                ) : done ? (
                  <Check size={12} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] font-semibold text-center whitespace-nowrap ${
                  current
                    ? isLate
                      ? "text-(--theme-error)"
                      : "text-(--theme-primary)"
                    : "text-(--theme-text-secondary)"
                }`}
              >
                {isLate ? "En retard" : etape.label}
              </span>
            </div>
            {index < ETAPES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 -mt-4 transition-colors ${
                  index < currentIndex ? "bg-(--theme-primary)" : "bg-(--theme-border-strong)"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

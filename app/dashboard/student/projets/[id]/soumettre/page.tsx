"use client";

import { useParams } from "next/navigation";
import ProjetSoumettreView from "@/app/components/projets/projet-soumettre-view";

export default function StudentProjetSoumettrePage() {
  const params = useParams<{ id: string }>();
  return <ProjetSoumettreView projetId={params.id} />;
}

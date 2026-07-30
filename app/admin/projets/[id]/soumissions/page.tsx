"use client";

import { useParams } from "next/navigation";
import ProjetSoumissionsView from "@/app/components/projets/projet-soumissions-view";

export default function AdminProjetSoumissionsPage() {
  const params = useParams<{ id: string }>();
  return <ProjetSoumissionsView basePath="/admin/projets" projetId={params.id} />;
}

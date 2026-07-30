"use client";

import { useParams } from "next/navigation";
import ProjetSoumissionsView from "@/app/components/projets/projet-soumissions-view";

export default function ManagerProjetSoumissionsPage() {
  const params = useParams<{ id: string }>();
  return <ProjetSoumissionsView basePath="/dashboard/manager/projets" projetId={params.id} />;
}

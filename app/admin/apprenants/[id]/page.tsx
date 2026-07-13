"use client";

import { useParams } from "next/navigation";
import ApprenantDetailView from "@/app/components/apprenants/apprenant-detail-view";

export default function AdminApprenantDetailPage() {
  const params = useParams<{ id: string }>();
  return (
    <ApprenantDetailView
      basePath="/admin/apprenants"
      promotionsBasePath="/admin/promotions"
      apprenantId={params.id}
    />
  );
}

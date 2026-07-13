"use client";

import { useParams } from "next/navigation";
import PromotionDetailView from "@/app/components/promotions/promotion-detail-view";

export default function AdminPromotionDetailPage() {
  const params = useParams<{ id: string }>();
  return <PromotionDetailView basePath="/dashboard/admin/promotions" promotionId={params.id} />;
}

"use client";

import { useParams } from "next/navigation";
import PromotionDetailView from "@/app/components/promotions/promotion-detail-view";

export default function ManagerPromotionDetailPage() {
  const params = useParams<{ id: string }>();
  return <PromotionDetailView basePath="/dashboard/manager/promotions" promotionId={params.id} />;
}

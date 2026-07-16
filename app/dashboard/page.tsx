"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";

const ROLE_HOME: Record<string, string> = {
  admin: "/dashboard/admin",
  manager: "/dashboard/manager",
  student: "/dashboard/student",
};

export default function DashboardIndexPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(ROLE_HOME[user.role] ?? "/auth/login");
    }
  }, [user, router]);

  return null;
}

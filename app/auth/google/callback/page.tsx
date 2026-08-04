"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth.store";
import { getErrorMessage } from "@/lib/get-error-message";

function GoogleCallbackContent() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .post('/auth/refresh')
      .then((refreshResponse) => {
        const { accessToken } = refreshResponse.data;
        localStorage.setItem('accessToken', accessToken);

        return api.get('/auth/me');
      })
      .then((response) => {
        const user = response.data;
        const normalizedUser = {
          ...user,
          role: user.role === 'manager' || user.role === 'admin' || user.role === 'student' ? user.role : 'student',
        };
        setAuth(normalizedUser, localStorage.getItem('accessToken') ?? '');

        switch (normalizedUser.role) {
          case "admin":
            router.replace("/dashboard/admin");
            break;
          case "manager":
            router.replace("/dashboard/manager");
            break;
          case "student":
            router.replace("/dashboard/student");
            break;
          default:
            router.replace("/");
        }
      })
      .catch((err) => {
        localStorage.removeItem("accessToken");
        setError(getErrorMessage(err, "Impossible de récupérer le profil après connexion Google"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-(--theme-page-bg) p-6">
        <div className="max-w-sm w-full text-center flex flex-col gap-4 p-8 rounded-2xl border border-(--theme-border) bg-(--theme-card-bg)">
          <p className="text-sm font-medium text-(--theme-error)">{error}</p>
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-(--theme-accent) hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--theme-page-bg)">
      <div className="flex flex-col items-center gap-3 text-(--theme-text-secondary)">
        <Loader2 size={28} className="animate-spin" />
        <p className="text-sm">Connexion avec Google en cours...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-(--theme-page-bg)">
          <Loader2 size={28} className="animate-spin text-(--theme-text-secondary)" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}

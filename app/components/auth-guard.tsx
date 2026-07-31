'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';

// Sur un chargement complet de page, la réhydratation de Zustand depuis
// localStorage est asynchrone : sans attendre `hasHydrated`, `user` vaudrait
// encore `null` un court instant même pour une session valide, et on
// redirigerait à tort vers /auth/login. `persist.hasHydrated()` / `onFinishHydration`
// sont l'API dédiée de Zustand pour ce cas (cf. doc du middleware persist).
function useHasHydrated() {
  // L'initialisation reste à `false` côté serveur (pas de useState(() => ...) ici :
  // useAuthStore.persist.hasHydrated() touche au storage, indisponible en SSR).
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, []);

  return hasHydrated;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useHasHydrated();
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push('/auth/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  return <>{children}</>;
}

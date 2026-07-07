import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function AttendanceIndex() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isHydrated) return;

    if (!auth.isLoggedIn) {
      router.replace('/login');
      return;
    }

    router.replace(auth.isAdmin ? '/attendance/admin' : '/attendance/member');
  }, [auth.isHydrated, auth.isLoggedIn, auth.isAdmin, router]);

  return null;
}

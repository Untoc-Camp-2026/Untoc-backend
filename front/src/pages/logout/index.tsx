import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function LogoutPage() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    auth.logout();
    router.replace('/');
  }, [auth, router]);

  return null;
}
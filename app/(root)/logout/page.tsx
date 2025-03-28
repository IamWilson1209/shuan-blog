'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Loading from '@/app/loading';

export default function LogoutPage() {
  const router = useRouter();

  /* 暫時導出的介面，作為跳轉用直接useEffect來觸發效果 */
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push('/');
      } catch (error) {
        router.push('/');
      }
    };

    handleLogout();
  }, [router]);

  return <Loading />;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page with modal
    router.push('/?signin=true');
  }, [router]);

  return null;
}
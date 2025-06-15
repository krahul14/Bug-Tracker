'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to tasks page, which will open the create dialog
    router.push('/tasks');
  }, [router]);

  return null;
}
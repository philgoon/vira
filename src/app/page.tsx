
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// [Fix 3] Redirects the root URL to the project matching page.
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the project matching page on mount
    router.push('/project-matching');
  }, [router]);
  
  return <div className="p-4">Redirecting to project matching...</div>;
}

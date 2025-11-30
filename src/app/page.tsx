'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd have a more robust auth check, maybe with a context provider
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'Admin' || userData.role === 'PM') {
        router.replace('/management-dashboard');
      } else if (userData.role === 'Technician') {
        router.replace('/tech-dashboard');
      }
    }
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <Logo className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-headline mb-2">به SiteWise PM خوش آمدید</h1>
            <p className="text-lg text-muted-foreground mb-6">یک اپلیکیشن PWA برای مدیریت PMهای هفتگی سایت‌ها.</p>
            <div className="space-x-4">
                <Link href="/login">
                    <Button>ورود</Button>
                </Link>
            </div>
        </div>
    </main>
  );
}

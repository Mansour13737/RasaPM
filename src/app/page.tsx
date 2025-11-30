'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@/firebase';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      const userRole = (user.customClaims as { role?: string })?.role;
      if (userRole === 'Admin' || userRole === 'PM') {
        router.replace('/management-dashboard');
      } else if (userRole === 'Technician') {
        router.replace('/tech-dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>در حال بارگذاری...</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Logo className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-headline mb-2">
          به SiteWise PM خوش آمدید
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          یک اپلیکیشن PWA برای مدیریت PMهای هفتگی سایت‌ها.
        </p>
        <div className="space-x-4 space-x-reverse">
          <Link href="/login">
            <Button>ورود</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

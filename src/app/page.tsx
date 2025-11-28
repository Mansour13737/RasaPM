"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      if (userRole === 'Admin' || userRole === 'PM') {
        router.replace('/management-dashboard');
      } else if (userRole === 'Technician') {
        router.replace('/tech-dashboard');
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>در حال بارگذاری...</p></div>;
  }

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

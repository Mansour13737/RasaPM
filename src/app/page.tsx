"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { users } from '@/lib/data';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && user.email) {
      const currentUser = users.find(u => u.email === user.email);
      if (currentUser) {
        if (currentUser.role === 'Admin' || currentUser.role === 'PM') {
          router.replace('/management-dashboard');
        } else if (currentUser.role === 'Technician') {
          router.replace('/tech-dashboard');
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p>در حال بارگذاری...</p></div>;
  }

  if (user) {
    const currentUser = users.find(u => u.email === user.email);
    if(currentUser){
        return <div className="flex items-center justify-center min-h-screen"><p>در حال هدایت به داشبورد شما...</p></div>;
    }
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
                <Link href="/signup">
                    <Button variant="secondary">ثبت نام</Button>
                </Link>
            </div>
        </div>
    </main>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Home, LogOut, Settings, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { user } = useUser();
  const auth = useAuth();
  
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/tech-dashboard" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold font-headline">SiteWise PM</span>
            </Link>
            <div className="hidden md:flex items-baseline space-x-4 space-x-reverse">
               <Link href="/tech-dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                 <Home className="w-4 h-4" />
                 داشبورد
               </Link>
               <Link href="/tech-dashboard/sites" className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  سایت‌های من
               </Link>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <UserIcon className="ml-2 h-4 w-4"/>
                    پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="ml-2 h-4 w-4"/>
                    تنظیمات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} asChild>
                   <Link href="/">
                    <LogOut className="ml-2 h-4 w-4"/>
                    خروج
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
    return (
        <footer className="bg-card border-t mt-auto">
            <div className="container mx-auto py-4 px-4 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} SiteWise PM. تمام حقوق محفوظ است.</p>
            </div>
        </footer>
    )
}

export default function TechnicianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user) {
      router.replace('/');
      return;
    }

    user.getIdTokenResult().then((idTokenResult) => {
      const userRole = idTokenResult.claims.role;
      if (userRole === 'Technician') {
        setIsAuthorized(true);
      } else {
        router.replace('/management-dashboard'); 
      }
    });
  }, [user, loading, router]);

  if (loading || !isAuthorized) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <p>در حال بارگذاری و بررسی دسترسی...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 sm:p-6">
            {children}
        </main>
        <Footer />
    </div>
  );
}

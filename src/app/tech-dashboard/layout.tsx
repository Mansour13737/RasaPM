"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Building2, Home, LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";
import { useEffect, useState } from "react";

const getRole = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("userRole");
  }
  return null;
}


const Navbar = () => {
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
                    <AvatarImage src={"https://i.pravatar.cc/150?u=tech"} alt="User Avatar" />
                    <AvatarFallback>{'تک'}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
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
                <DropdownMenuItem onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('userRole');
                  }
                }} asChild>
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

const PageHeader = () => {
    return (
        <header className="relative bg-gray-800 h-48 md:h-64 flex items-center justify-center">
            <Image 
                src="https://picsum.photos/seed/telecom-tech/1920/400"
                alt="تکنسین مخابرات"
                fill
                className="object-cover w-full h-full opacity-30"
                data-ai-hint="telecom technician"
            />
            <div className="relative z-10 text-center text-white p-4">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">داشبورد تکنسین</h1>
                <p className="mt-2 text-lg md:text-xl text-gray-200">برنامه‌ها و وظایف خود را مدیریت کنید</p>
            </div>
        </header>
    )
}

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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userRole = getRole();
    if (userRole !== 'technician') {
      router.push('/');
    }
  }, [router]);
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
        <Navbar />
        <PageHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6">
            {children}
        </main>
        <Footer />
    </div>
  );
}

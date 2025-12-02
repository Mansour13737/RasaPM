'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Home,
  LogOut,
  Settings,
  User as UserIcon,
  MessageSquarePlus,
  Calendar,
  Menu,
} from 'lucide-react';
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
import type { User } from '@/lib/types';
import { getISOWeek } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';


const navLinks = [
  { href: '/tech-dashboard', label: 'داشبورد', icon: Home },
  { href: '/tech-dashboard/calendar', label: 'تقویم PM', icon: Calendar },
  { href: '/tech-dashboard/sites', label: 'سایت‌های من', icon: Building2 },
  { href: '/tech-dashboard/requests', label: 'درخواست‌ها', icon: MessageSquarePlus },
];


const NavLink = ({
  href,
  label,
  icon: Icon,
  className = '',
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 ${className}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </Link>
);


const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">باز کردن منو</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>منو تکنسین</SheetTitle>
          <SheetDescription>
            برای ناوبری به بخش مورد نظر خود، یکی از گزینه‌ها را انتخاب کنید.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-2 mt-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};


const Navbar = ({
  user,
  onSignOut,
}: {
  user: User | null;
  onSignOut: () => void;
}) => {
  const currentWeekIdentifier = `W${getISOWeek(new Date())}`;
  const isMobile = useIsMobile();
  
  return (
    <nav className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link href="/tech-dashboard" className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold font-headline">
                RasaPM
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex">هفته {currentWeekIdentifier}</Badge>
            </Link>
            {!isMobile && (
              <div className="hidden md:flex items-baseline space-x-4 space-x-reverse">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} {...link} />
                  ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={user?.avatarUrl || ''}
                      alt={user?.name || ''}
                    />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="ml-2 h-4 w-4" />
                  پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="ml-2 h-4 w-4" />
                  تنظیمات
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="ml-2 h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isMobile && <MobileNav />}
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
        <p>
          &copy; {new Date().getFullYear()} RasaPM. تمام حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
};

export default function TechnicianDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const storedUser: User = JSON.parse(userString);
        if (storedUser.role === 'Technician') {
            setUser(storedUser);
        } else {
          router.replace('/management-dashboard');
        }
      } catch (error) {
        console.error("Failed to parse user, signing out.", error);
        localStorage.removeItem('user');
        router.replace('/');
      }
    } else {
        router.replace('/');
    }
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>در حال بارگذاری و بررسی دسترسی...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Navbar user={user} onSignOut={handleSignOut} />
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}

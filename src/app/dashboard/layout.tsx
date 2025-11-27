import Link from "next/link";
import {
  Bell,
  Building2,
  Home,
  LineChart,
  Package,
  Settings,
  Users,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="p-2">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-lg font-semibold font-headline">SiteWise PM</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" tooltip="داشبورد">
                <Home />
                <span>داشبورد</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" tooltip="سایت‌ها">
                <Building2 />
                <span>سایت‌ها</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="گزارشات" disabled>
                <LineChart />
                <span>گزارشات</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="کاربران" disabled>
                <Users />
                <span>کاربران</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton href="#" tooltip="تنظیمات" disabled>
                  <Settings />
                  <span>تنظیمات</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:flex" />
          <div className="w-full flex-1">
            {/* Can add a global search here later */}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=tech" alt="رضا قاسمی" />
                  <AvatarFallback>رق</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>پروفایل</DropdownMenuItem>
              <DropdownMenuItem>تنظیمات</DropdownMenuItem>
              <DropdownMenuSeparator />
               <DropdownMenuItem asChild>
                <Link href="/">خروج</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-muted/40">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

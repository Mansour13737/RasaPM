'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PMStatus, WeeklyPM, Site, User } from '@/lib/types';
import { sites, users, weeklyPMs } from '@/lib/data';
import { format, endOfWeek } from 'date-fns';

function getWeekDate(weekIdentifier: string): Date {
    const [year, week] = weekIdentifier.split('-W').map(Number);
    const d = new Date(year, 0, 1 + (week - 1) * 7);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getStatusVariant(status: PMStatus) {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Cancelled':
      return 'destructive';
    case 'Pending':
    default:
      return 'outline';
  }
}

export default function TechnicianDashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const technicianPMs = useMemo(() => {
    if (!user) return [];
    return weeklyPMs.filter(pm => pm.assignedTechnicianId === user.id);
  }, [user]);

  const pmByStatus = useMemo(() => {
      return technicianPMs.reduce((acc, pm) => {
          if (!acc[pm.status]) {
              acc[pm.status] = [];
          }
          acc[pm.status].push(pm);
          return acc;
      }, {} as Record<PMStatus, WeeklyPM[]>);
  }, [technicianPMs]);


  const PMTable = ({ pms }: { pms: WeeklyPM[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>کد سایت</TableHead>
          <TableHead>شهر</TableHead>
          <TableHead>تاریخ شروع CR</TableHead>
          <TableHead>تاریخ پایان CR</TableHead>
          <TableHead>شماره CR</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pms.length > 0 ? pms.map(pm => {
          const site = sites.find(s => s.id === pm.siteId);
          const startDate = getWeekDate(pm.weekIdentifier);
          const endDate = endOfWeek(startDate, { weekStartsOn: 1 });

          return (
            <TableRow key={pm.id}>
              <TableCell>{site?.name || 'N/A'}</TableCell>
              <TableCell>{site?.location.split(', ')[1] || 'N/A'}</TableCell>
              <TableCell>{format(startDate, 'yyyy/MM/dd')}</TableCell>
              <TableCell>{format(endDate, 'yyyy/MM/dd')}</TableCell>
              <TableCell>{pm.crNumber || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(pm.status)}>{pm.status}</Badge>
              </TableCell>
               <TableCell>
                 <Link href={`/tech-dashboard/pm/${pm.id}`}>
                    <Button variant="outline" size="sm">مشاهده و انجام</Button>
                 </Link>
              </TableCell>
            </TableRow>
          )
        }) : (
            <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                    برنامه‌ای در این دسته‌بندی وجود ندارد.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
  
  if (!user) {
    return <div className="container mx-auto"><p>در حال بارگذاری اطلاعات کاربر...</p></div>
  }

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">داشبورد تکنسین</h1>
        <p className="text-muted-foreground">
          سلام {user?.name}، برنامه‌های اختصاص یافته به شما در زیر آمده است.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>برنامه‌های PM شما</CardTitle>
          <CardDescription>
            تاریخچه برنامه‌های PM خود را مشاهده و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="in-progress" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="in-progress">در حال انجام ({pmByStatus['In Progress']?.length || 0})</TabsTrigger>
                <TabsTrigger value="pending">معلق ({pmByStatus['Pending']?.length || 0})</TabsTrigger>
                <TabsTrigger value="completed">انجام شده ({pmByStatus['Completed']?.length || 0})</TabsTrigger>
                <TabsTrigger value="cancelled">باطل شده ({pmByStatus['Cancelled']?.length || 0})</TabsTrigger>
              </TabsList>
              <TabsContent value="in-progress">
                <PMTable pms={pmByStatus['In Progress'] || []} />
              </TabsContent>
               <TabsContent value="pending">
                <PMTable pms={pmByStatus['Pending'] || []} />
              </TabsContent>
              <TabsContent value="completed">
                <PMTable pms={pmByStatus['Completed'] || []} />
              </TabsContent>
               <TabsContent value="cancelled">
                <PMTable pms={pmByStatus['Cancelled'] || []} />
              </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState, useContext } from 'react';
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
import { AppContext } from '@/context/AppContext';
import {
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Users,
} from 'lucide-react';

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
  const { sites, weeklyPMs, users } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
    setLoading(false);
  }, []);

  const technicianPMs = useMemo(() => {
    if (!currentUser) return [];
    return weeklyPMs.filter((pm) => pm.assignedTechnicianId === currentUser.id);
  }, [currentUser, weeklyPMs]);

  const pmStats = useMemo(() => {
    return technicianPMs.reduce(
      (acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0, cancelled: 0 }
    );
  }, [technicianPMs]);

  const pmByStatus = useMemo(() => {
    return technicianPMs.reduce(
      (acc, pm) => {
        if (!acc[pm.status]) {
          acc[pm.status] = [];
        }
        acc[pm.status].push(pm);
        return acc;
      },
      {} as Record<PMStatus, WeeklyPM[]>
    );
  }, [technicianPMs]);

  const PMTable = ({ pms, showTechnician = false }: { pms: WeeklyPM[], showTechnician?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>کد سایت</TableHead>
          {showTechnician && <TableHead>تکنسین</TableHead>}
          <TableHead>شهر</TableHead>
          <TableHead>هفته</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pms.length > 0 ? (
          pms.map((pm) => {
            const site = sites.find((s) => s.id === pm.siteId);
            const technician = users.find(u => u.id === pm.assignedTechnicianId);
            const isOwnPM = pm.assignedTechnicianId === currentUser?.id;

            return (
              <TableRow key={pm.id}>
                <TableCell>{site?.name || 'N/A'}</TableCell>
                 {showTechnician && <TableCell>{technician?.name || 'نامشخص'}</TableCell>}
                <TableCell>
                  {site?.location.split(', ')[1] || 'N/A'}
                </TableCell>
                <TableCell>{pm.weekIdentifier}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(pm.status)}>
                    {pm.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isOwnPM ? (
                     <Link href={`/tech-dashboard/pm/${pm.id}`}>
                        <Button variant="outline" size="sm">
                          مشاهده و انجام
                        </Button>
                      </Link>
                  ) : (
                     <Button variant="outline" size="sm" disabled>
                        مشاهده
                      </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={showTechnician ? 6 : 5} className="text-center h-24">
              برنامه‌ای در این دسته‌بندی وجود ندارد.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <div className="container mx-auto">
        <p>در حال بارگذاری اطلاعات کاربر...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">داشبورد تکنسین</h1>
        <p className="text-muted-foreground">
          سلام {currentUser?.name}، برنامه‌های اختصاص یافته به شما در زیر آمده
          است.
        </p>
      </header>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PMهای انجام شده
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PMهای در حال انجام
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMهای معلق</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PM های باطل شده
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Users className="h-5 w-5" />
             وضعیت کلی PMهای شرکت
          </CardTitle>
          <CardDescription>
            آخرین وضعیت برنامه‌های PM ثبت شده برای تمام تکنسین‌ها را مشاهده کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <PMTable pms={weeklyPMs} showTechnician={true} />
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>برنامه‌های PM شما</CardTitle>
          <CardDescription>
            تاریخچه برنامه‌های PM خود را مشاهده و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="pending">
                معلق ({pmByStatus['Pending']?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                در حال انجام ({pmByStatus['In Progress']?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="completed">
                انجام شده ({pmByStatus['Completed']?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                باطل شده ({pmByStatus['Cancelled']?.length || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              <PMTable pms={pmByStatus['Pending'] || []} />
            </TabsContent>
            <TabsContent value="in-progress">
              <PMTable pms={pmByStatus['In Progress'] || []} />
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

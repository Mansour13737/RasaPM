'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CalendarDays, ArrowLeft } from 'lucide-react';
import type { CRPriority, CRStatus, Site, WeeklyPM, ChangeRequest, User } from '@/lib/types';
import { useEffect, useState, useMemo, useContext } from 'react';
import { AppContext } from '@/context/AppContext';

function getPriorityBadgeVariant(priority: CRPriority) {
  switch (priority) {
    case 'بحرانی':
      return 'destructive';
    case 'زیاد':
      return 'destructive';
    case 'متوسط':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getStatusBadgeVariant(status: CRStatus) {
  switch (status) {
    case 'باز':
      return 'default';
    case 'در حال انجام':
      return 'secondary';
    case 'انجام شده':
      return 'outline';
    case 'رد شده':
      return 'destructive';
    default:
      return 'default';
  }
}

export default function TechSiteDetailPage({
  params,
}: {
  params: { id: string };
}) {
    const { sites, weeklyPMs, changeRequests, users } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const { id: siteId } = params;

    const site = useMemo(() => sites.find(s => s.id === siteId), [siteId, sites]);
    const pms = useMemo(() => weeklyPMs.filter(pm => pm.siteId === siteId), [siteId, weeklyPMs]);
    const crs = useMemo(() => changeRequests.filter(cr => cr.siteId === siteId), [siteId, changeRequests]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);


  if (loading) {
    return <div className="container mx-auto"><p>در حال بارگذاری...</p></div>
  }
  
  if (!site) {
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">{site.name}</h1>
            <p className="text-muted-foreground">{site.location}</p>
        </div>
         <Link href="/tech-dashboard/sites">
          <Button variant="outline">
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست سایت‌ها
          </Button>
        </Link>
      </header>

      <Tabs defaultValue="pms" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pms">PMهای هفتگی</TabsTrigger>
          <TabsTrigger value="crs">درخواست‌های تغییر (CR)</TabsTrigger>
        </TabsList>
        <TabsContent value="pms">
          <Card>
            <CardHeader>
              <CardTitle>لیست PMهای هفتگی</CardTitle>
              <CardDescription>
                PMهای ثبت شده برای این سایت را مشاهده کنید.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pms.length > 0 ? pms.map((pm) => (
                  <Link href={`/tech-dashboard/pm/${pm.id}`} key={pm.id}>
                    <div className="border rounded-lg p-4 flex justify-between items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            PM هفتگی - {pm.weekIdentifier}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            تکنسین:{' '}
                            {pm.assignedTechnicianId
                              ? users.find(
                                  (u) => u.id === pm.assignedTechnicianId
                                )?.name
                              : 'تعیین نشده'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            pm.status === 'Completed' ? 'default' : 'secondary'
                          }
                        >
                          {pm.status}
                        </Badge>
                        <ChevronLeft className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                )): (
                     <p className="text-center text-muted-foreground py-8">
                        هنوز هیچ PMی برای این سایت ثبت نشده است.
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crs">
          <Card>
            <CardHeader>
              <CardTitle>درخواست‌های تغییر (CR)</CardTitle>
              <CardDescription>
                CRهای ثبت شده برای این سایت را مشاهده کنید.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان</TableHead>
                    <TableHead>اولویت</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>تاریخ ثبت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crs.length > 0 ? crs.map((cr) => (
                    <TableRow key={cr.id}>
                      <TableCell className="font-medium">{cr.title}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(cr.priority)}>
                          {cr.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cr.status)}>
                          {cr.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(cr.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>
                    </TableRow>
                  )): (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            هیچ CRی برای این سایت ثبت نشده است.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

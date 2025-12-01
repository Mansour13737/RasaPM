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
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { getISOWeek, getYear } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ITEMS_PER_PAGE = 5;


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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<PMStatus | 'all'>('all');


  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
    setLoading(false);
  }, []);

  const allCities = useMemo(
    () => [...new Set(sites.map((s) => s.location.split(', ')[1]))].sort(),
    [sites]
  );

  const technicianPMs = useMemo(() => {
    if (!currentUser) return [];
    return weeklyPMs.filter((pm) => pm.assignedTechnicianId === currentUser.id);
  }, [currentUser, weeklyPMs]);
  
  const currentWeekIdentifier = `${getYear(new Date())}-W${getISOWeek(new Date())}`;

  const currentWeekCompanyPMs = useMemo(() => {
    return weeklyPMs.filter(pm => pm.weekIdentifier === currentWeekIdentifier);
  }, [weeklyPMs, currentWeekIdentifier]);


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

  const filteredPMs = useMemo(() => {
    if (!currentUser) return [];
    return weeklyPMs.filter((pm) => {
      // Filter for current user and current week
      if (pm.assignedTechnicianId !== currentUser.id || pm.weekIdentifier !== currentWeekIdentifier) {
        return false;
      }
      const site = sites.find((s) => s.id === pm.siteId);
      if (!site) return false;

      const siteCity = site.location.split(', ')[1];
      const matchesSearch =
        searchTerm === '' ||
        site.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || siteCity === selectedCity;
      const matchesStatus = selectedStatus === 'all' || pm.status === selectedStatus;

      return matchesSearch && matchesCity && matchesStatus;
    });
  }, [searchTerm, selectedCity, selectedStatus, weeklyPMs, sites, currentUser, currentWeekIdentifier]);

  const paginatedPMs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPMs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPMs, currentPage]);

  const totalPages = Math.ceil(filteredPMs.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedStatus]);


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
          <CardTitle>برنامه‌های PM شما (هفته جاری: {currentWeekIdentifier})</CardTitle>
          <CardDescription>
            برنامه‌های PM این هفته خود را مشاهده و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative lg:col-span-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام سایت..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="فیلتر بر اساس وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="Pending">معلق</SelectItem>
                <SelectItem value="In Progress">در حال انجام</SelectItem>
                <SelectItem value="Completed">انجام شده</SelectItem>
                <SelectItem value="Cancelled">باطل شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="فیلتر بر اساس شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                {allCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>کد سایت</TableHead>
                    <TableHead>شهر</TableHead>
                    <TableHead>هفته</TableHead>
                    <TableHead>وضعیت</TableHead>
                    <TableHead>عملیات</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedPMs.length > 0 ? (
                    paginatedPMs.map((pm) => {
                        const site = sites.find((s) => s.id === pm.siteId);
                        return (
                        <TableRow key={pm.id}>
                            <TableCell>{site?.name || 'N/A'}</TableCell>
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
                            <Link href={`/tech-dashboard/pm/${pm.id}`}>
                                <Button variant="outline" size="sm">
                                مشاهده و انجام
                                </Button>
                            </Link>
                            </TableCell>
                        </TableRow>
                        );
                    })
                    ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                         برنامه‌ای برای این هفته با فیلترهای انتخاب شده وجود ندارد.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
            </Table>
          </div>
           <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                    نمایش {paginatedPMs.length} از {filteredPMs.length} برنامه
                </div>
                <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronRight className="h-4 w-4" />
                    قبلی
                </Button>
                <span className="text-sm">
                    صفحه {currentPage} از {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    بعدی
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <Users className="h-5 w-5" />
             وضعیت PMهای شرکت (هفته جاری)
          </CardTitle>
          <CardDescription>
            آخرین وضعیت برنامه‌های PM ثبت شده برای تمام تکنسین‌ها در هفته جاری را مشاهده کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <PMTable pms={currentWeekCompanyPMs} showTechnician={true} />
        </CardContent>
      </Card>

    </div>
  );
}

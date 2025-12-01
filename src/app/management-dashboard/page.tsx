'use client';

import Link from 'next/link';
import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { User, PMStatus, WeeklyPM, Site } from '@/lib/types';
import { getISOWeek, getYear } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AISummary } from '@/components/ai-summary';
import { AppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { OverduePMsAlert } from '@/components/overdue-pms-alert';

const ITEMS_PER_PAGE = 10;

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

const NewPMSheet = () => {
  const { sites, addWeeklyPM, tasks } = useContext(AppContext);
  const { toast } = useToast();
  const [selectedSiteId, setSelectedSiteId] = React.useState<string>('');
  const [crNumber, setCrNumber] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [weekDate, setWeekDate] = React.useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !weekDate) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفاً سایت و تاریخ هفته را انتخاب کنید.',
      });
      return;
    }

    const weekIdentifier = `${getYear(weekDate)}-W${getISOWeek(weekDate)
      .toString()
      .padStart(2, '0')}`;
    
    const site = sites.find(s => s.id === selectedSiteId);
    if (!site) {
         toast({
            variant: 'destructive',
            title: 'خطا',
            description: 'سایت انتخاب شده یافت نشد.',
         });
         return;
    }

    const newPM: WeeklyPM = {
      id: `pm-${Date.now()}`,
      weekIdentifier,
      siteId: selectedSiteId,
      assignedTechnicianId: site.technicianId,
      status: 'Pending',
      crNumber: crNumber,
      tasks: tasks.map(t => ({
          taskId: t.id,
          isCompleted: false,
          notes: '',
          photos: [],
          location: null,
          checklist: {},
          customFields: {}
      })),
      comments: comment ? [{ userId: 'user-pm', text: comment, timestamp: new Date().toISOString() }] : [],
    };
    
    addWeeklyPM(newPM);

    toast({
      title: 'موفقیت',
      description: `پلن PM برای سایت ${site.name} با موفقیت ایجاد و برای تکنسین ارسال شد.`,
    });

    setSelectedSiteId('');
    setCrNumber('');
    setComment('');
    setWeekDate(undefined);
  };


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <FilePlus2 className="ml-2 h-4 w-4" />
          ثبت PM جدید
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>ایجاد پلن PM جدید</SheetTitle>
          <SheetDescription>
            اطلاعات پلن PM را وارد کنید تا برای تکنسین مربوطه ارسال شود.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pm-siteId">کد سایت</Label>
            <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
              <SelectTrigger>
                <SelectValue placeholder="کد سایت را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
             <Label>هفته</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !weekDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {weekDate ? (
                    `هفته ${getISOWeek(weekDate)} سال ${getYear(weekDate)}`
                  ) : (
                    <span>تاریخ هفته را انتخاب کنید</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={weekDate}
                  onSelect={setWeekDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="pm-cr-number">شماره CR (اختیاری)</Label>
            <Input id="pm-cr-number" placeholder="شماره CR مرتبط را وارد کنید" value={crNumber} onChange={e => setCrNumber(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pm-comment">کامنت برای تکنسین (اختیاری)</Label>
            <Textarea
              id="pm-comment"
              placeholder="پیام خود را برای تکنسین بنویسید..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <Button type="submit" className="mt-4">
            ایجاد و ارسال پلن
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default function ManagementDashboardPage() {
  const { users, sites, weeklyPMs } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTechnician, setSelectedTechnician] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<PMStatus | 'all'>('all');

  const allTechnicians = useMemo(
    () => users.filter((u) => u.role === 'Technician'),
    [users]
  );
  const allCities = useMemo(
    () => [...new Set(sites.map((s) => s.location.split(', ')[1]))].sort(),
    [sites]
  );
  
  const currentWeekIdentifier = `${getYear(new Date())}-W${getISOWeek(new Date()).toString().padStart(2, '0')}`;

  const filteredPMs = useMemo(() => {
    return weeklyPMs.filter((pm) => {
      // Filter only for the current week
      if (pm.weekIdentifier !== currentWeekIdentifier) {
        return false;
      }
      const site = sites.find((s) => s.id === pm.siteId);
      if (!site) return false;

      const siteCity = site.location.split(', ')[1];
      const matchesSearch =
        searchTerm === '' ||
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pm.crNumber && pm.crNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCity = selectedCity === 'all' || siteCity === selectedCity;
      const matchesTechnician = selectedTechnician === 'all' || pm.assignedTechnicianId === selectedTechnician;
      const matchesStatus = selectedStatus === 'all' || pm.status === selectedStatus;

      return matchesSearch && matchesCity && matchesTechnician && matchesStatus;
    });
  }, [searchTerm, selectedCity, selectedTechnician, selectedStatus, weeklyPMs, sites, currentWeekIdentifier]);
  
  const paginatedPMs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPMs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPMs, currentPage]);

  const totalPages = Math.ceil(filteredPMs.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedTechnician, selectedStatus]);


  const pmStats = useMemo(() => {
    const pmsToCount = weeklyPMs.filter(pm => pm.weekIdentifier === currentWeekIdentifier);
    return pmsToCount.reduce(
      (acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0, cancelled: 0, total: pmsToCount.length }
    );
  }, [weeklyPMs, currentWeekIdentifier]);

  return (
    <div className="space-y-6">
      <OverduePMsAlert />
      <AISummary pms={weeklyPMs} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PMهای انجام شده (هفته)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.completed}</div>
            <p className="text-xs text-muted-foreground">از {pmStats.total} برنامه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PMهای در حال انجام (هفته)
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.inProgress}</div>
             <p className="text-xs text-muted-foreground">از {pmStats.total} برنامه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMهای معلق (هفته)</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.pending}</div>
             <p className="text-xs text-muted-foreground">از {pmStats.total} برنامه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              PM های باطل شده (هفته)
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.cancelled}</div>
             <p className="text-xs text-muted-foreground">از {pmStats.total} برنامه</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>برنامه‌های PM هفته جاری ({currentWeekIdentifier})</CardTitle>
            <CardDescription>
              برنامه‌های PM این هفته را جستجو، فیلتر و مدیریت کنید.
            </CardDescription>
          </div>
          <NewPMSheet />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام سایت یا شماره CR..."
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

            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="فیلتر بر اساس تکنسین" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه تکنسین‌ها</SelectItem>
                {allTechnicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>سایت</TableHead>
                  <TableHead>تکنسین</TableHead>
                  <TableHead>شهر</TableHead>
                   <TableHead>شماره CR</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPMs.length > 0 ? (
                  paginatedPMs.map((pm) => {
                    const site = sites.find((s) => s.id === pm.siteId);
                    const technician = users.find(u => u.id === pm.assignedTechnicianId);
                    return (
                      <TableRow key={pm.id}>
                        <TableCell className="font-medium">{site?.name || 'N/A'}</TableCell>
                        <TableCell>{technician?.name || 'نامشخص'}</TableCell>
                        <TableCell>{site?.location.split(', ')[1] || 'N/A'}</TableCell>
                        <TableCell>{pm.crNumber || '---'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(pm.status)}>
                            {pm.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           <Link href={`/management-dashboard/pm/${pm.id}`}>
                            <Button variant="outline" size="sm">
                              مشاهده
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      داده‌ای برای نمایش با فیلترهای انتخاب شده وجود ندارد.
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
    </div>
  );
}

"use client"

import Link from "next/link";
import { getSiteById, getPMsForSite, getCRsForSite, users, sites as allSites, getTechnicians, getCities } from "@/lib/data";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePlus2, ChevronLeft, CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CRPriority, CRStatus } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";


function getPriorityBadgeVariant(priority: CRPriority) {
  switch (priority) {
    case 'بحرانی': return 'destructive';
    case 'زیاد': return 'destructive';
    case 'متوسط': return 'secondary';
    default: return 'outline';
  }
}

function getStatusBadgeVariant(status: CRStatus) {
    switch (status) {
      case 'باز': return 'default';
      case 'در حال انجام': return 'secondary';
      case 'انجام شده': return 'outline';
      case 'رد شده': return 'destructive';
      default: return 'default';
    }
}

// Admin role check placeholder
const isAdmin = true;

const NewCRSheet = () => {
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState<Date>();
    const technicians = getTechnicians();
    const cities = getCities();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button>
                    <FilePlus2 className="ml-2 h-4 w-4" />
                    ثبت CR جدید
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>ثبت درخواست تغییر جدید</SheetTitle>
                    <SheetDescription>
                        جزئیات درخواست خود را برای بررسی وارد کنید.
                    </SheetDescription>
                </SheetHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="cr-title">عنوان</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="نوع CR را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pm">برای PM</SelectItem>
                                <SelectItem value="repair">برای رفع خرابی</SelectItem>
                                <SelectItem value="special">برای بازدید در موارد خاص</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cr-siteId">کد سایت</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="کد سایت را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {allSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cr-city">شهر</Label>
                         <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="شهر را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cr-flm">نام FLM</Label>
                         <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="نام تکنسین را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {technicians.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label>تاریخ شروع</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>تاریخ را انتخاب کنید</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2">
                        <Label>تاریخ پایان</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>تاریخ را انتخاب کنید</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="cr-description">توضیحات</Label>
                        <Textarea id="cr-description" placeholder="توضیحات تکمیلی را اینجا وارد کنید..." />
                    </div>
                    <Button type="submit" className="mt-4">ثبت درخواست</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}


const NewPMSheet = () => {
    const [startDate, setStartDate] = React.useState<Date>();
    const [endDate, setEndDate] = React.useState<Date>();

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
                <form className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="pm-cr-number">شماره CR</Label>
                        <Input id="pm-cr-number" placeholder="شماره CR مرتبط را وارد کنید" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pm-siteId">کد سایت</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="کد سایت را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {allSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid gap-2">
                        <Label>تاریخ شروع</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !startDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {startDate ? format(startDate, "PPP") : <span>تاریخ را انتخاب کنید</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="grid gap-2">
                        <Label>تاریخ پایان</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !endDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="ml-2 h-4 w-4" />
                                {endDate ? format(endDate, "PPP") : <span>تاریخ را انتخاب کنید</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pm-comment">کامنت برای تکنسین</Label>
                        <Textarea id="pm-comment" placeholder="پیام خود را برای تکنسین بنویسید..." />
                    </div>
                    <Button type="submit" className="mt-4">ایجاد و ارسال پلن</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const site = getSiteById(params.id);
  if (!site) {
    notFound();
  }

  const pms = getPMsForSite(params.id);
  const crs = getCRsForSite(params.id);

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">{site.name}</h1>
        <p className="text-muted-foreground">{site.location}</p>
      </header>

      <Tabs defaultValue="pms" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pms">PMهای هفتگی</TabsTrigger>
          <TabsTrigger value="crs">درخواست‌های تغییر (CR)</TabsTrigger>
        </TabsList>
        <TabsContent value="pms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>لیست PMهای هفتگی</CardTitle>
                <CardDescription>PMهای ثبت شده برای این سایت را مشاهده و مدیریت کنید.</CardDescription>
              </div>
              {isAdmin && <NewPMSheet />}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pms.map(pm => (
                  <Link href={`/management-dashboard/pm/${pm.id}`} key={pm.id}>
                    <div className="border rounded-lg p-4 flex justify-between items-center hover:bg-accent hover:text-accent-foreground transition-colors">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">PM هفتگی - {pm.weekIdentifier}</p>
                          <p className="text-sm text-muted-foreground">
                            تکنسین: {pm.assignedTechnicianId ? users.find(u => u.id === pm.assignedTechnicianId)?.name : 'تعیین نشده'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={pm.status === 'Completed' ? 'default' : 'secondary'}>{pm.status}</Badge>
                        <ChevronLeft className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="crs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>درخواست‌های تغییر (CR)</CardTitle>
                <CardDescription>CRهای ثبت شده برای این سایت را مشاهده و مدیریت کنید.</CardDescription>
              </div>
               {isAdmin && <NewCRSheet />}
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
                  {crs.map(cr => (
                    <TableRow key={cr.id}>
                      <TableCell className="font-medium">{cr.title}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(cr.priority)}>{cr.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cr.status)}>{cr.status}</Badge>
                      </TableCell>
                      <TableCell>{new Date(cr.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

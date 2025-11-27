import Link from "next/link";
import { getSiteById, getPMsForSite, getCRsForSite, users } from "@/lib/data";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePlus2, ChevronLeft, CalendarDays } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CRPriority, CRStatus } from "@/lib/types";

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
            <CardHeader>
              <CardTitle>لیست PMهای هفتگی</CardTitle>
              <CardDescription>PMهای ثبت شده برای این سایت را مشاهده و مدیریت کنید.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pms.map(pm => (
                  <Link href={`/dashboard/pm/${pm.id}`} key={pm.id}>
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
               <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <FilePlus2 className="ml-2 h-4 w-4" />
                    ثبت CR جدید
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>ثبت درخواست تغییر جدید</SheetTitle>
                    <SheetDescription>
                      جزئیات درخواست خود را برای بررسی وارد کنید.
                    </SheetDescription>
                  </SheetHeader>
                  <form className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cr-title">عنوان</Label>
                      <Input id="cr-title" placeholder="مثال: خرابی فن سرور" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cr-description">توضیحات</Label>
                      <Textarea id="cr-description" placeholder="جزئیات کامل درخواست را شرح دهید." />
                    </div>
                     <div className="grid gap-2">
                      <Label htmlFor="cr-priority">اولویت</Label>
                       <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="اولویت را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">کم</SelectItem>
                          <SelectItem value="medium">متوسط</SelectItem>
                          <SelectItem value="high">زیاد</SelectItem>
                          <SelectItem value="critical">بحرانی</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cr-photo">آپلود عکس</Label>
                        <Input id="cr-photo" type="file" />
                    </div>
                    <Button type="submit" className="mt-4">ثبت درخواست</Button>
                  </form>
                </SheetContent>
              </Sheet>
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

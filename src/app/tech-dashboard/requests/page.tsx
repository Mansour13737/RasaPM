'use client';

import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/AppContext';
import type { TechRequest, TechRequestType, TechRequestPriority, TechRequestStatus } from '@/lib/types';

function getPriorityBadgeVariant(priority: TechRequestPriority) {
  switch (priority) {
    case 'فوری':
      return 'destructive';
    case 'بالا':
      return 'secondary';
    case 'متوسط':
      return 'outline';
    default:
      return 'default';
  }
}

function getStatusBadgeVariant(status: TechRequestStatus) {
    switch (status) {
      case 'جدید':
        return 'default';
      case 'در حال بررسی':
        return 'secondary';
      case 'انجام شده':
        return 'outline';
      case 'رد شده':
        return 'destructive';
      default:
        return 'default';
    }
  }


const NewRequestSheet = ({
  onAddRequest,
  userId
}: {
  onAddRequest: (request: TechRequest) => void;
  userId: string;
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TechRequestType>('پیشنهاد');
  const [priority, setPriority] = useState<TechRequestPriority>('متوسط');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفاً عنوان و توضیحات را وارد کنید.',
      });
      return;
    }

    const newRequest: TechRequest = {
      id: `req-${Date.now()}`,
      technicianId: userId,
      title,
      type,
      priority,
      description,
      status: 'جدید',
      createdAt: new Date().toISOString(),
    };

    onAddRequest(newRequest);

    toast({
      title: 'موفقیت',
      description: 'درخواست شما با موفقیت ثبت شد.',
    });

    // Reset form
    setTitle('');
    setType('پیشنهاد');
    setPriority('متوسط');
    setDescription('');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          ثبت درخواست جدید
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>ایجاد درخواست جدید</SheetTitle>
          <SheetDescription>
            جزئیات درخواست خود را برای ارسال به مدیران وارد کنید.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="req-title">عنوان درخواست</Label>
            <Input
              id="req-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: نیاز به کابل شبکه"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="req-type">نوع درخواست</Label>
            <Select value={type} onValueChange={(v) => setType(v as TechRequestType)}>
              <SelectTrigger>
                <SelectValue placeholder="نوع را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="درخواست تجهیزات">درخواست تجهیزات</SelectItem>
                <SelectItem value="رسیدگی به مشکل">رسیدگی به مشکل</SelectItem>
                <SelectItem value="پیشنهاد">پیشنهاد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="req-priority">اولویت</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TechRequestPriority)}>
              <SelectTrigger>
                <SelectValue placeholder="اولویت را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="فوری">فوری</SelectItem>
                <SelectItem value="بالا">بالا</SelectItem>
                <SelectItem value="متوسط">متوسط</SelectItem>
                <SelectItem value="پایین">پایین</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="req-description">توضیحات</Label>
            <Textarea
              id="req-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جزئیات کامل درخواست خود را اینجا بنویسید..."
            />
          </div>
          <Button type="submit" className="mt-4">
            ثبت درخواست
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};


export default function TechRequestsPage() {
  const { techRequests, setTechRequests } = useContext(AppContext);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const handleAddRequest = (request: TechRequest) => {
    setTechRequests(prev => [request, ...prev]);
  };
  
  const userRequests = React.useMemo(() => {
    if (!currentUser) return [];
    return techRequests.filter(r => r.technicianId === currentUser.id);
  }, [currentUser, techRequests]);


  if (!currentUser) {
      return <p>در حال بارگذاری...</p>
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>مدیریت درخواست‌ها</CardTitle>
            <CardDescription>
              درخواست‌های خود را ثبت و پیگیری کنید.
            </CardDescription>
          </div>
          <NewRequestSheet onAddRequest={handleAddRequest} userId={currentUser.id} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>اولویت</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRequests.length > 0 ? (
                userRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.title}</TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(req.priority)}>
                        {req.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(req.createdAt).toLocaleDateString('fa-IR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(req.status)}>
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    هیچ درخواستی ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

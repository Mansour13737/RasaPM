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
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/AppContext';
import type {
  TechRequest,
  TechRequestType,
  TechRequestPriority,
  TechRequestStatus,
  User,
  EquipmentRequestItem,
} from '@/lib/types';
import { TelecomEquipmentList } from '@/lib/equipment';

function getPriorityBadgeVariant(priority: TechRequestPriority) {
  switch (priority) {
    case 'فوری':
      return 'destructive';
    case 'بالا':
      return 'destructive';
    case 'متوسط':
      return 'secondary';
    default:
      return 'outline';
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
  userId,
}: {
  onAddRequest: (request: TechRequest) => void;
  userId: string;
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TechRequestType>('پیشنهاد');
  const [priority, setPriority] = useState<TechRequestPriority>('متوسط');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<EquipmentRequestItem[]>([]);
  const { toast } = useToast();

  const handleAddItem = () => {
    setItems([...items, { equipmentId: '', quantity: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: 'equipmentId' | 'quantity',
    value: string | number
  ) => {
    const newItems = [...items];
    if (field === 'quantity') {
      newItems[index][field] = Number(value) < 1 ? 1 : Number(value);
    } else {
      newItems[index][field] = value as string;
    }
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || (type !== 'درخواست تجهیزات' && !description) || (type === 'درخواست تجهیزات' && items.length === 0)) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'لطفاً تمام فیلدهای لازم را پر کنید.',
      });
      return;
    }

    const newRequest: TechRequest = {
      id: `req-${Date.now()}`,
      technicianId: userId,
      title,
      type,
      priority,
      description: type !== 'درخواست تجهیزات' ? description : '',
      items: type === 'درخواست تجهیزات' ? items : [],
      status: 'جدید',
      createdAt: new Date().toISOString(),
      comments: [],
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
    setItems([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" />
          ثبت درخواست جدید
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>ایجاد درخواست جدید</SheetTitle>
          <SheetDescription>
            جزئیات درخواست خود را برای ارسال به مدیران وارد کنید.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="req-title">عنوان درخواست</Label>
            <Input
              id="req-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="خلاصه درخواست شما"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="req-type">نوع درخواست</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as TechRequestType)}
            >
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
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as TechRequestPriority)}
            >
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

          {type === 'درخواست تجهیزات' ? (
            <div className="grid gap-4 p-4 border rounded-md">
              <Label>لیست تجهیزات</Label>
              {items.map((item, index) => {
                const selectedEquipment = TelecomEquipmentList.find(eq => eq.id === item.equipmentId);
                return (
                  <div key={index} className="grid grid-cols-[1fr_100px_auto] gap-2 items-center">
                    <Select
                      value={item.equipmentId}
                      onValueChange={(v) => handleItemChange(index, 'equipmentId', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="تجهیز را انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        {TelecomEquipmentList.map((eq) => (
                          <SelectItem key={eq.id} value={eq.id}>
                            {eq.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                       <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                          className="pr-10"
                        />
                         <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            {selectedEquipment?.unit || 'عدد'}
                        </span>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              <Button type="button" variant="outline" onClick={handleAddItem}>
                <PlusCircle className="ml-2 h-4 w-4" />
                افزودن آیتم
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="req-description">توضیحات</Label>
              <Textarea
                id="req-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="جزئیات کامل درخواست خود را اینجا بنویسید..."
                rows={5}
              />
            </div>
          )}

          <Button type="submit" className="mt-4">
            ثبت درخواست
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default function TechRequestsPage() {
  const { techRequests, setTechRequests, updateTechRequest } = useContext(AppContext);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const handleAddRequest = (request: TechRequest) => {
    setTechRequests((prev) => [request, ...prev]);
  };

  const userRequests = React.useMemo(() => {
    if (!currentUser) return [];
    return techRequests.filter((r) => r.technicianId === currentUser.id);
  }, [currentUser, techRequests]);

  if (!currentUser) {
    return <p>در حال بارگذاری...</p>;
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
          <NewRequestSheet
            onAddRequest={handleAddRequest}
            userId={currentUser.id}
          />
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

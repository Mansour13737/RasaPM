'use client';

import { notFound, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, User, Calendar, Tag } from 'lucide-react';
import type {
  User as UserType,
  TechRequest,
  TechRequestStatus,
} from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, useMemo, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/AppContext';
import { TelecomEquipmentList } from '@/lib/equipment';
import Link from 'next/link';

export default function RequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { users, techRequests, updateTechRequest } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const { id: requestId } = params;

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const request = useMemo(
    () => techRequests.find((r) => r.id === requestId),
    [requestId, techRequests]
  );
  const technician = useMemo(
    () => users.find((u) => u.id === request?.technicianId),
    [request, users]
  );

  const [newComment, setNewComment] = useState('');
  const [currentStatus, setCurrentStatus] = useState<TechRequestStatus>(
    request?.status || 'جدید'
  );

  useEffect(() => {
    if (request) {
      setCurrentStatus(request.status);
    }
  }, [request]);

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser || !request) return;

    const comment = {
      userId: currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    const updatedRequest = {
      ...request,
      comments: [...(request.comments || []), comment],
    };

    updateTechRequest(updatedRequest);
    setNewComment('');
    toast({
      title: 'موفقیت',
      description: 'کامنت شما با موفقیت ثبت شد.',
    });
  };

  const handleStatusChange = (newStatus: TechRequestStatus) => {
    if (!request) return;

    const updatedRequest = {
      ...request,
      status: newStatus,
    };
    updateTechRequest(updatedRequest);
    setCurrentStatus(newStatus);
    toast({
      title: 'موفقیت',
      description: `وضعیت درخواست به "${newStatus}" تغییر یافت.`,
    });
  };

  const commentAuthors = useMemo(() => {
    if (!request?.comments) return {};
    const authorIds = [...new Set(request.comments.map((c) => c.userId))];
    return authorIds.reduce((acc, id) => {
      const author = users.find((u) => u.id === id);
      if (author) acc[id] = author;
      return acc;
    }, {} as Record<string, UserType>);
  }, [request?.comments, users]);

  if (!request || !technician) {
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">{request.title}</h1>
          <p className="text-muted-foreground">
            درخواست ثبت شده توسط {technician.name}
          </p>
        </div>
        <Link href="/management-dashboard/requests">
          <Button variant="outline">
            <ArrowLeft className="ml-2 h-4 w-4" />
            بازگشت به لیست درخواست‌ها
          </Button>
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>جزئیات درخواست</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {request.type === 'درخواست تجهیزات' && request.items ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">لیست تجهیزات درخواستی:</h3>
                  <ul className="list-disc list-inside space-y-2 rounded-md border p-4">
                    {request.items.map((item, index) => {
                      const equipment = TelecomEquipmentList.find(
                        (e) => e.id === item.equipmentId
                      );
                      return (
                        <li key={index} className="flex justify-between">
                          <span>{equipment?.name || 'تجهیز نامشخص'}</span>
                          <span className="font-mono text-primary">
                            {item.quantity} {equipment?.unit || ''}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold">شرح درخواست:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap border p-4 rounded-md">
                    {request.description}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <Label>کامنت‌ها</Label>
                <div className="space-y-4 max-h-72 overflow-y-auto pr-2 border-r-2">
                  {request.comments?.map((comment, index) => {
                    const user = commentAuthors[comment.userId];
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user?.avatarUrl}
                            alt={user?.name}
                          />
                          <AvatarFallback>
                            {user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleTimeString(
                                'fa-IR'
                              )}
                            </p>
                          </div>
                          <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    );
                  }) || (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      کامنتی ثبت نشده است.
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="پاسخ خود را بنویسید..."
                  className="pr-12"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleAddComment}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>مدیریت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">تغییر وضعیت</Label>
                <Select
                  value={currentStatus}
                  onValueChange={(v) => handleStatusChange(v as TechRequestStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="جدید">جدید</SelectItem>
                    <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
                    <SelectItem value="انجام شده">انجام شده</SelectItem>
                    <SelectItem value="رد شده">رد شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات درخواست</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-semibold">تکنسین:</span>
                <span>{technician.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">تاریخ ثبت:</span>
                <span>
                  {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="font-semibold">نوع:</span>
                <Badge variant="secondary">{request.type}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span className="font-semibold">اولویت:</span>
                <Badge variant="outline">{request.priority}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

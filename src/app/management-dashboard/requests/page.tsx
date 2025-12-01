'use client';

import React, { useState, useMemo, useContext } from 'react';
import Link from 'next/link';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import type {
  TechRequest,
  TechRequestPriority,
  TechRequestStatus,
  User,
} from '@/lib/types';

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

export default function AdminTechRequestsPage() {
  const { techRequests, users } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TechRequestStatus | 'all'>(
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<
    TechRequestPriority | 'all'
  >('all');

  const technicians = useMemo(
    () => users.filter((u) => u.role === 'Technician'),
    [users]
  );
  const technicianMap = useMemo(
    () =>
      technicians.reduce((acc, tech) => {
        acc[tech.id] = tech;
        return acc;
      }, {} as Record<string, User>),
    [technicians]
  );

  const filteredRequests = useMemo(() => {
    return techRequests.filter((req) => {
      const technician = technicianMap[req.technicianId];
      const matchesSearch =
        searchTerm === '' ||
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        technician?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || req.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || req.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [
    techRequests,
    searchTerm,
    statusFilter,
    priorityFilter,
    technicianMap,
  ]);

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>درخواست‌های تکنسین‌ها</CardTitle>
          <CardDescription>
            درخواست‌های ثبت شده توسط تکنسین‌ها را بررسی و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس عنوان یا نام تکنسین..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as TechRequestStatus | 'all')
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="جدید">جدید</SelectItem>
                <SelectItem value="در حال بررسی">در حال بررسی</SelectItem>
                <SelectItem value="انجام شده">انجام شده</SelectItem>
                <SelectItem value="رد شده">رد شده</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={priorityFilter}
              onValueChange={(v) =>
                setPriorityFilter(v as TechRequestPriority | 'all')
              }
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="فوری">فوری</SelectItem>
                <SelectItem value="بالا">بالا</SelectItem>
                <SelectItem value="متوسط">متوسط</SelectItem>
                <SelectItem value="پایین">پایین</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>تکنسین</TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>اولویت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.title}</TableCell>
                    <TableCell>
                      {technicianMap[req.technicianId]?.name || 'نامشخص'}
                    </TableCell>
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
                    <TableCell>
                      <Link href={`/management-dashboard/requests/${req.id}`}>
                        <Button variant="outline" size="sm">
                          مشاهده
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    هیچ درخواستی یافت نشد.
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

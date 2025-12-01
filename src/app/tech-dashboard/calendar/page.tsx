'use client';

import Link from 'next/link';
import React, { useState, useMemo, useContext, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { User, PMStatus, WeeklyPM, Site } from '@/lib/types';
import { AppContext } from '@/context/AppContext';
import { getWeek } from 'date-fns';

const ITEMS_PER_PAGE = 15;

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

export default function PMCalendarPage() {
  const { users, sites, weeklyPMs } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTechnician, setSelectedTechnician] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<PMStatus | 'all'>('all');
  const [selectedWeek, setSelectedWeek] = useState('all');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const allTechnicians = useMemo(
    () => users.filter((u) => u.role === 'Technician'),
    [users]
  );
  const allCities = useMemo(
    () => [...new Set(sites.map((s) => s.location.split(', ')[1]))].sort(),
    [sites]
  );
  const allWeeks = useMemo(
    () => [...new Set(weeklyPMs.map(pm => pm.weekIdentifier))].sort((a,b) => a.localeCompare(b)),
    [weeklyPMs]
  );

  const filteredPMs = useMemo(() => {
    return weeklyPMs.filter((pm) => {
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
      const matchesWeek = selectedWeek === 'all' || pm.weekIdentifier === selectedWeek;

      return matchesSearch && matchesCity && matchesTechnician && matchesStatus && matchesWeek;
    });
  }, [searchTerm, selectedCity, selectedTechnician, selectedStatus, selectedWeek, weeklyPMs, sites]);

  const paginatedPMs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPMs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPMs, currentPage]);

  const totalPages = Math.ceil(filteredPMs.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedTechnician, selectedStatus, selectedWeek]);


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>تقویم و برنامه سالانه PM</CardTitle>
          <CardDescription>
            برنامه‌های PM ثبت شده در طول سال را جستجو، فیلتر و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative lg:col-span-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام سایت یا شماره CR..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger>
                <SelectValue placeholder="فیلتر بر اساس هفته" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه هفته‌ها</SelectItem>
                {allWeeks.map((week) => (
                  <SelectItem key={week} value={week}>
                    {week.replace('-W', ' - هفته ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                  <TableHead>هفته</TableHead>
                  <TableHead>تکنسین</TableHead>
                  <TableHead>شهر</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPMs.length > 0 ? (
                  paginatedPMs.map((pm) => {
                    const site = sites.find((s) => s.id === pm.siteId);
                    const technician = users.find(u => u.id === pm.assignedTechnicianId);
                    const isOwnPM = pm.assignedTechnicianId === currentUser?.id;
                    return (
                      <TableRow key={pm.id}>
                        <TableCell className="font-medium">{site?.name || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{pm.weekIdentifier}</Badge>
                        </TableCell>
                        <TableCell>{technician?.name || 'نامشخص'}</TableCell>
                        <TableCell>{site?.location.split(', ')[1] || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(pm.status)}>
                            {pm.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                           {isOwnPM ? (
                            <Link href={`/tech-dashboard/pm/${pm.id}`}>
                                <Button variant="outline" size="sm">
                                مشاهده
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

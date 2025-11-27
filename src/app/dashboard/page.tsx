"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { sites, users, weeklyPMs } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Activity, CheckCircle, Clock, XCircle, Calendar as CalendarIcon, FilePlus2 } from "lucide-react";
import type { User, PMStatus, WeeklyPM } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 9;

function getStatusVariant(status: PMStatus) {
  switch (status) {
    case "Completed":
      return "default";
    case "In Progress":
      return "secondary";
    case "Cancelled":
      return "destructive";
    case "Pending":
    default:
      return "outline";
  }
}


export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedFlm, setSelectedFlm] = useState("all");
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const allTechnicians = useMemo(() => users.filter(u => u.role === 'Technician'), []);
  const allCities = useMemo(() => [...new Set(sites.map(s => s.location.split(', ')[1]))], []);

  const filteredPMs = useMemo(() => {
    return weeklyPMs.filter(pm => {
        const site = sites.find(s => s.id === pm.siteId);
        if (!site) return false;
        
        const siteCity = site.location.split(', ')[1];
        const matchesSearch = searchTerm === "" || site.name.toLowerCase().includes(searchTerm.toLowerCase()) || (pm.crNumber && pm.crNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCity = selectedCity === "all" || siteCity === selectedCity;
        const matchesFlm = selectedFlm === "all" || site.technicianId === selectedFlm;
        const matchesDate = !selectedDate || format(new Date(pm.weekIdentifier.replace('W', '-')), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'); // This is a simplification

        return matchesSearch && matchesCity && matchesFlm && matchesDate;
    });
  }, [searchTerm, selectedCity, selectedFlm, selectedDate]);


  const pmByStatus = useMemo(() => {
      return filteredPMs.reduce((acc, pm) => {
          if (!acc[pm.status]) {
              acc[pm.status] = [];
          }
          acc[pm.status].push(pm);
          return acc;
      }, {} as Record<PMStatus, WeeklyPM[]>);
  }, [filteredPMs]);

  
  const availableTechnicians = useMemo(() => {
    if (selectedCity === 'all') return allTechnicians;
    const techIdsInCity = new Set(sites.filter(s => s.location.split(', ')[1] === selectedCity).map(s => s.technicianId));
    return allTechnicians.filter(t => techIdsInCity.has(t.id));
  }, [selectedCity, allTechnicians]);

  const availableCities = useMemo(() => {
    if (selectedFlm === 'all') return allCities;
    const citiesForTech = new Set(sites.filter(s => s.technicianId === selectedFlm).map(s => s.location.split(', ')[1]));
    return allCities.filter(c => citiesForTech.has(c));
  }, [selectedFlm, allCities]);

  const pmStats = useMemo(() => {
    return weeklyPMs.reduce((acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
    }, { completed: 0, inProgress: 0, pending: 0, cancelled: 0 });
  }, []);

  const handleCityChange = (value: string) => {
      setSelectedCity(value);
      const techIsStillValid = availableTechnicians.some(t => t.id === selectedFlm);
      if (selectedFlm !== 'all' && !techIsStillValid) {
          setSelectedFlm('all');
      }
      setCurrentPage(1);
  }

  const handleFlmChange = (value: string) => {
      setSelectedFlm(value);
       const cityIsStillValid = availableCities.some(c => c === selectedCity);
       if(selectedCity !== 'all' && !cityIsStillValid){
          setSelectedCity('all');
       }
      setCurrentPage(1);
  }

  const PMTable = ({ pms }: { pms: WeeklyPM[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>کد سایت</TableHead>
          <TableHead>شهر</TableHead>
          <TableHead>تاریخ شروع</TableHead>
          <TableHead>تاریخ پایان</TableHead>
          <TableHead>شماره CR</TableHead>
          <TableHead>وضعیت</TableHead>
          <TableHead>عملیات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pms.map(pm => {
          const site = sites.find(s => s.id === pm.siteId);
          return (
            <TableRow key={pm.id}>
              <TableCell>{site?.name || 'N/A'}</TableCell>
              <TableCell>{site?.location.split(', ')[1] || 'N/A'}</TableCell>
              <TableCell>{pm.weekIdentifier}</TableCell>
              <TableCell>{pm.weekIdentifier}</TableCell>
              <TableCell>{pm.crNumber || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(pm.status)}>{pm.status}</Badge>
              </TableCell>
               <TableCell>
                 <Link href={`/dashboard/pm/${pm.id}`}>
                    <Button variant="outline" size="sm">مشاهده</Button>
                 </Link>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">داشبورد مدیر</h1>
        <p className="text-muted-foreground">
          وضعیت کلی سایت‌ها و برنامه‌های PM را مشاهده کنید
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMهای انجام شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PMهای در حال انجام</CardTitle>
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
            <CardTitle className="text-sm font-medium">PM های باطل شده</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pmStats.cancelled}</div>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>برنامه‌های PM</CardTitle>
          <CardDescription>
            برنامه‌های PM را جستجو، فیلتر و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو بر اساس نام سایت یا شماره CR..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={selectedCity}
              onValueChange={handleCityChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedFlm}
              onValueChange={handleFlmChange}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس FLM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه FLM ها</SelectItem>
                {availableTechnicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal md:w-[240px]",
                        !selectedDate && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>فیلتر بر اساس تاریخ</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
          </div>

          <Tabs defaultValue="in-progress">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="in-progress">در حال انجام ({pmByStatus['In Progress']?.length || 0})</TabsTrigger>
                <TabsTrigger value="completed">انجام شده ({pmByStatus['Completed']?.length || 0})</TabsTrigger>
                <TabsTrigger value="pending">معلق ({pmByStatus['Pending']?.length || 0})</TabsTrigger>
                <TabsTrigger value="cancelled">باطل شده ({pmByStatus['Cancelled']?.length || 0})</TabsTrigger>
              </TabsList>
              <TabsContent value="in-progress">
                <PMTable pms={pmByStatus['In Progress'] || []} />
              </TabsContent>
              <TabsContent value="completed">
                <PMTable pms={pmByStatus['Completed'] || []} />
              </TabsContent>
               <TabsContent value="pending">
                <PMTable pms={pmByStatus['Pending'] || []} />
              </TabsContent>
               <TabsContent value="cancelled">
                <PMTable pms={pmByStatus['Cancelled'] || []} />
              </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}

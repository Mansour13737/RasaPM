

"use client";

import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
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
import { Search, Activity, CheckCircle, Clock, XCircle, Calendar as CalendarIcon, FilePlus2, RefreshCw } from "lucide-react";
import type { User, PMStatus, WeeklyPM, Site } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, isWithinInterval, getWeek } from "date-fns";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AISummary } from "@/components/ai-summary";
import { useToast } from "@/hooks/use-toast";
import { getSites, getTechnicians, getWeeklyPMs, addWeeklyPM } from "@/lib/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore } from "@/firebase";


function getWeekDate(weekIdentifier: string): Date {
    const [year, week] = weekIdentifier.split('-W').map(Number);
    const d = new Date(year, 0, 1);
    d.setDate(d.getDate() + (week - 1) * 7);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
}


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

const NewPMSheet = ({ sites, users, onNewPM }: { sites: Site[], users: User[], onNewPM: () => void}) => {
    const firestore = useFirestore();
    const [crNumber, setCrNumber] = useState('');
    const [siteId, setSiteId] = useState('');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [comment, setComment] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!siteId || !startDate) {
             toast({
                variant: "destructive",
                title: "اطلاعات ناقص",
                description: "لطفا کد سایت و تاریخ شروع را مشخص کنید.",
            });
            return;
        }

        const site = sites.find(s => s.id === siteId);
        if (!site) {
             toast({
                variant: "destructive",
                title: "کد سایت نامعتبر",
                description: "کد سایت انتخاب شده معتبر نیست.",
            });
            return;
        }
        
        const year = startDate.getFullYear();
        const week = getWeek(startDate, { weekStartsOn: 1 });
        const weekIdentifier = `${year}-W${week.toString().padStart(2, '0')}`;

        const newPm: Omit<WeeklyPM, 'id'> = {
            weekIdentifier,
            siteId,
            assignedTechnicianId: site.technicianId,
            status: 'Pending',
            tasks: [],
            crNumber: crNumber || undefined,
            comments: comment ? [{ userId: 'user-1', text: comment, timestamp: new Date().toISOString() }] : [],
        };
        
        await addWeeklyPM(firestore, newPm);
        onNewPM();
        
        const technician = users.find(u => u.id === site.technicianId);

        toast({
            title: "پلن PM با موفقیت ایجاد شد",
            description: `پلن برای سایت ${site.name} به تکنسین ${technician?.name} اختصاص داده شد.`,
        });

        // Reset form and close sheet
        setCrNumber('');
        setSiteId('');
        setStartDate(undefined);
        setComment('');
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <Label htmlFor="pm-cr-number">شماره CR</Label>
                        <Input id="pm-cr-number" placeholder="شماره CR مرتبط را وارد کنید" value={crNumber} onChange={e => setCrNumber(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="pm-siteId">کد سایت</Label>
                        <Select value={siteId} onValueChange={setSiteId}>
                            <SelectTrigger>
                                <SelectValue placeholder="کد سایت را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>)}
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
                        <Label htmlFor="pm-comment">کامنت برای تکنسین</Label>
                        <Textarea id="pm-comment" placeholder="پیام خود را برای تکنسین بنویسید..." value={comment} onChange={e => setComment(e.target.value)} />
                    </div>
                    <Button type="submit" className="mt-4">ایجاد و ارسال پلن</Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};


export default function ManagementDashboardPage() {
  const firestore = useFirestore();
  const [allPMs, setAllPMs] = useState<WeeklyPM[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedFlm, setSelectedFlm] = useState("all");
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  
  const fetchData = async () => {
    if (!firestore) return;
    setLoading(true);
    const [pmsData, sitesData, usersData] = await Promise.all([
      getWeeklyPMs(firestore),
      getSites(firestore),
      getTechnicians(firestore), // Assuming this fetches all relevant users
    ]);
    setAllPMs(pmsData);
    setSites(sitesData);
    setUsers(usersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [firestore]);

  const allTechnicians = useMemo(() => users.filter(u => u.role === 'Technician'), [users]);
  const allCities = useMemo(() => [...new Set(sites.map(s => s.location.split(', ')[1]))], [sites]);

  const filteredPMs = useMemo(() => {
    return allPMs.filter(pm => {
        const site = sites.find(s => s.id === pm.siteId);
        if (!site) return false;
        
        const siteCity = site.location.split(', ')[1];
        const matchesSearch = searchTerm === "" || site.name.toLowerCase().includes(searchTerm.toLowerCase()) || (pm.crNumber && pm.crNumber.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCity = selectedCity === "all" || siteCity === selectedCity;
        const matchesFlm = selectedFlm === "all" || site.technicianId === selectedFlm;
        
        const matchesDate = !selectedDate || (() => {
            try {
                const weekStart = getWeekDate(pm.weekIdentifier);
                const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
                return isWithinInterval(selectedDate, { start: weekStart, end: weekEnd });
            } catch (e) {
                return false;
            }
        })();

        return matchesSearch && matchesCity && matchesFlm && matchesDate;
    });
  }, [searchTerm, selectedCity, selectedFlm, selectedDate, allPMs, sites]);


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
  }, [selectedCity, allTechnicians, sites]);

  const availableCities = useMemo(() => {
    if (selectedFlm === 'all') return allCities;
    const citiesForTech = new Set(sites.filter(s => s.technicianId === selectedFlm).map(s => s.location.split(', ')[1]));
    return allCities.filter(c => citiesForTech.has(c));
  }, [selectedFlm, allCities, sites]);

  const pmStats = useMemo(() => {
    return allPMs.reduce((acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
    }, { completed: 0, inProgress: 0, pending: 0, cancelled: 0 });
  }, [allPMs]);

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
  
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
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
        {pms.length > 0 ? pms.map(pm => {
          const site = sites.find(s => s.id === pm.siteId);
          if (!site) return null;
          const startDate = getWeekDate(pm.weekIdentifier);
          const endDate = endOfWeek(startDate, { weekStartsOn: 1 });
          return (
            <TableRow key={pm.id}>
              <TableCell>{site?.name || 'N/A'}</TableCell>
              <TableCell>{site?.location.split(', ')[1] || 'N/A'}</TableCell>
              <TableCell>{format(startDate, 'yyyy/MM/dd')}</TableCell>
              <TableCell>{format(endDate, 'yyyy/MM/dd')}</TableCell>
              <TableCell>{pm.crNumber || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(pm.status)}>{pm.status}</Badge>
              </TableCell>
               <TableCell>
                 <Link href={`/management-dashboard/pm/${pm.id}`}>
                    <Button variant="outline" size="sm">مشاهده</Button>
                 </Link>
              </TableCell>
            </TableRow>
          )
        }) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center h-24">
              داده‌ای برای نمایش وجود ندارد.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
       <AISummary pms={allPMs} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>برنامه‌های PM</CardTitle>
              <CardDescription>
                برنامه‌های PM را جستجو، فیلتر و مدیریت کنید.
              </CardDescription>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
               <NewPMSheet sites={sites} users={users} onNewPM={fetchData} />
            </div>
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
             <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
          </div>

          <Tabs defaultValue="in-progress">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
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

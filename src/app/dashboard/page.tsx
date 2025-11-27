"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { sites, getTechnicians, getCities, weeklyPMs } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Activity, CheckCircle, Clock } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedFlm, setSelectedFlm] = useState("all");

  const technicians = useMemo(() => getTechnicians(), []);
  const cities = useMemo(() => getCities(), []);

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const siteCity = site.location.split(", ")[1];
      const matchesSearch = site.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCity =
        selectedCity === "all" || siteCity === selectedCity;
      // This is a placeholder for FLM filtering, as we don't have direct mapping in sites data.
      // In a real app, you'd have a technician assigned to a site.
      const matchesFlm = selectedFlm === "all"; // Placeholder logic
      return matchesSearch && matchesCity && matchesFlm;
    });
  }, [searchTerm, selectedCity, selectedFlm]);

  const totalPages = Math.ceil(filteredSites.length / ITEMS_PER_PAGE);
  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pmStats = useMemo(() => {
    return weeklyPMs.reduce((acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        return acc;
    }, { completed: 0, inProgress: 0, pending: 0 });
  }, []);

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">داشبورد مدیر</h1>
        <p className="text-muted-foreground">
          وضعیت کلی سایت‌ها و برنامه‌های PM را مشاهده کنید
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
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
      </div>


      <Card>
        <CardHeader>
          <CardTitle>لیست سایت‌ها</CardTitle>
          <CardDescription>
            سایت‌های موجود را جستجو و مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی نام سایت..."
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
              onValueChange={(value) => {
                setSelectedCity(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedFlm}
              onValueChange={(value) => {
                setSelectedFlm(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="فیلتر بر اساس FLM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه FLM ها</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.name}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedSites.map((site) => (
              <Card key={site.id} className="overflow-hidden flex flex-col">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={site.imageUrl}
                      alt={`Image of ${site.name}`}
                      fill
                      style={{ objectFit: "cover" }}
                      data-ai-hint={site.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="mb-1 font-headline">
                    {site.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {site.location}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link
                    href={`/dashboard/sites/${site.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      مشاهده جزئیات
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {currentPage} از {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            بعدی
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState, useContext } from 'react';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/context/AppContext';

export default function TechSitesPage() {
  const { sites, users } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
    const timer = setTimeout(() => setLoading(false), 1000); // Increased loading time for demo
    return () => clearTimeout(timer);
  }, []);

  const technicianSites = useMemo(() => {
    if (!currentUser) return [];
    return sites.filter((site) => site.technicianId === currentUser.id);
  }, [currentUser, sites]);

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">سایت‌های من</h1>
        <p className="text-muted-foreground">
          لیست سایت‌هایی که شما مسئول آن هستید.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col">
              <Skeleton className="w-full h-40" />
              <CardHeader className="flex-grow">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
               <CardFooter>
                 <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : technicianSites.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {technicianSites.map((site) => {
            const technician = users.find((u) => u.id === site.technicianId);
            return (
              <Card
                key={site.id}
                className="overflow-hidden hover:shadow-lg transition-shadow border-primary/40 border-2 flex flex-col"
              >
                <Link href={`/tech-dashboard/sites/${site.id}`} className="block">
                 <div className="relative w-full h-40">
                    <Image
                      src={site.imageUrl}
                      alt={site.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      data-ai-hint={site.imageHint}
                    />
                  </div>
                </Link>
                <CardHeader className="flex-grow">
                  <CardTitle className="truncate">{site.name}</CardTitle>
                  <CardDescription>{site.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">تکنسین</Badge>
                    <p className="text-sm font-medium">
                      {technician?.name || 'نامشخص'}
                    </p>
                  </div>
                </CardContent>
                 <CardFooter>
                  <Link
                    href={`/tech-dashboard/sites/${site.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      مشاهده جزئیات
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">
              در حال حاضر هیچ سایتی به شما اختصاص داده نشده است.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

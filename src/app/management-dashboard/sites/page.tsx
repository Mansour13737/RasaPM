'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Site, User } from '@/lib/types';
import { useEffect, useState, useContext } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/context/AppContext';

export default function SitesPage() {
  const { sites, users } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">لیست سایت‌ها</h1>
        <p className="text-muted-foreground">
          تمام سایت‌های موجود در سیستم را مشاهده کنید.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-40" />
                <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sites.map((site) => {
            const technician = users.find((u) => u.id === site.technicianId);
            return (
              <Link href={`/management-dashboard/sites/${site.id}`} key={site.id}>
                <Card className={`overflow-hidden hover:shadow-lg transition-shadow`}>
                  <Image
                    src={site.imageUrl}
                    alt={site.name}
                    width={600}
                    height={400}
                    className="w-full h-40 object-cover"
                    data-ai-hint={site.imageHint}
                  />
                  <CardHeader>
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
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

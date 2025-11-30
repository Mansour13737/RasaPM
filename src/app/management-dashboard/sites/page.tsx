'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getSites, getUsers } from '@/lib/firestore'; // Use firestore
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Site, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [sitesData, usersData] = await Promise.all([
          getSites(),
          getUsers(),
        ]);
        setSites(sitesData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch sites or users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

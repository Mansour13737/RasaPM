'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getSites, getUsers } from '@/lib/firestore';
import type { Site, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TechSitesPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const [sites, setSites] = useState<Site[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!firestore) return;
            setLoading(true);
            const [sitesData, usersData] = await Promise.all([
                getSites(firestore),
                getUsers(firestore)
            ]);
            setSites(sitesData);
            setUsers(usersData);
            setLoading(false);
        };
        fetchData();
    }, [firestore]);

    const technicianSites = useMemo(() => {
        if (!user) return [];
        return sites.filter(s => s.technicianId === user.uid);
    }, [sites, user]);

     if (loading || userLoading) {
        return (
            <div className="container mx-auto">
                <header className="mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </header>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-40 w-full" />
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
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold font-headline">سایت‌های من</h1>
                <p className="text-muted-foreground">لیست سایت‌هایی که شما مسئول آن هستید.</p>
            </header>

            {technicianSites.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {technicianSites.map(site => {
                        const technician = users.find(u => u.id === site.technicianId);
                        return (
                            <Link href={`/tech-dashboard/sites/${site.id}`} key={site.id}>
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary border-2">
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
                                            <p className="text-sm font-medium">{technician?.name || 'نامشخص'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-10 text-center">
                        <p className="text-muted-foreground">در حال حاضر هیچ سایتی به شما اختصاص داده نشده است.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

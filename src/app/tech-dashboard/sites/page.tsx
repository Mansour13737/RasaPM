'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo, useState } from 'react';
import { getSitesForTechnician, users } from '@/lib/data';
import type { Site, User } from '@/lib/types';

export default function TechSitesPage() {
    const [user, setUser] = useState<User | null>(null);
    const [technicianSites, setTechnicianSites] = useState<Site[]>([]);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setTechnicianSites(getSitesForTechnician(userData.id));
        }
    }, []);


    if (!user) {
         return <div className="container mx-auto"><p>در حال بارگذاری...</p></div>
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

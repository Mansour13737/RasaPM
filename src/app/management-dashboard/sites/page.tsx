
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSites, getUsers } from "@/lib/firestore"; // Use firestore
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Site, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirestore } from "@/firebase";


export default function SitesPage() {
    const firestore = useFirestore();
    const [sites, setSites] = useState<Site[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!firestore) return;
            setLoading(true);
            
            const sitesData = await getSites(firestore);
            const usersData = await getUsers(firestore);
            setSites(sitesData);
            setUsers(usersData);
            
            setLoading(false);
        };

        fetchData();
    }, [firestore]);

    if (loading) {
        return (
            <div className="container mx-auto">
                <header className="mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </header>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
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
                <h1 className="text-3xl font-bold font-headline">لیست سایت‌ها</h1>
                <p className="text-muted-foreground">تمام سایت‌های موجود در سیستم را مشاهده کنید.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sites.map(site => {
                    const technician = users.find(u => u.id === site.technicianId);
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
                                        <p className="text-sm font-medium">{technician?.name || 'نامشخص'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

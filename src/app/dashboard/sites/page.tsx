
"use client";

import Link from "next/link";
import Image from "next/image";
import { sites, users } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Assume a logged-in user for demonstration
const LOGGED_IN_TECHNICIAN_ID = 'user-12';

export default function SitesPage() {
    const technicianSiteIds = new Set(sites.filter(s => s.technicianId === LOGGED_IN_TECHNICIAN_ID).map(s => s.id));

    return (
        <div className="container mx-auto">
            <header className="mb-6">
                <h1 className="text-3xl font-bold font-headline">لیست سایت‌ها</h1>
                <p className="text-muted-foreground">تمام سایت‌های موجود در سیستم را مشاهده کنید.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sites.map(site => {
                    const technician = users.find(u => u.id === site.technicianId);
                    const isTechnicianSite = technicianSiteIds.has(site.id);
                    return (
                        <Link href={`/dashboard/sites/${site.id}`} key={site.id}>
                            <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isTechnicianSite ? 'border-primary border-2' : ''}`}>
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
                                    {isTechnicianSite && (
                                        <Badge className="mt-2 w-full justify-center">سایت شما</Badge>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

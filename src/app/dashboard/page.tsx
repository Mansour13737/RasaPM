import Link from "next/link";
import Image from "next/image";
import { sites } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">داشبورد سایت‌ها</h1>
        <p className="text-muted-foreground">مدیریت و مشاهده وضعیت تمام سایت‌ها</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Card key={site.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={site.imageUrl}
                  alt={`Image of ${site.name}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={site.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="mb-1 font-headline">{site.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {site.location}
              </CardDescription>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link href={`/dashboard/sites/${site.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  مشاهده جزئیات
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

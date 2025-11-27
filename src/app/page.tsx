import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
             <Logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">SiteWise PM</CardTitle>
          <CardDescription>وارد حساب کاربری خود شوید</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input id="username" type="text" placeholder="مثلا: management" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">رمز عبور</Label>
                <Link href="#" className="mr-auto inline-block text-sm underline">
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>
              <Input id="password" type="password" required placeholder="••••••••" />
            </div>
            <Link href="/dashboard" className="w-full">
              <Button type="submit" className="w-full">
                ورود
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

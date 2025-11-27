"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "management" && password === "RasaManagement") {
      localStorage.setItem("userRole", "admin");
      router.push("/management-dashboard");
    } else if (username === "rasatech" && password === "RasaTech") {
      localStorage.setItem("userRole", "technician");
      router.push("/tech-dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "نام کاربری یا رمز عبور اشتباه است",
        description: "لطفا اطلاعات ورود خود را بررسی کنید.",
      });
    }
  };

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
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="مثلا: management" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">رمز عبور</Label>
                <Link href="#" className="mr-auto inline-block text-sm underline">
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              ورود
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

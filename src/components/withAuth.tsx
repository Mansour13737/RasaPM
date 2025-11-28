"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { users } from "@/lib/data";
import { Button } from "./ui/button";
import { Logo } from "./icons";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>در حال بارگذاری...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>در حال هدایت به صفحه ورود...</p>
        </div>
      );
    }

    const currentUser = users.find((u) => u.email === user.email);
    if (!currentUser) {
      return (
        <main className="flex items-center justify-center min-h-screen bg-muted/40">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Logo className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold font-headline mb-2">
              خطای دسترسی
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              پروفایل شما در سیستم تعریف نشده یا شما دسترسی به این صفحه ندارید.
            </p>
            <Button
              onClick={() => {
                logout().then(() => router.push("/login"));
              }}
              variant="destructive"
            >
              خروج
            </Button>
          </div>
        </main>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;

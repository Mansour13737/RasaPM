'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data'; // Using mock data
import type { User } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Mock login logic
    const user = users.find((u) => u.email === email);

    if (user && password === 'password') { // Using a simple mock password
      // In a real app, never store sensitive data in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      toast({
          title: 'ورود موفق',
          description: `خوش آمدید ${user.name}`,
      });
      
      if (user.role === 'Admin' || user.role === 'PM') {
          router.push('/management-dashboard');
      } else {
          router.push('/tech-dashboard');
      }

    } else {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ورود</CardTitle>
          <CardDescription>
            برای ورود به حساب کاربری خود، ایمیل و رمز عبور خود را وارد کنید. (رمز عبور: password)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              ورود
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

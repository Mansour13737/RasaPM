'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/data';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const foundUser = users.find(u => u.email === email);

    // This is a mock authentication. In a real app, you'd use a service like Firebase Auth.
    if (foundUser) {
        // Mock password check - NOTE: In a real app, never handle passwords this way.
        let passwordMatch = false;
        if(foundUser.role === 'Admin' && password === 'RasaManagement') passwordMatch = true;
        if(foundUser.role === 'PM' && password === 'RasaManagement') passwordMatch = true;
        if(foundUser.role === 'Technician' && password === 'RasaTech') passwordMatch = true;
        
        if (passwordMatch) {
            toast({
                title: 'ورود موفق',
                description: `خوش آمدید ${foundUser.name}`,
            });
            // Simulate session/role management
            if (typeof window !== 'undefined') {
                localStorage.setItem('userRole', foundUser.role);
                localStorage.setItem('userEmail', foundUser.email);
            }
            if (foundUser.role === 'Admin' || foundUser.role === 'PM') {
                router.push('/management-dashboard');
            } else {
                router.push('/tech-dashboard');
            }
        } else {
             setError('ایمیل یا رمز عبور اشتباه است.');
        }
    } else {
      setError('کاربری با این ایمیل یافت نشد.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ورود</CardTitle>
          <CardDescription>
            برای ورود به حساب کاربری خود، ایمیل و رمز عبور خود را وارد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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

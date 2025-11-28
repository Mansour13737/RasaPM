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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // In a real app, you'd use a service like Firebase Auth.
    // This is a mock authentication.
    const normalizedUsername = username.toLowerCase();
    
    // Simplified logic for roles
    let role: 'Admin' | 'PM' | 'Technician' | null = null;
    let successfulLogin = false;

    if (normalizedUsername === 'management' && password === 'RasaManagement') {
        role = 'Admin'; // Or PM, depends on desired mock logic
        successfulLogin = true;
    } else if (normalizedUsername === 'rasatech' && password === 'RasaTech') {
        role = 'Technician';
        successfulLogin = true;
    }
    
    if (successfulLogin && role) {
        toast({
            title: 'ورود موفق',
            description: `خوش آمدید ${username}`,
        });
        
        // Simulate session/role management
        if (typeof window !== 'undefined') {
            localStorage.setItem('userRole', role);
            localStorage.setItem('username', username);
        }
        
        if (role === 'Admin' || role === 'PM') {
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
            برای ورود به حساب کاربری خود، نام کاربری و رمز عبور خود را وارد کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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

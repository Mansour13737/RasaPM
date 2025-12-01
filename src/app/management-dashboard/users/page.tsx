'use client';

import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { User, UserRole } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/context/AppContext';

const UserForm = ({
  user,
  onSave,
  onClose,
  currentUser,
}: {
  user?: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
  currentUser: User | null;
}) => {
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(user?.role || 'Technician');
  const { toast } = useToast();

  const isEditingSelf = user?.id === currentUser?.id;
  const canEditRole = currentUser?.role === 'Admin' && !isEditingSelf;
  const canEditFields = currentUser?.role === 'Admin' || (currentUser?.role === 'PM' && user?.role === 'Technician');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role || !username || (!user && !password)) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'تمام فیلدهای ستاره‌دار باید پر شوند.',
      });
      return;
    }
    
    // In a real app, you'd have better ID generation
    const id = user?.id || `user-${Math.random().toString(36).substr(2, 9)}`;

    const savedUser: User = {
      id: id,
      name,
      username,
      email,
      role,
      avatarUrl: user?.avatarUrl || `https://i.pravatar.cc/150?u=${id}`,
      password: password || user?.password,
    };
    
    onSave(savedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">نام</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کامل کاربر"
          disabled={!canEditFields && !isEditingSelf}
        />
      </div>
      <div>
        <Label htmlFor="username">نام کاربری</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          disabled={!!user}
        />
      </div>
      <div>
        <Label htmlFor="email">ایمیل</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          disabled={!canEditFields && !isEditingSelf}
        />
      </div>
       {!user && (
         <div>
          <Label htmlFor="password">رمز عبور</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور قوی انتخاب کنید"
            required
          />
        </div>
       )}
      <div>
        <Label htmlFor="role">نقش</Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          disabled={!canEditRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="نقش کاربر را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technician">Technician</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
            <SelectItem value="RegionalManager">Regional Manager</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
         {!canEditRole && (
            <p className="text-xs text-muted-foreground mt-1">
                {isEditingSelf ? 'شما نمی‌توانید نقش خود را تغییر دهید.' : 'شما اجازه تغییر نقش این کاربر را ندارید.'}
            </p>
         )}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">ذخیره</Button>
      </div>
    </form>
  );
};

export default function UsersPage() {
  const { users, setUsers } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
    const timer = setTimeout(() => setLoading(false), 500); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  const handleSaveUser = (userData: User) => {
    const isNewUser = !users.some(u => u.id === userData.id);
    
    if(isNewUser && users.some(u => u.username === userData.username)) {
         toast({
            variant: 'destructive',
            title: 'خطا',
            description: 'این نام کاربری قبلا استفاده شده است.',
          });
          return;
    }

    if (isNewUser) {
        setUsers(prev => [...prev, userData]);
         toast({
            title: 'موفقیت',
            description: 'کاربر جدید با موفقیت اضافه شد.',
         });
    } else {
        setUsers(prev => prev.map(u => u.id === userData.id ? userData : u));
        toast({
            title: 'موفقیت',
            description: 'کاربر با موفقیت به‌روزرسانی شد.',
        });
    }
    
    setIsSheetOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;

    if (deletingUser.id === currentUser?.id) {
         toast({
            variant: 'destructive',
            title: 'خطا',
            description: 'شما نمی‌توانید حساب کاربری خود را حذف کنید.',
        });
        setDeletingUser(null);
        return;
    }

    setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
    toast({
        title: 'موفقیت',
        description: `کاربر ${deletingUser.name} با موفقیت حذف شد.`,
    });
    setDeletingUser(null);
  };

  const openAddSheet = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };

  const canPerformAction = (user: User) => {
      if (!currentUser) return false;
      if (currentUser.role === 'Admin') return true;
      if (currentUser.role === 'PM' && user.role === 'Technician') return true;
      if (user.id === currentUser.id) return true; // Users can edit their own (limited) info
      return false;
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>مدیریت کاربران</CardTitle>
            <CardDescription>
              کاربران سیستم را اضافه، ویرایش یا حذف کنید.
            </CardDescription>
          </div>
          {(currentUser?.role === 'Admin' || currentUser?.role === 'PM') && (
            <Button onClick={openAddSheet} disabled={currentUser?.role === 'PM'}>
                <PlusCircle className="ml-2 h-4 w-4" />
                افزودن کاربر
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditSheet(user)}
                      disabled={!canPerformAction(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                           disabled={!canPerformAction(user) || user.id === currentUser?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            آیا از حذف کاربر مطمئن هستید؟
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            این عمل غیرقابل بازگشت است. کاربر{' '}
                            {deletingUser?.name} برای همیشه حذف خواهد شد.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setDeletingUser(null)}
                          >
                            انصراف
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteUser}>
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingUser ? `ویرایش کاربر: ${editingUser.name}` : 'افزودن کاربر جدید'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onClose={() => setIsSheetOpen(false)}
              currentUser={currentUser}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

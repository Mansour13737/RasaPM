
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  SheetClose,
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
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, RefreshCw } from 'lucide-react';
import type { User, UserRole } from '@/lib/types';
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/firebase';

const UserForm = ({
  user,
  onSave,
  onClose,
}: {
  user?: User | null;
  onSave: (user: Omit<User, 'id'> | User) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'Technician');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'تمام فیلدها باید پر شوند.',
      });
      return;
    }

    const userData = {
        name,
        email,
        role,
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`
    }

    if(user) {
        onSave({ id: user.id, ...userData });
    } else {
        onSave(userData);
    }
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
        />
      </div>
      <div>
        <Label htmlFor="email">ایمیل (نام کاربری)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          disabled={!!user} // Disable email editing
        />
      </div>
      <div>
        <Label htmlFor="role">نقش</Label>
        <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
                <SelectValue placeholder="نقش کاربر را انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Technician">Technician</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
        </Select>
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
  const firestore = useFirestore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const usersData = await getUsers(firestore);
      setUsers(usersData);
    } catch (error) {
      // This will be handled by the global error handler now
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = (userData: Omit<User, 'id'> | User) => {
    if (!firestore) return;
    try {
      if ('id' in userData) {
        updateUser(firestore, userData.id, userData);
        toast({ title: 'موفقیت', description: 'کاربر با موفقیت به‌روزرسانی شد.' });
      } else {
        addUser(firestore, userData);
        toast({ title: 'موفقیت', description: 'کاربر جدید با موفقیت اضافه شد.' });
      }
      fetchUsers();
      setIsSheetOpen(false);
      setEditingUser(null);
    } catch (error) {
       // This will be handled by the global error handler now
    }
  };

  const handleDeleteUser = () => {
    if (!deletingUser || !firestore) return;
    try {
      deleteUser(firestore, deletingUser.id);
      toast({ title: 'موفقیت', description: `کاربر ${deletingUser.name} با موفقیت حذف شد.` });
      fetchUsers();
      setDeletingUser(null);
    } catch (error) {
       // This will be handled by the global error handler now
    }
  };

  const openAddSheet = () => {
    setEditingUser(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (user: User) => {
    setEditingUser(user);
    setIsSheetOpen(true);
  };
  
  if (loading) {
     return (
       <div className="space-y-4">
         <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
         </div>
         <Skeleton className="h-96 w-full" />
       </div>
     );
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
           <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={openAddSheet}>
              <PlusCircle className="ml-2 h-4 w-4" />
              افزودن کاربر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" onClick={() => setDeletingUser(user)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>آیا از حذف کاربر مطمئن هستید؟</AlertDialogTitle>
                            <AlertDialogDescription>
                                این عمل غیرقابل بازگشت است. کاربر {deletingUser?.name} برای همیشه حذف خواهد شد.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeletingUser(null)}>انصراف</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteUser}>حذف</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingUser ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <UserForm
              user={editingUser}
              onSave={handleSaveUser}
              onClose={() => setIsSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

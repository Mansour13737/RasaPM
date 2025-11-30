'use client';

import React, { useState, useEffect } from 'react';
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { users as initialUsers, addUser, updateUser, deleteUser } from '@/lib/data'; // Using mock data
import type { User, UserRole } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserForm = ({
  user,
  onSave,
  onClose,
}: {
  user?: User | null;
  onSave: (user: Omit<User, 'id' | 'email'> | (User & {email: string})) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'Technician');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !role) {
      toast({
        variant: 'destructive',
        title: 'خطا',
        description: 'تمام فیلدها باید پر شوند.',
      });
      return;
    }

    const email = user?.email || `${username.toLowerCase()}@example.com`;

    const userData = {
        name,
        username,
        email,
        role,
        avatarUrl: user?.avatarUrl || `https://i.pravatar.cc/150?u=${email}`
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
        <Label htmlFor="username">نام کاربری</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          disabled={!!user} // Disable username editing for mock data
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
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const handleSaveUser = (userData: Omit<User, 'id' | 'email'> | (User & {email: string})) => {
    if ('id' in userData) {
      updateUser(userData.id, userData);
      toast({ title: 'موفقیت', description: 'کاربر با موفقیت به‌روزرسانی شد.' });
    } else {
      // For new users, we need to generate an email if it's not part of the object
      const newUserPayload = { ...userData, email: `${userData.username}@example.com` };
      addUser(newUserPayload);
      toast({ title: 'موفقیت', description: 'کاربر جدید با موفقیت اضافه شد.' });
    }
    setUsers([...initialUsers]); // Refresh the list from mock data
    setIsSheetOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    deleteUser(deletingUser.id);
    toast({ title: 'موفقیت', description: `کاربر ${deletingUser.name} با موفقیت حذف شد.` });
    setUsers([...initialUsers]); // Refresh the list
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
          <Button onClick={openAddSheet}>
            <PlusCircle className="ml-2 h-4 w-4" />
            افزودن کاربر
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>نام کاربری</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
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

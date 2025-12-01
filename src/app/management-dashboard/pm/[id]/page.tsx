'use client';

import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, CheckCircle2, Circle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { TaskField, User, WeeklyPM, Site, TaskResult, Task } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, useMemo, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/AppContext';

function TaskFieldRenderer({ field }: { field: TaskField }) {
  const id = `task-field-${field.id}`;
  switch (field.type) {
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox id={id} disabled />
          <Label htmlFor={id} className="font-normal">
            {field.label}
          </Label>
        </div>
      );
    case 'text':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input id={id} type="text" readOnly />
        </div>
      );
    case 'number':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input id={id} type="number" readOnly />
        </div>
      );
    case 'photo':
      return (
        <div>
          <Label>{field.label}</Label>
          <Button variant="outline" className="w-full" disabled>
            <Camera className="ml-2 h-4 w-4" />
            آپلود عکس
          </Button>
        </div>
      );
    default:
      return null;
  }
}

export default function PMDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { users, sites, weeklyPMs, tasks, updateWeeklyPM } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { id: pmId } = params;

  useEffect(() => {
      const userString = localStorage.getItem('user');
      if (userString) {
          setCurrentUser(JSON.parse(userString));
      }
  }, []);

  const pm = useMemo(() => weeklyPMs.find(p => p.id === pmId), [pmId, weeklyPMs]);
  const site = useMemo(() => sites.find(s => s.id === pm?.siteId), [pm, sites]);
  const technician = useMemo(() => users.find(u => u.id === pm?.assignedTechnicianId), [pm, users]);
  
  const pmTasks = useMemo(() => {
    if (!pm) return [];
    return pm.tasks.map(taskResult => {
      return tasks.find(t => t.id === taskResult.taskId);
    }).filter((t): t is Task => t !== undefined);
  }, [pm, tasks]);

  const [newComment, setNewComment] = useState('');
  
  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser || !pm) return;
    
    const comment = {
        userId: currentUser.id,
        text: newComment,
        timestamp: new Date().toISOString()
    };
    
    const updatedPM = {
        ...pm,
        comments: [...(pm.comments || []), comment]
    };

    updateWeeklyPM(updatedPM);
    setNewComment('');
     toast({
        title: 'موفقیت',
        description: 'کامنت شما با موفقیت ثبت شد.',
      });
  }
  
  const commentAuthors = useMemo(() => {
      if (!pm?.comments) return {};
      const authorIds = [...new Set(pm.comments.map(c => c.userId))];
      return authorIds.reduce((acc, id) => {
          const author = users.find(u => u.id === id);
          if (author) acc[id] = author;
          return acc;
      }, {} as Record<string, User>);
  }, [pm?.comments, users]);


  const getStatusVariant = (status: string) => {
    if (status === 'Completed') return 'default';
    if (status === 'In Progress') return 'secondary';
    return 'outline';
  };

  if (!pm || !site) {
    notFound();
    return null;
  }

  return (
    <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold font-headline">
                  PM هفتگی - {site?.name}
                </CardTitle>
                <CardDescription>
                  شماره CR: {pm.crNumber || 'N/A'} | هفته: {pm.weekIdentifier}
                </CardDescription>
              </div>
              <div className="text-left">
                <Badge
                  variant={getStatusVariant(pm.status)}
                  className="text-lg px-4 py-1"
                >
                  {pm.status}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  تکنسین: {technician?.name ?? 'نامشخص'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={pm.tasks?.map((t) => t.taskId) || []}
              className="w-full"
            >
              {pm.tasks?.map((taskResult, index) => {
                const task = pmTasks.find(t => t.id === taskResult.taskId);
                if (!task) return null;
                return (
                  <AccordionItem value={task.id} key={task.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        {taskResult.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-right flex-1">
                          {index + 1}. {task.title}
                        </span>
                        <Badge
                          variant={task.type === 'dynamic' ? 'outline' : 'secondary'}
                        >
                          {task.type === 'dynamic' ? 'دینامیک' : 'ثابت'}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 px-4 py-2 border-r-2 border-primary/20">
                        <p className="text-muted-foreground">
                          {task.description}
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <Label>فیلدهای تسک</Label>
                            <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                              {task.fields && task.fields.length > 0 ? (
                                task.fields.map((field) => (
                                  <TaskFieldRenderer
                                    key={field.id}
                                    field={field}
                                  />
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  فیلد اضافه‌ای برای این تسک تعریف نشده است.
                                </p>
                              )}
                              <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                <Checkbox
                                  id={`task-completed-${task.id}`}
                                  checked={taskResult.isCompleted}
                                  disabled
                                />
                                <Label
                                  htmlFor={`task-completed-${task.id}`}
                                  className="font-semibold"
                                >
                                  تسک انجام شد
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`notes-${task.id}`}>
                                توضیحات و نتایج
                              </Label>
                              <Textarea
                                id={`notes-${task.id}`}
                                placeholder="مشاهدات و نتایج خود را اینجا وارد کنید..."
                                defaultValue={taskResult.notes}
                                readOnly
                              />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button variant="outline" className="flex-1" disabled>
                                <Camera className="ml-2 h-4 w-4" />
                                آپلود عکس
                              </Button>
                              <Button variant="outline" className="flex-1" disabled>
                                <MapPin className="ml-2 h-4 w-4" />
                                ثبت موقعیت
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full md:w-auto" disabled>
              ثبت و اتمام PM
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>کامنت‌ها و ارتباطات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {pm.comments?.map((comment, index) => {
                const user = commentAuthors[comment.userId];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleTimeString(
                            'fa-IR'
                          )}
                        </p>
                      </div>
                      <p className="text-sm bg-muted p-3 rounded-lg mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                );
              }) || (
                <p className="text-sm text-muted-foreground text-center">
                  کامنتی ثبت نشده است.
                </p>
              )}
            </div>
            <div className="relative">
              <Textarea
                placeholder="پیام خود را بنویسید..."
                className="pr-12"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <Button
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleAddComment}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

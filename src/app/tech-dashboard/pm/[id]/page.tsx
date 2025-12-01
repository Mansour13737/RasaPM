'use client';

import { notFound, useRouter } from 'next/navigation';
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
import type {
  TaskField,
  User,
  WeeklyPM,
  Site,
  TaskResult,
  Task,
  PMStatus,
} from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState, useMemo, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppContext } from '@/context/AppContext';

function TaskFieldRenderer({
  field,
  value,
  onFieldChange,
}: {
  field: TaskField;
  value: any;
  onFieldChange: (value: any) => void;
}) {
  const id = `task-field-${field.id}`;
  switch (field.type) {
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox 
            id={id} 
            checked={!!value}
            onCheckedChange={(checked) => onFieldChange(checked)} 
          />
          <Label htmlFor={id} className="font-normal">
            {field.label}
          </Label>
        </div>
      );
    case 'text':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input
            id={id}
            type="text"
            value={value || ''}
            onChange={(e) => onFieldChange(e.target.value)}
          />
        </div>
      );
    case 'number':
      return (
        <div>
          <Label htmlFor={id}>{field.label}</Label>
          <Input
            id={id}
            type="number"
            value={value || ''}
            onChange={(e) => onFieldChange(e.target.value)}
          />
        </div>
      );
    case 'photo':
      return (
        <div>
          <Label>{field.label}</Label>
          <Button variant="outline" className="w-full">
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
  const router = useRouter();
  const { toast } = useToast();
  const { users, sites, weeklyPMs, tasks, updateWeeklyPM } = useContext(AppContext);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const pmId = params.id;
  
  const pm = useMemo(() => weeklyPMs.find(p => p.id === pmId), [pmId, weeklyPMs]);
  
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [newComment, setNewComment] = useState('');

  const site = useMemo(() => sites.find(s => s.id === pm?.siteId), [pm, sites]);
  const technician = useMemo(() => users.find(u => u.id === pm?.assignedTechnicianId), [pm, users]);
  
  const pmTasks = useMemo(() => {
    if (!pm) return [];
    return pm.tasks.map(taskResult => {
      return tasks.find(t => t.id === taskResult.taskId);
    }).filter((t): t is Task => !!t);
  }, [pm, tasks]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
    if (pm) {
        setTaskResults(pm.tasks || []);
    }
  }, [pm]);

  const commentAuthors = useMemo(() => {
      if (!pm?.comments) return {};
      const authorIds = [...new Set(pm.comments.map(c => c.userId))];
      return authorIds.reduce((acc, id) => {
          const author = users.find(u => u.id === id);
          if (author) acc[id] = author;
          return acc;
      }, {} as Record<string, User>);
  }, [pm?.comments, users]);


  const handleTaskResultChange = (taskId: string, newResult: Partial<TaskResult>) => {
    setTaskResults((prevResults) => {
      const existingResultIndex = prevResults.findIndex(
        (r) => r.taskId === taskId
      );
      if (existingResultIndex > -1) {
        const newResults = [...prevResults];
        newResults[existingResultIndex] = {
          ...newResults[existingResultIndex],
          ...newResult,
        };
        return newResults;
      }
      return prevResults;
    });
  };

  const handleCustomFieldChange = (taskId: string, fieldId: string, value: any) => {
      const existingResult = taskResults.find(r => r.taskId === taskId);
      const newCustomFields = {...(existingResult?.customFields || {}), [fieldId]: value};
      handleTaskResultChange(taskId, { customFields: newCustomFields });
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || !pm) return;
    const comment = { userId: currentUser.id, text: newComment, timestamp: new Date().toISOString() };
    
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
  };

  const handleCompletePM = async () => {
    if (!pm) return;
    
    const allTasksCompleted = pmTasks.every(task => taskResults.find(r => r.taskId === task.id)?.isCompleted);
    const newStatus: PMStatus = allTasksCompleted ? 'Completed' : 'In Progress';
    
    const updatedPM = {
        ...pm,
        tasks: taskResults,
        status: newStatus,
    };
    updateWeeklyPM(updatedPM);
    
    toast({
        title: 'PM به‌روزرسانی شد',
        description: `وضعیت PM به "${newStatus}" تغییر یافت و نتایج ثبت شدند.`,
    });
    router.push('/tech-dashboard');
  };

  const getStatusVariant = (status: string) => {
    if (status === 'Completed') return 'default';
    if (status === 'In Progress') return 'secondary';
    return 'outline';
  };

  if (!pm || !site) {
     return <div className="container mx-auto"><p>در حال بارگذاری...</p></div>;
  }

  const isTechnicianForThisPM = currentUser?.id === pm.assignedTechnicianId;
  const isReadOnly = !isTechnicianForThisPM || pm.status === 'Completed' || pm.status === 'Cancelled';


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
              {pmTasks.map((task, index) => {
                 const taskResult = taskResults.find(
                    (r) => r.taskId === task.id
                  ) || { isCompleted: false, notes: '', customFields: {}, checklist: {} };
                return (
                  <AccordionItem value={task.id} key={task.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 w-full">
                        {taskResult.isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-right flex-1">
                          {index + 1}. {task.title}
                        </span>
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
                                        value={taskResult.customFields[field.id]}
                                        onFieldChange={(value) => handleCustomFieldChange(task.id, field.id, value)}
                                      />
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      فیلد اضافه‌ای برای این تسک تعریف نشده است.
                                    </p>
                                  )}
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
                                    value={taskResult.notes}
                                    readOnly={isReadOnly}
                                    onChange={(e) =>
                                    handleTaskResultChange(task.id, { notes: e.target.value })
                                    }
                                />
                                </div>
                           </div>
                          </div>
                           <div className="flex items-center space-x-2 space-x-reverse pt-4">
                            <Checkbox
                                id={`task-completed-${task.id}`}
                                checked={taskResult.isCompleted}
                                disabled={isReadOnly}
                                onCheckedChange={(checked) =>
                                handleTaskResultChange(task.id, { isCompleted: !!checked })
                                }
                            />
                            <Label
                                htmlFor={`task-completed-${task.id}`}
                                className="font-semibold"
                            >
                                تسک انجام شد
                            </Label>
                            </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={handleCompletePM}
              disabled={isReadOnly}
            >
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
              {pm.comments && pm.comments.length > 0 ? (
                pm.comments.map((comment, index) => {
                  const commentUser = commentAuthors[comment.userId];
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={commentUser?.avatarUrl}
                          alt={commentUser?.name}
                        />
                        <AvatarFallback>
                          {commentUser?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{commentUser?.name}</p>
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
                })
              ) : (
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
                onChange={(e) => setNewComment(e.target.value)}
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

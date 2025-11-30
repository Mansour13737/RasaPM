'use client'

import { getPMById, getSiteById, getUsers, updateUser, addCommentToPM } from "@/lib/firestore";
import { notFound, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, CheckCircle2, Circle, Send, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskField, User, WeeklyPM, Site, TaskResult } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useFirestore, useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function TaskFieldRenderer({ field }: { field: TaskField }) {
    const id = `task-field-${field.id}`;
    switch (field.type) {
        case 'checkbox':
            return (
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id={id} />
                    <Label htmlFor={id} className="font-normal">{field.label}</Label>
                </div>
            );
        case 'text':
            return (
                <div>
                    <Label htmlFor={id}>{field.label}</Label>
                    <Input id={id} type="text" />
                </div>
            );
        case 'number':
             return (
                <div>
                    <Label htmlFor={id}>{field.label}</Label>
                    <Input id={id} type="number" />
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

export default function PMDetailPage({ params }: { params: { id:string } }) {
  const firestore = useFirestore();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [pm, setPm] = useState<WeeklyPM | null>(null);
  const [site, setSite] = useState<Site | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        if (!firestore) return;
        setLoading(true);
        const pmData = await getPMById(firestore, params.id);
        if (pmData) {
            setPm(pmData);
            setTaskResults(pmData.tasks || []);
            const siteData = await getSiteById(firestore, pmData.siteId);
            setSite(siteData);
        }
        const usersData = await getUsers(firestore);
        setUsers(usersData);
        setLoading(false);
    }
    fetchData();
  }, [firestore, params.id]);

  const handleTaskCompletionChange = (taskId: string, isCompleted: boolean) => {
    setTaskResults(prevResults => {
        const existingResult = prevResults.find(r => r.taskId === taskId);
        if (existingResult) {
            return prevResults.map(r => r.taskId === taskId ? { ...r, isCompleted } : r);
        } else {
            // This part is tricky if tasks are not pre-populated.
            // For now, let's assume pm.tasks gives us the structure.
            return [...prevResults, { taskId, isCompleted, notes: '', photos: [], location: null, checklist: {}, customFields: {} }];
        }
    });
  };

  const handleNotesChange = (taskId: string, notes: string) => {
     setTaskResults(prevResults => {
        const existingResult = prevResults.find(r => r.taskId === taskId);
        if (existingResult) {
            return prevResults.map(r => r.taskId === taskId ? { ...r, notes } : r);
        }
        return prevResults;
    });
  }

  const handleAddComment = () => {
    if (!firestore || !user || !newComment.trim()) return;
    addCommentToPM(firestore, params.id, {
        userId: user.uid,
        text: newComment,
        timestamp: new Date().toISOString()
    });
    // This is an optimistic update. For a better UX, we'd wait for success.
    setPm(prev => prev ? ({ ...prev, comments: [...(prev.comments || []), { userId: user.uid, text: newComment, timestamp: new Date().toISOString() }]}) : null);
    setNewComment("");
  }
  
  const handleCompletePM = () => {
    if (!firestore) return;
    const updatedPMData = {
        tasks: taskResults,
        status: "Completed" as const
    };
    updateUser(firestore, params.id, updatedPMData);
    toast({
        title: "PM تکمیل شد",
        description: "وضعیت و نتایج با موفقیت ثبت شدند.",
    });
    router.push('/tech-dashboard');
  }


  if (loading || userLoading) {
    return <div className="container mx-auto"><p>در حال بارگذاری...</p></div>;
  }
  
  if (!pm) {
    notFound();
  }

  const technician = users.find(u => u.id === pm.assignedTechnicianId);
  const getStatusVariant = (status: string) => {
    if (status === 'Completed') return 'default';
    if (status === 'In Progress') return 'secondary';
    return 'outline';
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
                    <Badge variant={getStatusVariant(pm.status)} className="text-lg px-4 py-1">{pm.status}</Badge>
                    <p className="text-sm text-muted-foreground mt-1">تکنسین: {technician?.name ?? 'نامشخص'}</p>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <Accordion type="multiple" defaultValue={pm.tasks?.map(t => t.taskId) || []} className="w-full">
                {pm.tasks.map((taskTemplate, index) => {
                    const taskResult = taskResults.find(r => r.taskId === taskTemplate.taskId) || { isCompleted: false, notes: ''};
                    return (
                        <AccordionItem value={taskTemplate.taskId} key={taskTemplate.taskId}>
                            <AccordionTrigger>
                            <div className="flex items-center gap-3 w-full">
                                {taskResult.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                <span className="text-right flex-1">{index + 1}. {(taskTemplate as any).title}</span>
                            </div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-4 px-4 py-2 border-r-2 border-primary/20">
                                <p className="text-muted-foreground">{(taskTemplate as any).description}</p>
                                
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                    <Label>انجام تسک</Label>
                                    <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                                        <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                            <Checkbox 
                                                id={`task-completed-${taskTemplate.taskId}`} 
                                                checked={taskResult.isCompleted}
                                                onCheckedChange={(checked) => handleTaskCompletionChange(taskTemplate.taskId, !!checked)}
                                            />
                                            <Label htmlFor={`task-completed-${taskTemplate.taskId}`} className="font-semibold">تسک انجام شد</Label>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor={`notes-${taskTemplate.taskId}`}>توضیحات و نتایج</Label>
                                            <Textarea 
                                                id={`notes-${taskTemplate.taskId}`} 
                                                placeholder="مشاهدات و نتایج خود را اینجا وارد کنید..." 
                                                value={taskResult.notes}
                                                onChange={(e) => handleNotesChange(taskTemplate.taskId, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
            </CardContent>
            <CardFooter>
                <Button size="lg" className="w-full md:w-auto" onClick={handleCompletePM}>
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
                        const commentUser = users.find(u => u.id === comment.userId);
                        return (
                             <div key={index} className="flex items-start gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={commentUser?.avatarUrl} alt={commentUser?.name} />
                                    <AvatarFallback>{commentUser?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{commentUser?.name}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleTimeString('fa-IR')}</p>
                                    </div>
                                    <p className="text-sm bg-muted p-3 rounded-lg mt-1">{comment.text}</p>
                                </div>
                            </div>
                        )
                    }) || <p className="text-sm text-muted-foreground text-center">کامنتی ثبت نشده است.</p>}
                </div>
                 <div className="relative">
                    <Textarea 
                        placeholder="پیام خود را بنویسید..." 
                        className="pr-12"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleAddComment}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

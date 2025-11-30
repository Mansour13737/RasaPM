'use client'

import { getPMById, getSiteById, getUserById, getTaskById } from "@/lib/data";
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
import { Camera, MapPin, CheckCircle2, Circle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskField, User, WeeklyPM, Site, TaskResult, Task } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function TaskFieldRenderer({ field, onFieldChange }: { field: TaskField, onFieldChange: (value: any) => void }) {
    const id = `task-field-${field.id}`;
    switch (field.type) {
        case 'checkbox':
            return (
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id={id} onCheckedChange={checked => onFieldChange(checked)} />
                    <Label htmlFor={id} className="font-normal">{field.label}</Label>
                </div>
            );
        case 'text':
            return (
                <div>
                    <Label htmlFor={id}>{field.label}</Label>
                    <Input id={id} type="text" onChange={e => onFieldChange(e.target.value)} />
                </div>
            );
        case 'number':
             return (
                <div>
                    <Label htmlFor={id}>{field.label}</Label>
                    <Input id={id} type="number" onChange={e => onFieldChange(e.target.value)} />
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
  const router = useRouter();
  const { toast } = useToast();

  const [pm, setPm] = useState<WeeklyPM | undefined>(undefined);
  const [taskResults, setTaskResults] = useState<TaskResult[]>([]);
  const [newComment, setNewComment] = useState("");
  
  useEffect(() => {
    const pmData = getPMById(params.id);
    setPm(pmData);
    if(pmData) {
        setTaskResults(pmData.tasks);
    }
  }, [params.id])

  if (!pm) {
    return <div className="container mx-auto"><p>در حال بارگذاری...</p></div>;
  }

  const site = getSiteById(pm.siteId);
  const technician = pm.assignedTechnicianId ? getUserById(pm.assignedTechnicianId) : null;

  const handleTaskCompletionChange = (taskId: string, isCompleted: boolean) => {
    setTaskResults(prevResults => {
        const existingResultIndex = prevResults.findIndex(r => r.taskId === taskId);
        if (existingResultIndex > -1) {
            const newResults = [...prevResults];
            newResults[existingResultIndex] = { ...newResults[existingResultIndex], isCompleted };
            return newResults;
        }
        return [...prevResults, { taskId, isCompleted, notes: '', photos: [], location: null, checklist: {}, customFields: {} }];
    });
  };

  const handleNotesChange = (taskId: string, notes: string) => {
     setTaskResults(prevResults => {
        const existingResultIndex = prevResults.findIndex(r => r.taskId === taskId);
        if (existingResultIndex > -1) {
            const newResults = [...prevResults];
            newResults[existingResultIndex] = { ...newResults[existingResultIndex], notes };
            return newResults;
        }
         return [...prevResults, { taskId, isCompleted: false, notes, photos: [], location: null, checklist: {}, customFields: {} }];
    });
  }

  const handleAddComment = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!newComment.trim() || !user.id) return;
    
    const comment = {
        userId: user.id,
        text: newComment,
        timestamp: new Date().toISOString()
    };

    setPm(prev => prev ? ({ ...prev, comments: [...(prev.comments || []), comment] }) : undefined);
    setNewComment("");
  }
  
  const handleCompletePM = () => {
    // Here you would typically send the data to your backend
    console.log("Completing PM with results:", taskResults);
    toast({
        title: "PM تکمیل شد",
        description: "وضعیت و نتایج با موفقیت ثبت شدند (شبیه‌سازی).",
    });
    router.push('/tech-dashboard');
  }

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
                    const task = getTaskById(taskTemplate.taskId);
                    if (!task) return null;

                    const taskResult = taskResults.find(r => r.taskId === taskTemplate.taskId) || { isCompleted: false, notes: ''};
                    return (
                        <AccordionItem value={task.id} key={task.id}>
                            <AccordionTrigger>
                            <div className="flex items-center gap-3 w-full">
                                {taskResult.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                <span className="text-right flex-1">{index + 1}. {task.title}</span>
                            </div>
                            </AccordionTrigger>
                            <AccordionContent>
                            <div className="space-y-4 px-4 py-2 border-r-2 border-primary/20">
                                <p className="text-muted-foreground">{task.description}</p>
                                
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-4">
                                    <Label>انجام تسک</Label>
                                    <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                                        <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                            <Checkbox 
                                                id={`task-completed-${task.id}`} 
                                                checked={taskResult.isCompleted}
                                                onCheckedChange={(checked) => handleTaskCompletionChange(task.id, !!checked)}
                                            />
                                            <Label htmlFor={`task-completed-${task.id}`} className="font-semibold">تسک انجام شد</Label>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor={`notes-${task.id}`}>توضیحات و نتایج</Label>
                                            <Textarea 
                                                id={`notes-${task.id}`} 
                                                placeholder="مشاهدات و نتایج خود را اینجا وارد کنید..." 
                                                value={taskResult.notes}
                                                onChange={(e) => handleNotesChange(task.id, e.target.value)}
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
                        const commentUser = getUserById(comment.userId);
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

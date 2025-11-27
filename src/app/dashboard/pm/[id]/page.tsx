import { getPMById, getSiteById, users } from "@/lib/data";
import { notFound } from "next/navigation";
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
import { Camera, MapPin, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { TaskField } from "@/lib/types";

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
  const pm = getPMById(params.id);
  if (!pm) {
    notFound();
  }

  const site = getSiteById(pm.siteId);
  const technician = users.find(u => u.id === pm.assignedTechnicianId);

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">
            PM هفتگی - {site?.name}
          </CardTitle>
          <CardDescription>
            هفته: {pm.weekIdentifier} | وضعیت: <Badge variant={pm.status === 'Completed' ? 'default' : 'secondary'}>{pm.status}</Badge> | تکنسین: {technician?.name ?? 'نامشخص'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={pm.tasks.map(t => t.id || t.taskId)} className="w-full">
            {pm.tasks.map((task, index) => (
              <AccordionItem value={task.id || task.taskId} key={task.id || task.taskId}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    {task.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                    <span>{index + 1}. {task.title}</span>
                    <Badge variant={task.type === 'dynamic' ? 'outline' : 'secondary'}>{task.type === 'dynamic' ? 'دینامیک' : 'ثابت'}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-4 py-2 border-r-2 border-primary/20">
                    <p className="text-muted-foreground">{task.description}</p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                         <div className="space-y-4">
                           <Label>فیلدهای تسک</Label>
                           <div className="p-4 border rounded-md space-y-4 bg-muted/50">
                            {task.fields && task.fields.length > 0 ? (
                                task.fields.map(field => <TaskFieldRenderer key={field.id} field={field} />)
                            ) : (
                                <p className="text-sm text-muted-foreground">فیلد اضافه‌ای برای این تسک تعریف نشده است.</p>
                            )}
                            <div className="flex items-center space-x-2 space-x-reverse pt-2">
                                <Checkbox id={`task-completed-${task.id}`} checked={task.isCompleted} />
                                <Label htmlFor={`task-completed-${task.id}`} className="font-semibold">تسک انجام شد</Label>
                            </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor={`notes-${task.id}`}>توضیحات و نتایج</Label>
                                <Textarea id={`notes-${task.id}`} placeholder="مشاهدات و نتایج خود را اینجا وارد کنید..." defaultValue={task.notes} />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1">
                                    <Camera className="ml-2 h-4 w-4" />
                                    آپلود عکس
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <MapPin className="ml-2 h-4 w-4" />
                                    ثبت موقعیت
                                </Button>
                            </div>
                        </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter>
            <Button size="lg" className="w-full md:w-auto">
                ثبت و اتمام PM
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

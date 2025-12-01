
'use client';

import React, { useState, useContext, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bot } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { getISOWeek, getYear } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { planWeek, type PlanWeekOutput } from '@/ai/flows/plan-week-flow';
import type { WeeklyPM, Site } from '@/lib/types';
import { OverduePMsAlert, getOverdueSites } from './overdue-pms-alert';

const TARGET_PMS_PER_WEEK = 10;

export function AIPlanner() {
  const { sites, users, weeklyPMs, addWeeklyPM, tasks } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [plan, setPlan] = useState<PlanWeekOutput | null>(null);
  const { toast } = useToast();
  
  const currentWeekIdentifier = `${getYear(new Date())}-W${getISOWeek(new Date())}`;

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPlan(null);

    const overdueSites = getOverdueSites(sites, weeklyPMs);
    const existingPMsForWeek = weeklyPMs.filter(pm => pm.weekIdentifier === currentWeekIdentifier);
    const technicians = users.filter(u => u.role === 'Technician');

    try {
      const result = await planWeek({
        overdueSites: overdueSites.map(s => ({ id: s.id, name: s.name, location: s.location, technicianId: s.technicianId })),
        allSites: sites.map(s => ({ id: s.id, name: s.name, location: s.location, technicianId: s.technicianId })),
        technicians: technicians.map(t => ({ id: t.id, name: t.name })),
        existingPMsForWeek: existingPMsForWeek.map(pm => ({ siteId: pm.siteId })),
        targetSiteCount: TARGET_PMS_PER_WEEK,
      });
      setPlan(result);
      setShowSheet(true);
    } catch (error) {
      console.error("AI planning failed:", error);
      toast({
        variant: 'destructive',
        title: 'خطا در برنامه‌ریزی هوشمند',
        description: 'متاسفانه در ارتباط با هوش مصنوعی مشکلی پیش آمد.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPlan = () => {
    if (!plan) return;
    
    let appliedCount = 0;
    plan.suggestedPMs.forEach(suggestedPm => {
        const site = sites.find(s => s.id === suggestedPm.siteId);
        if (!site) return;

        const newPM: WeeklyPM = {
            id: `pm-${Date.now()}-${Math.random()}`,
            weekIdentifier: currentWeekIdentifier,
            siteId: suggestedPm.siteId,
            assignedTechnicianId: suggestedPm.technicianId,
            status: 'Pending',
            tasks: tasks.map(t => ({
              taskId: t.id,
              isCompleted: false,
              notes: '',
              photos: [],
              location: null,
              checklist: {},
              customFields: {}
            })),
            crNumber: `AI-${currentWeekIdentifier.split('-W')[1]}`,
        };
        addWeeklyPM(newPM);
        appliedCount++;
    });
    
    toast({
        title: 'پلن با موفقیت اعمال شد',
        description: `${appliedCount} برنامه PM جدید برای هفته جاری ایجاد شد.`
    });
    
    setShowSheet(false);
    setPlan(null);
  }

  const suggestedSites = useMemo(() => {
    if(!plan) return [];
    return plan.suggestedPMs.map(pm => {
        const site = sites.find(s => s.id === pm.siteId);
        const technician = users.find(u => u.id === pm.technicianId);
        return { site, technician };
    })
  }, [plan, sites, users]);

  return (
    <>
      <Card className="bg-primary/10 border-primary/30">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Sparkles className="h-6 w-6 text-primary" />
              برنامه‌ریزی هوشمند هفتگی
            </CardTitle>
            <CardDescription>
              با استفاده از هوش مصنوعی، یک پلن بهینه برای PMهای هفته جاری ایجاد
              کنید.
            </CardDescription>
          </div>
          <Button onClick={handleGeneratePlan} disabled={isLoading}>
            {isLoading ? 'در حال پردازش...' : 'ایجاد پلن هفتگی با AI'}
          </Button>
        </CardHeader>
      </Card>

      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-xl">پلن PM پیشنهادی هوش مصنوعی</SheetTitle>
            <SheetDescription>
              این پلن بر اساس کارهای معوقه و توزیع عادلانه کار ایجاد شده است.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">برنامه‌های پیشنهادی ({plan?.suggestedPMs.length} مورد)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {suggestedSites.map(({site, technician}, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                            <div>
                                <p className="font-semibold">{site?.name}</p>
                                <p className="text-sm text-muted-foreground">{site?.location}</p>
                            </div>
                            <Badge variant="secondary">{technician?.name}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Bot size={20} /> تحلیل هوش مصنوعی</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{plan?.reasoning}</p>
                </CardContent>
            </Card>
          </div>
           <SheetFooter>
                <Button variant="outline" onClick={() => setShowSheet(false)}>انصراف</Button>
                <Button onClick={handleApplyPlan}>اعمال پلن پیشنهادی</Button>
           </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

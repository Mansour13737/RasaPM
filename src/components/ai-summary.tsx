"use client";

import React, { useState, useMemo, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/context/AppContext';
import { getISOWeek, getYear } from 'date-fns';
import type { WeeklyPM } from '@/lib/types';


export function AISummary() {
  const { weeklyPMs, users } = useContext(AppContext);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentYear = getYear(new Date());
  const currentWeek = getISOWeek(new Date());
  const isFirstHalf = currentWeek <= 26;
  const startWeek = isFirstHalf ? 1 : 27;
  const endWeek = isFirstHalf ? 26 : 52;
  
  const pmStats = useMemo(() => {
    const technicianPerformance = users
      .filter(u => u.role === 'Technician')
      .map(tech => {
        const completedPMs = weeklyPMs.filter(pm => pm.assignedTechnicianId === tech.id && pm.status === 'Completed').length;
        return { name: tech.name, completed: completedPMs };
      })
      .sort((a, b) => b.completed - a.completed);

    const bestTechnician = technicianPerformance.length > 0 ? technicianPerformance[0] : { name: 'نامشخص', completed: 0 };
    
    const pmsInCurrentHalf = weeklyPMs.filter(pm => {
        const pmWeek = parseInt(pm.weekIdentifier.split('-W')[1]);
        return pmWeek >= startWeek && pmWeek <= endWeek;
    });

    const completedInHalf = pmsInCurrentHalf.filter(pm => pm.status === 'Completed').length;
    const cancelledInHalf = pmsInCurrentHalf.filter(pm => pm.status === 'Cancelled').length;
    
    const pmsToCount = weeklyPMs.filter(pm => pm.weekIdentifier === `${currentYear}-W${currentWeek}`);
    
    return pmsToCount.reduce(
      (acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
      },
      { 
          completed: 0, inProgress: 0, pending: 0, cancelled: 0, 
          completedInHalf,
          cancelledInHalf,
          bestTechnician
      }
    );
  }, [weeklyPMs, users, currentYear, currentWeek, startWeek, endWeek]);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');

    // In a real application, you would call your AI flow here.
    // For now, we simulate an AI response based on the stats.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { completed, inProgress, pending, cancelled, completedInHalf, cancelledInHalf, bestTechnician } = pmStats;
    
    let simulatedSummary = `**تحلیل وضعیت کلی:**\n`;
    simulatedSummary += `- در **نیمسال جاری**، ${completedInHalf} برنامه PM با موفقیت انجام شده و ${cancelledInHalf} برنامه لغو گردیده است.\n`;
    simulatedSummary += `- **برترین تکنسین** این دوره، ${bestTechnician.name} با انجام ${bestTechnician.completed} برنامه PM بوده است.\n`;
    simulatedSummary += `- در **هفته جاری**، ${inProgress} برنامه در حال انجام و ${pending} برنامه در انتظار شروع است.`;

    if (pending > 5) {
        simulatedSummary += "\n\n**نکته:** تعداد برنامه‌های معلق در هفته جاری بالاست. پیشنهاد می‌شود برنامه‌ریزی برای کاهش آن‌ها و بررسی دلایل تاخیر انجام شود."
    }
    if (inProgress > completed) {
        simulatedSummary += "\n\n**نکته:** تعداد کارهای در حال انجام بیشتر از تکمیل شده‌ها در این هفته است که ممکن است نشان‌دهنده گلوگاه در فرآیند یا پیچیدگی بیش از حد برنامه‌ها باشد."
    }


    setSummary(simulatedSummary);
    setIsLoading(false);
  };

  return (
    <Card className="mb-6 bg-secondary/50 border-primary/20">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
        <div>
            <CardTitle className="flex items-center gap-2 font-headline">
            <Lightbulb className="h-6 w-6 text-primary" />
            تحلیل هوشمند وضعیت
            </CardTitle>
            <CardDescription>
            برای دریافت خلاصه‌ای از وضعیت کلی برنامه‌های PM، دکمه زیر را بزنید.
            </CardDescription>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isLoading}>
          {isLoading ? 'در حال پردازش...' : 'ایجاد خلاصه'}
        </Button>
      </CardHeader>
      {(isLoading || summary) && (
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{summary}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

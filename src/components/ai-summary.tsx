"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { WeeklyPM, PMStatus } from '@/lib/types';

interface AISummaryProps {
  pms: WeeklyPM[];
}

export function AISummary({ pms }: AISummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pmStats = useMemo(() => {
    return pms.reduce(
      (acc, pm) => {
        if (pm.status === 'Completed') acc.completed += 1;
        else if (pm.status === 'In Progress') acc.inProgress += 1;
        else if (pm.status === 'Pending') acc.pending += 1;
        else if (pm.status === 'Cancelled') acc.cancelled += 1;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0, cancelled: 0 }
    );
  }, [pms]);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');

    // In a real application, you would call your AI flow here.
    // For now, we simulate an AI response based on the stats.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { completed, inProgress, pending, cancelled } = pmStats;
    const total = completed + inProgress + pending + cancelled;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(0) : 0;

    let simulatedSummary = `خلاصه وضعیت: ${completionRate}% از کل برنامه‌ها تکمیل شده است. `;
    simulatedSummary += ` در حال حاضر ${inProgress} برنامه در حال انجام، ${pending} برنامه در انتظار شروع و ${cancelled} برنامه لغو شده است.`;
    if (pending > 5) {
        simulatedSummary += " تعداد برنامه‌های معلق بالاست، پیشنهاد می‌شود برنامه‌ریزی برای کاهش آن‌ها انجام شود."
    }
    if (inProgress > completed) {
        simulatedSummary += " تعداد کارهای در حال انجام بیشتر از تکمیل شده‌هاست که ممکن است نشان‌دهنده گلوگاه در فرآیند باشد."
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
            <p className="text-sm text-foreground leading-relaxed">{summary}</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}

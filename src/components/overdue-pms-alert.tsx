"use client";

import React, { useContext, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import { getISOWeek } from 'date-fns';
import Link from 'next/link';

export function OverduePMsAlert() {
  const { sites, weeklyPMs } = useContext(AppContext);

  const overdueSites = useMemo(() => {
    const currentWeek = getISOWeek(new Date());
    const isFirstHalf = currentWeek <= 26;
    const startWeek = isFirstHalf ? 1 : 27;
    const endWeek = isFirstHalf ? 26 : 52;

    // Get all PMs completed in the current half of the year
    const completedPMsInCurrentHalf = weeklyPMs.filter(pm => {
      const pmWeek = parseInt(pm.weekIdentifier.split('-W')[1]);
      return pm.status === 'Completed' && pmWeek >= startWeek && pmWeek <= endWeek;
    });

    const completedSiteIds = new Set(completedPMsInCurrentHalf.map(pm => pm.siteId));

    // Find sites that do NOT have a completed PM in the current half
    const overdue = sites.filter(site => !completedSiteIds.has(site.id));
    
    return overdue;

  }, [sites, weeklyPMs]);


  if (overdueSites.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>هشدار PMهای معوقه!</AlertTitle>
      <AlertDescription>
        سایت‌های زیر در نیمه سال جاری PM انجام شده ندارند:
        <ul className="list-disc list-inside mt-2">
            {overdueSites.slice(0, 5).map(site => (
                <li key={site.id}>
                    <Link href={`/management-dashboard/sites/${site.id}`} className="underline hover:text-foreground">
                        {site.name} ({site.location})
                    </Link>
                </li>
            ))}
        </ul>
        {overdueSites.length > 5 && (
            <p className="mt-2 text-xs">و {overdueSites.length - 5} سایت دیگر...</p>
        )}
      </AlertDescription>
    </Alert>
  );
}

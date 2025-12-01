'use server';
/**
 * @fileOverview A flow to generate a weekly PM plan.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Site, WeeklyPM, User } from '@/lib/types';

const SiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  technicianId: z.string(),
});

const PlanWeekInputSchema = z.object({
  overdueSites: z.array(SiteSchema).describe("List of sites with overdue PMs that should be prioritized."),
  allSites: z.array(SiteSchema).describe("List of all available sites."),
  technicians: z.array(z.object({ id: z.string(), name: z.string() })).describe("List of all available technicians."),
  existingPMsForWeek: z.array(z.object({ siteId: z.string()})).describe("List of PMs already scheduled for the target week, to avoid duplication."),
  targetSiteCount: z.number().describe("The ideal number of PMs to schedule for the week."),
});

const PlanWeekOutputSchema = z.object({
  suggestedPMs: z.array(z.object({
    siteId: z.string().describe("The ID of the site to be scheduled."),
    technicianId: z.string().describe("The ID of the technician assigned to the site."),
  })).describe("The list of suggested PMs to create."),
  reasoning: z.string().describe("A detailed explanation of why this plan was chosen, highlighting the prioritization of overdue sites and the distribution among technicians."),
});

export type PlanWeekInput = z.infer<typeof PlanWeekInputSchema>;
export type PlanWeekOutput = z.infer<typeof PlanWeekOutputSchema>;

export async function planWeek(input: PlanWeekInput): Promise<PlanWeekOutput> {
  return planWeekFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planWeekPrompt',
  input: { schema: PlanWeekInputSchema },
  output: { schema: PlanWeekOutputSchema },
  prompt: `You are an expert logistics and operations planner for a telecommunications company. Your task is to create an optimal weekly Preventive Maintenance (PM) plan.

**Constraints & Goals:**
1.  **Prioritize Overdue:** You MUST prioritize scheduling PMs for the sites listed in \`overdueSites\`. These are critical.
2.  **Target Count:** Aim to schedule exactly \`{{targetSiteCount}}\` total PMs for the week.
3.  **Avoid Duplicates:** Do not schedule a PM for a site that is already in \`existingPMsForWeek\`.
4.  **Fill Remaining Slots:** After scheduling all possible overdue sites, fill the remaining slots with other sites from \`allSites\` to reach the \`targetSiteCount\`.
5.  **Fair Distribution:** Try to distribute the work fairly among technicians, but prioritize getting the work done over perfect balance. Assign the PM to the technician responsible for that site.
6.  **Selection Logic:** When selecting non-overdue sites, choose sites that haven't been scheduled recently. A random but logical selection is acceptable.

**Your Output:**
-   **suggestedPMs**: A list of PM objects containing \`siteId\` and the pre-assigned \`technicianId\` for that site.
-   **reasoning**: A detailed, step-by-step explanation of your choices in Persian (Farsi). Explain which overdue sites you prioritized and how you filled the remaining slots to achieve a balanced workload.

**Input Data:**
-   Overdue Sites (High Priority): {{overdueSites}}
-   All Sites: {{allSites}}
-   All Technicians: {{technicians}}
-   Existing PMs This Week (Exclude these): {{existingPMsForWeek}}
-   Target PM Count: {{targetSiteCount}}
`,
});

const planWeekFlow = ai.defineFlow(
  {
    name: 'planWeekFlow',
    inputSchema: PlanWeekInputSchema,
    outputSchema: PlanWeekOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

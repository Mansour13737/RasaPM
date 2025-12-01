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
    suggestedPMs: z.array(
      z.object({
        siteId: z.string().describe('The ID of the site to be scheduled.'),
        technicianId: z.string().describe('The ID of the technician assigned to the site.'),
        reasoning: z.string().describe("A brief reason for suggesting this PM, in Persian. (e.g., 'PM معوقه', 'تکمیل ظرفیت هفتگی')."),
      })
    ).describe('The list of suggested PMs to create.'),
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
1.  **Prioritize Overdue:** You MUST prioritize scheduling PMs for the sites listed in \`overdueSites\`. For these, the reasoning should be 'PM معوقه'.
2.  **Target Count:** Aim to schedule exactly \`{{targetSiteCount}}\` total PMs for the week.
3.  **Avoid Duplicates:** Do not schedule a PM for a site that is already in \`existingPMsForWeek\`.
4.  **Fill Remaining Slots:** After scheduling all possible overdue sites, fill the remaining slots with other sites from \`allSites\` to reach the \`targetSiteCount\`. For these, the reasoning should be 'تکمیل ظرفیت هفتگی'.
5.  **Fair Distribution:** Assign the PM to the technician responsible for that site as specified in the input data.

**Your Output:**
-   **suggestedPMs**: A list of PM objects. Each object must contain \`siteId\`, the pre-assigned \`technicianId\`, and a brief \`reasoning\` in Persian.

**Input Data:**
-   Overdue Sites (High Priority): {{jsonStringify overdueSites}}
-   All Sites: {{jsonStringify allSites}}
-   All Technicians: {{jsonStringify technicians}}
-   Existing PMs This Week (Exclude these): {{jsonStringify existingPMsForWeek}}
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

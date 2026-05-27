import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const result = await generateObject({
      model: google('gemini-2.5-pro'),
      system: `You are an expert Government Job Advisor for CSC/e-Mitra operators in India. 
You will be provided with structured JSON data representing a student/job-seeker's profile (age, education, state, category).
Your job is to return a list of EXACTLY 3 to 5 highly relevant, legitimate Indian Government Jobs (Central or State) that this person is eligible to apply for based on current or typical annual recruiting cycles (e.g. SSC CGL, Bank PO, Railways, State Police).
CRITICAL RULES:
1. ONLY recommend real, legitimate government jobs.
2. The officialWebsite MUST be a legitimate government domain (ending in .gov.in or .nic.in or official bank/railway domains like ibps.in). Do NOT link to 3rd party job portals.`,
      prompt: JSON.stringify(data),
      schema: z.object({
        jobs: z.array(z.object({
          id: z.string().describe("A unique identifier for the job (e.g., ssc-cgl-2024)"),
          jobTitle: z.string().describe("The official name of the exam or post (e.g., SSC Combined Graduate Level)"),
          department: z.string().describe("The conducting body or department (e.g., Staff Selection Commission, Indian Railways)"),
          qualificationNeeded: z.string().describe("Brief description of the education requirement (e.g., Any Bachelor's Degree)"),
          ageLimit: z.string().describe("The typical age limit for this job, accounting for category relaxations if applicable (e.g., 18-32 Years)"),
          officialWebsite: z.string().describe("The strict official URL to apply or check notifications (e.g., ssc.nic.in)"),
          navigationGuide: z.array(z.string()).describe("A 3-step guide on how to find the specific application form on the website (e.g., '1. Log in via OTR. 2. Click Latest Notifications. 3. Click Apply next to CGL.')")
        }))
      })
    });

    return Response.json({ jobs: result.object.jobs });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: "An error occurred while fetching jobs." }, { status: 500 });
  }
}

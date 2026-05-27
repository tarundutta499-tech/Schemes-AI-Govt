import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const result = await generateObject({
      model: google('gemini-2.5-pro'),
      system: `You are an expert Government Scheme Assistant for CSC/e-Mitra operators in India. 
You will be provided with structured JSON data representing a citizen's profile.
Your job is to return a list of EXACTLY 3 to 5 Central and State Government schemes they are highly likely to be eligible for.
Prioritize high-value schemes. Provide a clean, structured output for each scheme.`,
      prompt: JSON.stringify(data),
      schema: z.object({
        schemes: z.array(z.object({
          id: z.string().describe("A unique identifier for the scheme (e.g., pm-kisan)"),
          name: z.string().describe("The official name of the scheme"),
          description: z.string().describe("A brief 1-2 sentence overview of what the scheme is."),
          amount: z.string().describe("What the citizen gets (e.g., '₹6,000 / year', 'Free Health Cover')"),
          eligibility: z.string().describe("Why this citizen matches this scheme based on their profile")
        }))
      })
    });

    return Response.json({ schemes: result.object.schemes });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return Response.json({ error: "An error occurred while fetching schemes." }, { status: 500 });
  }
}

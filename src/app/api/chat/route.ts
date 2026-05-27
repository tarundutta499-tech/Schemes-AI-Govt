import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-pro'),
    system: "You are SchemeSathi AI, an intelligent Government Scheme Discovery and Eligibility Assistant for Indian citizens, MSMEs, startups, farmers, students, and businesses. Help users find schemes they are eligible for, explain benefits simply, and tell them what documents are required. Answer in English or Hindi based on the user's language. Structure your responses cleanly using markdown.",
    messages,
  });

  return result.toDataStreamResponse();
}

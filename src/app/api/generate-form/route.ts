import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { schemeName, state } = body;

    if (!schemeName) {
      return NextResponse.json({ error: "schemeName is required" }, { status: 400 });
    }

    const result = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: z.object({
        officialWebsite: z.string().describe("The official government URL to apply for this scheme"),
        requiredDocuments: z.array(z.string()).describe("A checklist of official documents the citizen must provide (e.g. Aadhar Card, Bank Passbook, Land Records)"),
        requiredFields: z.array(z.string()).describe("List of data fields the operator needs to type into the form (e.g. Aadhar Number, IFSC Code, Account Number, Farmer ID)")
      }),
      prompt: `You are an expert on Indian Government schemes. 
      The operator wants to apply for the scheme: "${schemeName}" for a citizen in "${state || 'India'}".
      Determine the exact official website URL to apply for this. 
      Determine the documents the citizen must bring to the shop.
      Determine the specific data fields the operator must type into the application form online.`,
    });

    return NextResponse.json(result.object);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate form data" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { createMockNote } from "@/lib/llm/mock-note-generator";
import { generateNoteWithOpenRouter } from "@/lib/llm/openrouter-client";

const requestSchema = z.object({
  format: z.enum(["clinical", "soap", "patientSummary"]),
  transcript: z.string().trim().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = requestSchema.parse(body);

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(createMockNote(payload.format, payload.transcript));
    }

    const note = await generateNoteWithOpenRouter(
      payload.format,
      payload.transcript,
    );

    return NextResponse.json({
      ...note,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid note generation request.", issues: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate the note.",
      },
      { status: 500 },
    );
  }
}

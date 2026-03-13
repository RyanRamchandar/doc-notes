import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const openrouter = Boolean(process.env.OPENROUTER_API_KEY);
  const deepgram = Boolean(process.env.DEEPGRAM_API_KEY);

  return NextResponse.json({
    openrouter,
    deepgram,
    hint: !openrouter || !deepgram
      ? "Set OPENROUTER_API_KEY and DEEPGRAM_API_KEY in Netlify (Site settings → Environment variables). Use scope 'All' or include 'Functions', then trigger a new deploy."
      : undefined,
  });
}

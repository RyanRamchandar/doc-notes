import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Deepgram server-side credentials are not configured." },
      { status: 400 },
    );
  }

  console.info("[api] Calling Deepgram auth grant with server API key.");

  const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ttl_seconds: 60,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      {
        error: `Unable to issue a Deepgram access token: ${detail || "Unknown error"}`,
      },
      { status: response.status },
    );
  }

  const payload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  return NextResponse.json(payload);
}

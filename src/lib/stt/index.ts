"use client";

import { DeepgramLiveClient } from "@/lib/stt/deepgram-live-client";
import { MockLiveClient } from "@/lib/stt/mock-live-client";
import { type LiveTranscriptionCallbacks } from "@/lib/stt/types";

export function createLiveTranscriptionClient(
  callbacks: LiveTranscriptionCallbacks,
) {
  const prefersMock = process.env.NEXT_PUBLIC_FORCE_MOCK === "true";

  if (prefersMock) {
    return new MockLiveClient(callbacks);
  }

  return new DeepgramLiveClient(callbacks);
}

export * from "@/lib/stt/types";

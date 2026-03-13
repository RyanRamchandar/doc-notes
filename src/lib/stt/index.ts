"use client";

import { DeepgramLiveClient } from "@/lib/stt/deepgram-live-client";
import { type LiveTranscriptionCallbacks } from "@/lib/stt/types";

export function createLiveTranscriptionClient(
  callbacks: LiveTranscriptionCallbacks,
) {
  return new DeepgramLiveClient(callbacks);
}

export function shouldForceMockTranscription() {
  return process.env.NEXT_PUBLIC_FORCE_MOCK === "true";
}

export * from "@/lib/stt/types";

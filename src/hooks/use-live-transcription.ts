"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createLiveTranscriptionClient, shouldForceMockTranscription } from "@/lib/stt";
import { BrowserSpeechClient } from "@/lib/stt/browser-speech-client";
import { MockLiveClient } from "@/lib/stt/mock-live-client";
import { type LiveTranscriptionClient, type LiveTranscriptionState } from "@/lib/stt/types";
import { type TranscriptSegment } from "@/types/transcript";

function mergeSegment(
  segments: TranscriptSegment[],
  nextSegment: TranscriptSegment,
): TranscriptSegment[] {
  if (!nextSegment.isFinal) {
    return segments;
  }

  const existingIndex = segments.findIndex(
    (segment) =>
      segment.startMs === nextSegment.startMs &&
      segment.endMs === nextSegment.endMs &&
      segment.text === nextSegment.text,
  );

  if (existingIndex >= 0) {
    const next = [...segments];
    next[existingIndex] = nextSegment;
    return next;
  }

  return [...segments, nextSegment].sort((left, right) => left.startMs - right.startMs);
}

type TranscriptionProviderMode = "browser" | "deepgram" | "mock";

export function useLiveTranscription(initialSegments: TranscriptSegment[] = []) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(initialSegments);
  const [interimSegment, setInterimSegment] = useState<TranscriptSegment | null>(null);
  const [state, setState] = useState<LiveTranscriptionState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [providerMode, setProviderMode] = useState<TranscriptionProviderMode>(
    shouldForceMockTranscription() ? "mock" : "deepgram",
  );
  const clientRef = useRef<LiveTranscriptionClient | null>(null);

  const attachClient = useCallback(
    (client: LiveTranscriptionClient, mode: TranscriptionProviderMode) => {
      clientRef.current = client;
      setProviderMode(mode);
    },
    [],
  );

  const buildClient = useCallback(
    (mode: TranscriptionProviderMode = "deepgram") => {
      const callbacks = {
        onSegment(segment: TranscriptSegment) {
          if (segment.isFinal) {
            setSegments((current) => mergeSegment(current, segment));
            setInterimSegment(null);
            return;
          }

          setInterimSegment(segment);
        },
        onStateChange(nextState: LiveTranscriptionState, message?: string) {
          setState(nextState);
          setStatusMessage(message ?? "");
        },
        onError(error: Error) {
          setState("error");
          setStatusMessage(error.message);
        },
      };

      switch (mode) {
        case "browser":
          return new BrowserSpeechClient(callbacks);
        case "mock":
          return new MockLiveClient(callbacks);
        default:
          return createLiveTranscriptionClient(callbacks);
      }
    },
    [],
  );

  const start = useCallback(async () => {
    setStatusMessage("");
    setState("connecting");

    const fallbackOrder: TranscriptionProviderMode[] = shouldForceMockTranscription()
      ? ["mock"]
      : ["deepgram", "browser", "mock"];
    let lastError: unknown = null;

    for (const mode of fallbackOrder) {
      const client = buildClient(mode);
      attachClient(client, mode);

      try {
        const nextStream = await client.start();
        setStream(nextStream);

        if (lastError) {
          const fallbackMessage =
            mode === "browser"
              ? "Falling back to browser speech recognition."
              : "Falling back to demo transcription.";

          setStatusMessage(
            lastError instanceof Error
              ? `${lastError.message} ${fallbackMessage}`
              : fallbackMessage,
          );
        }

        return;
      } catch (error) {
        lastError = error;
      }
    }

    setState("error");
    setStatusMessage(
      lastError instanceof Error ? lastError.message : "Unable to start transcription.",
    );
  }, [attachClient, buildClient]);

  const pause = useCallback(() => {
    clientRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    clientRef.current?.resume();
  }, []);

  const stop = useCallback(() => {
    clientRef.current?.stop();
    setStream(null);
  }, []);

  const reset = useCallback(() => {
    clientRef.current?.stop();
    setSegments(initialSegments);
    setInterimSegment(null);
    setStatusMessage("");
    setState("idle");
    setStream(null);
    setProviderMode(shouldForceMockTranscription() ? "mock" : "deepgram");
  }, [initialSegments]);

  const transcriptText = useMemo(
    () => segments.map((segment) => segment.text).join(" ").trim(),
    [segments],
  );

  useEffect(() => {
    setSegments(initialSegments);
  }, [initialSegments]);

  return {
    segments,
    interimSegment,
    state,
    statusMessage,
    stream,
    providerMode,
    transcriptText,
    start,
    pause,
    resume,
    stop,
    reset,
    setSegments,
  };
}

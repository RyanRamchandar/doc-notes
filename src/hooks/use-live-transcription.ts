"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createLiveTranscriptionClient } from "@/lib/stt";
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

export function useLiveTranscription(initialSegments: TranscriptSegment[] = []) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(initialSegments);
  const [interimSegment, setInterimSegment] = useState<TranscriptSegment | null>(null);
  const [state, setState] = useState<LiveTranscriptionState>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [providerMode, setProviderMode] = useState<"deepgram" | "mock">("deepgram");
  const clientRef = useRef<LiveTranscriptionClient | null>(null);

  const attachClient = useCallback(
    (client: LiveTranscriptionClient, mode: "deepgram" | "mock") => {
      clientRef.current = client;
      setProviderMode(mode);
    },
    [],
  );

  const buildClient = useCallback(
    (mode: "deepgram" | "mock" = "deepgram") =>
      mode === "mock"
        ? new MockLiveClient({
            onSegment(segment) {
              if (segment.isFinal) {
                setSegments((current) => mergeSegment(current, segment));
                setInterimSegment(null);
                return;
              }

              setInterimSegment(segment);
            },
            onStateChange(nextState, message) {
              setState(nextState);
              setStatusMessage(message ?? "");
            },
            onError(error) {
              setState("error");
              setStatusMessage(error.message);
            },
          })
        : createLiveTranscriptionClient({
            onSegment(segment) {
              if (segment.isFinal) {
                setSegments((current) => mergeSegment(current, segment));
                setInterimSegment(null);
                return;
              }

              setInterimSegment(segment);
            },
            onStateChange(nextState, message) {
              setState(nextState);
              setStatusMessage(message ?? "");
            },
            onError(error) {
              setState("error");
              setStatusMessage(error.message);
            },
          }),
    [],
  );

  const start = useCallback(async () => {
    setStatusMessage("");
    setState("connecting");

    const primaryClient = buildClient("deepgram");
    attachClient(primaryClient, "deepgram");

    try {
      const nextStream = await primaryClient.start();
      setStream(nextStream);
    } catch (error) {
      const fallbackClient = buildClient("mock");
      attachClient(fallbackClient, "mock");
      const nextStream = await fallbackClient.start();
      setStatusMessage(
        error instanceof Error
          ? `${error.message} Falling back to demo transcription.`
          : "Falling back to demo transcription.",
      );
      setStream(nextStream);
    }
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

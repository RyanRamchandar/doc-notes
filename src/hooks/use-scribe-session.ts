"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLiveTranscription } from "@/hooks/use-live-transcription";
import {
  getSessionById,
  updateSessionNote,
  updateSessionTranscript,
  upsertSession,
} from "@/lib/storage/local-session-store";
import { type GeneratedNote, type NoteFormat } from "@/types/note";
import { type SessionRecord } from "@/types/session";

export function useScribeSession(sessionId: string) {
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [error, setError] = useState<string>("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const sessionRef = useRef<SessionRecord | null>(null);

  const live = useLiveTranscription(session?.transcriptSegments ?? []);

  const commitSession = useCallback((nextSession: SessionRecord | null) => {
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, []);

  useEffect(() => {
    const saved = getSessionById(sessionId);
    commitSession(saved);
    setElapsedSeconds(saved?.durationSeconds ?? 0);
    setLoading(false);
  }, [commitSession, sessionId]);

  useEffect(() => {
    if (live.state !== "recording") {
      setStartedAtMs(null);
      return;
    }

    const startedAt = Date.now() - elapsedSeconds * 1000;
    setStartedAtMs(startedAt);

    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [elapsedSeconds, live.state]);

  useEffect(() => {
    const currentSession = sessionRef.current;

    if (!currentSession) {
      return;
    }

    const sameDuration = currentSession.durationSeconds === elapsedSeconds;
    const sameTranscript =
      JSON.stringify(currentSession.transcriptSegments) === JSON.stringify(live.segments);

    if (sameDuration && sameTranscript) {
      return;
    }

    const nextSession = updateSessionTranscript(
      currentSession,
      live.segments,
      elapsedSeconds,
    );

    if (nextSession) {
      commitSession(nextSession);
    }
  }, [commitSession, elapsedSeconds, live.segments]);

  const generateNote = useCallback(
    async (format: NoteFormat) => {
      const currentSession = sessionRef.current;

      if (!currentSession) {
        return null;
      }

      const transcript = live.transcriptText.trim();

      if (!transcript) {
        throw new Error("Record or paste a transcript before generating a note.");
      }

      setIsGeneratingNote(true);
      setError("");

      try {
        const response = await fetch("/api/notes/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            format,
            transcript,
          }),
        });

        const payload = (await response.json()) as
          | GeneratedNote
          | { error?: string };

        if (!response.ok || !("sections" in payload)) {
          const detail = "error" in payload ? payload.error : undefined;
          throw new Error(detail || "Unable to generate the note.");
        }

        const note: GeneratedNote = {
          ...payload,
          generatedAt: new Date().toISOString(),
          format,
        };

        const nextSession = updateSessionNote(sessionRef.current ?? currentSession, note);

        if (nextSession) {
          commitSession(nextSession);
        }

        return note;
      } finally {
        setIsGeneratingNote(false);
      }
    },
    [commitSession, live.transcriptText],
  );

  const updateNote = useCallback(
    (nextNote: GeneratedNote | null) => {
      const currentSession = sessionRef.current;

      if (!currentSession) {
        return;
      }

      const nextSession = updateSessionNote(currentSession, nextNote);

      if (nextSession) {
        commitSession(nextSession);
      }
    },
    [commitSession],
  );

  const updateNoteFormat = useCallback(
    (format: NoteFormat) => {
      const currentSession = sessionRef.current;

      if (!currentSession) {
        return;
      }

      const nextSession = upsertSession({
        ...currentSession,
        noteFormat: format,
      });

      if (nextSession) {
        commitSession(nextSession);
      }
    },
    [commitSession],
  );

  const note = session?.generatedNote ?? null;

  const allSegments = useMemo(
    () =>
      live.interimSegment
        ? [...live.segments, live.interimSegment]
        : live.segments,
    [live.interimSegment, live.segments],
  );

  return {
    session,
    note,
    loading,
    error,
    setError,
    isGeneratingNote,
    elapsedSeconds,
    startedAtMs,
    allSegments,
    transcriptSegments: live.segments,
    interimSegment: live.interimSegment,
    transcriptText: live.transcriptText,
    recordingState: live.state,
    statusMessage: live.statusMessage,
    providerMode: live.providerMode,
    stream: live.stream,
    startRecording: live.start,
    pauseRecording: live.pause,
    resumeRecording: live.resume,
    stopRecording: live.stop,
    generateNote,
    updateNote,
    updateNoteFormat,
  };
}

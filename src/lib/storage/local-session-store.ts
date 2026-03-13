import { SESSION_STORAGE_KEY } from "@/lib/constants";
import { buildSessionTitle } from "@/lib/storage/session-title";
import { createId } from "@/lib/utils";
import { type GeneratedNote } from "@/types/note";
import { type SessionRecord } from "@/types/session";
import { type TranscriptSegment } from "@/types/transcript";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sortSessions(sessions: SessionRecord[]) {
  return [...sessions].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

function notifySessionsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("doc-notes:sessions-changed"));
  }
}

function safeParse(value: string | null): SessionRecord[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as SessionRecord[];
    return Array.isArray(parsed) ? sortSessions(parsed) : [];
  } catch {
    return [];
  }
}

export function listSessions() {
  if (!canUseStorage()) {
    return [];
  }

  return safeParse(window.localStorage.getItem(SESSION_STORAGE_KEY));
}

export function getSessionById(sessionId: string) {
  return listSessions().find((session) => session.id === sessionId) ?? null;
}

export function createEmptySession(): SessionRecord {
  const now = new Date().toISOString();
  return {
    id: createId(),
    createdAt: now,
    updatedAt: now,
    title: `Visit · ${new Date(now).toLocaleString()}`,
    transcriptSegments: [],
    rawTranscriptText: "",
    generatedNote: null,
    noteFormat: "clinical",
    durationSeconds: 0,
  };
}

export function saveSession(nextSession: SessionRecord) {
  if (!canUseStorage()) {
    return null;
  }

  const sessions = listSessions();
  const index = sessions.findIndex((session) => session.id === nextSession.id);

  const normalizedSession: SessionRecord = {
    ...nextSession,
    updatedAt: new Date().toISOString(),
    title: buildSessionTitle(nextSession.createdAt, nextSession.transcriptSegments),
  };

  if (index === -1) {
    sessions.push(normalizedSession);
  } else {
    sessions[index] = normalizedSession;
  }

  const sorted = sortSessions(sessions);
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sorted));
  notifySessionsChanged();
  return normalizedSession;
}

export function upsertSession(session: SessionRecord) {
  return saveSession(session);
}

export function deleteSession(sessionId: string) {
  if (!canUseStorage()) {
    return;
  }

  const sessions = listSessions().filter((session) => session.id !== sessionId);
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  notifySessionsChanged();
}

export function updateSessionTranscript(
  session: SessionRecord,
  transcriptSegments: TranscriptSegment[],
  durationSeconds: number,
) {
  return upsertSession({
    ...session,
    transcriptSegments,
    rawTranscriptText: transcriptSegments
      .filter((segment) => segment.isFinal)
      .map((segment) => segment.text)
      .join(" ")
      .trim(),
    durationSeconds,
  });
}

export function updateSessionNote(
  session: SessionRecord,
  generatedNote: GeneratedNote | null,
) {
  return upsertSession({
    ...session,
    generatedNote,
    noteFormat: generatedNote?.format ?? session.noteFormat,
  });
}

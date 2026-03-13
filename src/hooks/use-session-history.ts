"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createEmptySession,
  deleteSession,
  getSessionById,
  listSessions,
  upsertSession,
} from "@/lib/storage/local-session-store";
import { type SessionRecord } from "@/types/session";

function subscribe(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("doc-notes:sessions-changed", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("doc-notes:sessions-changed", handler);
  };
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const refresh = useCallback(() => {
    setSessions(listSessions());
  }, []);

  useEffect(() => {
    refresh();
    return subscribe(refresh);
  }, [refresh]);

  return {
    sessions,
    refresh,
    createSession() {
      const session = createEmptySession();
      upsertSession(session);
      return session;
    },
    getSession(sessionId: string) {
      return getSessionById(sessionId);
    },
    deleteSession(sessionId: string) {
      deleteSession(sessionId);
    },
  };
}

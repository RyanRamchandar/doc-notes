import { FileClock } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { SessionCard } from "@/components/session-card";
import { type SessionRecord } from "@/types/session";

export function SessionList({ sessions }: { sessions: SessionRecord[] }) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<FileClock className="size-6" />}
        title="No saved visits yet"
        description="Start a recording to create a local session. Sessions stay in this browser using local storage."
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}

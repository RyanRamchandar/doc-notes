import Link from "next/link";
import { ArrowRight, FileText, Mic } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NOTE_FORMAT_LABELS } from "@/lib/constants";
import { formatRelativeTime, formatSeconds } from "@/lib/utils";
import { type SessionRecord } from "@/types/session";

export function SessionCard({ session }: { session: SessionRecord }) {
  return (
    <Link href={`/sessions/${session.id}`} className="block">
      <Card className="overflow-hidden border border-slate-100 transition-all hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_50px_rgba(14,165,233,0.12)]">
        <div className="h-1.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400" />
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-base font-semibold text-slate-950">
                {session.title}
              </h3>
              <p className="text-sm text-slate-500">
                Updated {formatRelativeTime(session.updatedAt)}
              </p>
            </div>
            <ArrowRight className="mt-1 size-4 text-slate-400" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-sky-100 bg-sky-50 text-sky-700">
              <Mic className="mr-1 size-3" />
              {formatSeconds(session.durationSeconds)}
            </Badge>
            <Badge variant="outline">
              {session.transcriptSegments.filter((segment) => segment.isFinal).length} segments
            </Badge>
            {session.generatedNote ? (
              <Badge variant="default" className="from-indigo-500 via-sky-500 to-cyan-500">
                <FileText className="mr-1 size-3" />
                {NOTE_FORMAT_LABELS[session.generatedNote.format]}
              </Badge>
            ) : null}
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-600">
            {session.rawTranscriptText || "Transcript will appear here after recording starts."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

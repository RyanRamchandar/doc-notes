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
      <Card className="overflow-hidden border border-[#eadfd4] transition-all hover:-translate-y-1 hover:border-[#d7ede0] hover:shadow-[0_18px_50px_rgba(45,139,88,0.12)]">
        <div className="h-1.5 bg-gradient-to-r from-[#5b3440] via-[#8c4560] to-[#1ea24a]" />
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
            <ArrowRight className="mt-1 size-4 text-[#b19f96]" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-[#d7ede0] bg-[#edf8f1] text-[#2e8b57]">
              <Mic className="mr-1 size-3" />
              {formatSeconds(session.durationSeconds)}
            </Badge>
            <Badge variant="outline" className="border-[#e8ddd2] bg-[#fffaf6] text-[#8d7b76]">
              {session.transcriptSegments.filter((segment) => segment.isFinal).length} segments
            </Badge>
            {session.generatedNote ? (
              <Badge
                variant="default"
                className="bg-[#5b3440] text-white shadow-none hover:bg-[#4c2a35]"
              >
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

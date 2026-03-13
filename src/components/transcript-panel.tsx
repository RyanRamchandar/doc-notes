import { FileAudio } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TranscriptSegmentRow } from "@/components/transcript-segment-row";
import { type TranscriptSegment } from "@/types/transcript";

export function TranscriptPanel({ segments }: { segments: TranscriptSegment[] }) {
  if (segments.length === 0) {
    return (
      <EmptyState
        icon={<FileAudio className="size-6" />}
        title="Transcript will appear here"
        description="Start recording to see live interim and final transcript segments populate in real time."
      />
    );
  }

  return (
    <ScrollArea className="h-[480px] pr-4">
      <div className="space-y-3">
        {segments.map((segment) => (
          <TranscriptSegmentRow key={segment.id} segment={segment} />
        ))}
      </div>
    </ScrollArea>
  );
}

import { SpeakerChip } from "@/components/speaker-chip";
import { cn } from "@/lib/utils";
import { type TranscriptSegment } from "@/types/transcript";

export function TranscriptSegmentRow({ segment }: { segment: TranscriptSegment }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 transition-colors",
        segment.isFinal
          ? "border-slate-200 bg-white"
          : "border-dashed border-sky-200 bg-sky-50/70",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        {segment.speaker ? <SpeakerChip speaker={segment.speaker} /> : null}
        <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
          {segment.isFinal ? "Final" : "Interim"}
        </span>
      </div>
      <p
        className={cn(
          "text-sm leading-6 text-slate-700",
          !segment.isFinal && "italic text-slate-500",
        )}
      >
        {segment.text}
      </p>
    </div>
  );
}

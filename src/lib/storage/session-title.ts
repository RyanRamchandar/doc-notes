import { formatDateTime } from "@/lib/utils";
import { type TranscriptSegment } from "@/types/transcript";

export function buildSessionTitle(
  createdAt: string,
  transcriptSegments: TranscriptSegment[],
) {
  const firstLine = transcriptSegments
    .find((segment) => segment.isFinal && segment.text.trim().length > 0)
    ?.text.trim()
    .replace(/\s+/g, " ");

  const timestamp = formatDateTime(createdAt);

  if (!firstLine) {
    return `Visit · ${timestamp}`;
  }

  const truncated =
    firstLine.length > 56 ? `${firstLine.slice(0, 53).trimEnd()}…` : firstLine;

  return `${timestamp} · ${truncated}`;
}

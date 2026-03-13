import { type GeneratedNote, type NoteFormat } from "@/types/note";
import { type TranscriptSegment } from "@/types/transcript";

export type SessionRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  transcriptSegments: TranscriptSegment[];
  rawTranscriptText: string;
  generatedNote: GeneratedNote | null;
  noteFormat: NoteFormat;
  durationSeconds: number;
};

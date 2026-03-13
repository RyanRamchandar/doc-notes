export type TranscriptSegment = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  speaker: string | null;
  isFinal: boolean;
  confidence: number | null;
  createdAt: string;
  source: "browser" | "deepgram" | "mock";
};

export type TranscriptEvent =
  | {
      type: "segment";
      segment: TranscriptSegment;
    }
  | {
      type: "state";
      state:
        | "idle"
        | "connecting"
        | "recording"
        | "paused"
        | "stopped"
        | "error";
      message?: string;
    };

import { type TranscriptSegment } from "@/types/transcript";

export type LiveTranscriptionState =
  | "idle"
  | "connecting"
  | "recording"
  | "paused"
  | "stopped"
  | "error";

export type LiveTranscriptionCallbacks = {
  onSegment: (segment: TranscriptSegment) => void;
  onStateChange: (
    state: LiveTranscriptionState,
    message?: string,
  ) => void;
  onError: (error: Error) => void;
};

export interface LiveTranscriptionClient {
  start(): Promise<MediaStream>;
  pause(): void;
  resume(): void;
  stop(): void;
}

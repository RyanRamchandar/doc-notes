import { Badge } from "@/components/ui/badge";
import { type LiveTranscriptionState } from "@/lib/stt/types";

const stateMap: Record<
  LiveTranscriptionState,
  { label: string; variant: "default" | "success" | "warning" | "destructive" }
> = {
  idle: { label: "Ready", variant: "default" },
  connecting: { label: "Connecting", variant: "warning" },
  recording: { label: "Recording", variant: "success" },
  paused: { label: "Paused", variant: "warning" },
  stopped: { label: "Stopped", variant: "default" },
  error: { label: "Error", variant: "destructive" },
};

export function RecordingStatusBadge({ state }: { state: LiveTranscriptionState }) {
  const item = stateMap[state];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

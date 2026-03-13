import { Mic, Pause, Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type LiveTranscriptionState } from "@/lib/stt/types";

export function RecordingToolbar({
  state,
  onStart,
  onPause,
  onResume,
  onStop,
}: {
  state: LiveTranscriptionState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}) {
  const canStart = state === "idle" || state === "stopped";
  const canPause = state === "recording";
  const canResume = state === "paused";
  const canStop = state === "recording" || state === "paused" || state === "connecting";

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onStart} disabled={!canStart}>
        <Mic className="size-4" />
        Start
      </Button>
      <Button variant="secondary" onClick={onPause} disabled={!canPause}>
        <Pause className="size-4" />
        Pause
      </Button>
      <Button variant="outline" onClick={onResume} disabled={!canResume}>
        <Play className="size-4" />
        Resume
      </Button>
      <Button variant="outline" onClick={onStop} disabled={!canStop}>
        <Square className="size-4" />
        Stop
      </Button>
    </div>
  );
}

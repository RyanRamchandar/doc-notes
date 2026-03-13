"use client";

import Link from "next/link";
import { ChevronLeft, FileText, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { AudioLevelMeter } from "@/components/audio-level-meter";
import { ElapsedTimer } from "@/components/elapsed-timer";
import { ErrorAlert } from "@/components/error-alert";
import { LoadingState } from "@/components/loading-state";
import { NoteEditor } from "@/components/note-editor";
import { NoteFormatToggle } from "@/components/note-format-toggle";
import { RecordingStatusBadge } from "@/components/recording-status-badge";
import { RecordingToolbar } from "@/components/recording-toolbar";
import { TranscriptPanel } from "@/components/transcript-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAudioLevel } from "@/hooks/use-audio-level";
import { useScribeSession } from "@/hooks/use-scribe-session";

export function SessionWorkspace({ sessionId }: { sessionId: string }) {
  const {
    session,
    note,
    loading,
    error,
    setError,
    isGeneratingNote,
    elapsedSeconds,
    allSegments,
    recordingState,
    statusMessage,
    providerMode,
    stream,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    generateNote,
    updateNote,
    updateNoteFormat,
  } = useScribeSession(sessionId);
  const audioLevel = useAudioLevel(stream, recordingState === "recording");

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    toast.message(statusMessage);
  }, [statusMessage]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <LoadingState />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-8">
        <ErrorAlert
          title="Session not found"
          description="This local session could not be loaded. Return to the workspace and start a new recording."
        />
      </div>
    );
  }

  const handleGenerateNote = async () => {
    try {
      const generated = await generateNote(session.noteFormat);

      if (generated) {
        toast.success("Clinical note draft ready.");
      }
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate the note.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ChevronLeft className="size-4" />
            Back to workspace
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              {session.title}
            </h1>
            <p className="text-sm text-slate-500">
              Record, review the transcript, and draft the note from one workspace.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RecordingStatusBadge state={recordingState} />
          <Badge variant={providerMode === "mock" ? "warning" : "outline"}>
            {providerMode === "mock" ? "Demo STT mode" : "Deepgram live"}
          </Badge>
          {note ? <Badge variant="outline">{note.sections.length} note sections</Badge> : null}
        </div>
      </div>

      {error ? <ErrorAlert description={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Recording controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ElapsedTimer seconds={elapsedSeconds} />
            <RecordingToolbar
              state={recordingState}
              onStart={() => {
                setError("");
                void startRecording();
              }}
              onPause={pauseRecording}
              onResume={resumeRecording}
              onStop={stopRecording}
            />
            <AudioLevelMeter level={audioLevel} />
            <Separator />
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Note format
                </p>
                <NoteFormatToggle
                  value={session.noteFormat}
                  onValueChange={(format) => {
                    setError("");
                    updateNoteFormat(format);
                  }}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => void handleGenerateNote()}
                disabled={isGeneratingNote}
              >
                <Sparkles className="size-4" />
                {isGeneratingNote
                  ? "Generating draft…"
                  : note
                    ? "Regenerate note"
                    : "Generate note"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="min-h-[640px]">
            <CardHeader>
              <CardTitle>Live transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <TranscriptPanel segments={allSegments} />
            </CardContent>
          </Card>

          <Card className="min-h-[640px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5" />
                Structured note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NoteEditor
                note={note}
                sessionTitle={session.title}
                onChange={(nextNote) => updateNote(nextNote)}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

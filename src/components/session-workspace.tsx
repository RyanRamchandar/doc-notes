"use client";

import Link from "next/link";
import {
  Activity,
  ChevronLeft,
  FileText,
  Sparkles,
  Stethoscope,
  Waves,
} from "lucide-react";
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
      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_36%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-900"
            >
              <ChevronLeft className="size-4" />
              Back to workspace
            </Link>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="gap-1.5">
                  <Stethoscope className="size-3" />
                  Active scribe session
                </Badge>
                <Badge variant="outline" className="gap-1.5 border-cyan-100 bg-cyan-50 text-cyan-700">
                  <Activity className="size-3" />
                  Real-time draft workspace
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 lg:text-4xl">
                  {session.title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Record, review the transcript, and refine the note draft from one focused clinical workspace.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RecordingStatusBadge state={recordingState} />
            <Badge
              variant={providerMode === "mock" ? "warning" : "outline"}
              className={
                providerMode === "mock"
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }
            >
              {providerMode === "mock" ? "Demo STT mode" : "Deepgram live"}
            </Badge>
            {note ? (
              <Badge variant="outline" className="border-indigo-100 bg-indigo-50 text-indigo-700">
                {note.sections.length} note sections
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {error ? <ErrorAlert description={error} /> : null}

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="overflow-hidden border border-sky-100/80 bg-white/85">
          <div className="h-1.5 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Recording controls</CardTitle>
              <Badge variant="outline" className="border-sky-100 bg-sky-50 text-sky-700">
                <Waves className="mr-1 size-3" />
                Live capture
              </Badge>
            </div>
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
          <Card className="min-h-[640px] overflow-hidden border border-sky-100/80 bg-white/85">
            <div className="h-1.5 bg-gradient-to-r from-sky-400 to-cyan-500" />
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Live transcript</CardTitle>
                <Badge variant="outline" className="border-sky-100 bg-sky-50 text-sky-700">
                  {allSegments.length} entries
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <TranscriptPanel segments={allSegments} />
            </CardContent>
          </Card>

          <Card className="min-h-[640px] overflow-hidden border border-teal-100/80 bg-white/85">
            <div className="h-1.5 bg-gradient-to-r from-teal-400 to-indigo-500" />
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5 text-teal-600" />
                  Structured note
                </CardTitle>
                <Badge variant="outline" className="border-teal-100 bg-teal-50 text-teal-700">
                  {session.noteFormat === "soap" ? "SOAP" : "Clinical"}
                </Badge>
              </div>
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

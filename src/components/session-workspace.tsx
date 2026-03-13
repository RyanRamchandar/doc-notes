"use client";

import Link from "next/link";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Mic,
  Stethoscope,
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

  const primaryRecordingAction = () => {
    if (recordingState === "recording") {
      pauseRecording();
      return;
    }

    if (recordingState === "paused") {
      resumeRecording();
      return;
    }

    setError("");
    void startRecording();
  };

  const primaryRecordingLabel =
    recordingState === "recording"
      ? "Pause"
      : recordingState === "paused"
        ? "Resume"
        : "Transcribe";
  const providerLabel =
    providerMode === "mock"
      ? "Demo STT mode"
      : providerMode === "browser"
        ? "Browser STT fallback"
        : "Deepgram live";
  const providerSummaryLabel =
    providerMode === "mock"
      ? "Demo transcription"
      : providerMode === "browser"
        ? "Browser speech fallback"
        : "Deepgram live";

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-4 lg:px-6 lg:py-6">
      <section className="overflow-hidden rounded-[36px] border border-[#eadfd4] bg-[#fcfbf8] shadow-[0_20px_60px_rgba(85,61,54,0.08)]">
        <div className="border-b border-[#efe6de] px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#8d7b76]">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-medium transition hover:text-[#4c3137]"
                >
                  <ChevronLeft className="size-4" />
                  Workspace
                </Link>
                <ChevronRight className="size-4" />
                <span className="truncate">{session.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-[#edd9df] bg-[#f7e9ef] text-[#784351]">
                  <Stethoscope className="mr-1 size-3" />
                  {session.noteFormat === "soap" ? "SOAP note" : "Clinical note"}
                </Badge>
                <Badge className="border-[#d8eee2] bg-[#edf8f1] text-[#2e8b57]">
                  <Activity className="mr-1 size-3" />
                  {recordingState === "recording"
                    ? "Recording"
                    : recordingState === "paused"
                      ? "Paused"
                      : "Ready"}
                </Badge>
                <Badge variant="outline" className="border-[#e8ddd2] bg-white text-[#8d7b76]">
                  {elapsedSeconds.toString().padStart(2, "0")}s elapsed
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <RecordingStatusBadge state={recordingState} />
              <Badge
                variant={providerMode === "deepgram" ? "outline" : "warning"}
                className={
                  providerMode === "deepgram"
                    ? "border-[#d8eee2] bg-[#edf8f1] text-[#2e8b57]"
                    : providerMode === "browser"
                      ? "border-sky-200 bg-sky-50 text-sky-700"
                      : "border-amber-200 bg-amber-50"
                }
              >
                {providerLabel}
              </Badge>
              <Button
                className="rounded-2xl bg-[#1ea24a] px-5 text-white shadow-none hover:bg-[#18833c]"
                onClick={primaryRecordingAction}
              >
                <Mic className="size-4" />
                {primaryRecordingLabel}
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl border-[#d9cfbf] bg-white px-4 text-[#4c3137]"
                onClick={() => {
                  if (recordingState === "recording" || recordingState === "paused") {
                    stopRecording();
                  } else {
                    void handleGenerateNote();
                  }
                }}
              >
                {recordingState === "recording" || recordingState === "paused"
                  ? "Stop"
                  : "Generate"}
              </Button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="px-6 pt-6 lg:px-8">
            <ErrorAlert description={error} />
          </div>
        ) : null}

        <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:p-8">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] border border-[#eadfd4] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#efe6de] px-6 py-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b19f96]">
                    Draft output
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-[#1f1820]">
                    {session.title}
                  </h1>
                </div>
                <NoteFormatToggle
                  value={session.noteFormat}
                  onValueChange={(format) => {
                    setError("");
                    updateNoteFormat(format);
                  }}
                />
              </div>

              <div className="px-6 py-6">
                <NoteEditor
                  note={note}
                  sessionTitle={session.title}
                  onChange={(nextNote) => updateNote(nextNote)}
                />
              </div>
            </div>

            <Card className="border border-[#eadfd4] bg-[#fffdfa]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Session context</CardTitle>
                  <Badge variant="outline" className="border-[#e8ddd2] bg-white text-[#8d7b76]">
                    {allSegments.length} transcript entries
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {[
                  {
                    label: "Recording mode",
                    value: providerSummaryLabel,
                  },
                  {
                    label: "Current note style",
                    value: session.noteFormat === "soap" ? "SOAP note" : "Clinical note",
                  },
                  {
                    label: "Saved locally",
                    value: "Browser storage only",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-[#efe6de] bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-[#b19f96]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#201a19]">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden border border-[#eadfd4] bg-white">
              <div className="h-1.5 bg-[#1ea24a]" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Transcribe</CardTitle>
                  <Badge variant="outline" className="border-[#d8eee2] bg-[#edf8f1] text-[#2e8b57]">
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
                  <p className="text-sm leading-6 text-[#726562]">
                    Keep the visit running here while the main canvas stays focused
                    on the note.
                  </p>
                  <Button
                    className="w-full rounded-2xl bg-[#1ea24a] text-white shadow-none hover:bg-[#18833c]"
                    onClick={() => void handleGenerateNote()}
                    disabled={isGeneratingNote}
                  >
                    {isGeneratingNote
                      ? "Generating draft…"
                      : note
                        ? "Refresh note draft"
                        : "Generate note"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-[#eadfd4] bg-white">
              <div className="h-1.5 bg-[#5b3440]" />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Transcript</CardTitle>
                  <Badge variant="outline" className="border-[#e8ddd2] bg-white text-[#8d7b76]">
                    Live feed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <TranscriptPanel segments={allSegments} />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

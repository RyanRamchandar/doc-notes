"use client";

import {
  ChevronRight,
  Clock3,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Waves,
} from "lucide-react";

import { NewSessionButton } from "@/components/new-session-button";
import { SessionList } from "@/components/session-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionHistory } from "@/hooks/use-session-history";

export function WorkspaceHome() {
  const { sessions } = useSessionHistory();

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-4 lg:px-6 lg:py-6">
      <section className="overflow-hidden rounded-[36px] border border-[#eadfd4] bg-[#fcfbf8] shadow-[0_20px_60px_rgba(85,61,54,0.08)]">
        <div className="border-b border-[#efe6de] px-6 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#8d7b76]">
                <span>Doc Notes</span>
                <ChevronRight className="size-4" />
                <span>Workspace</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-[#edd9df] bg-[#f7e9ef] text-[#784351]">
                  AI scribe
                </Badge>
                <Badge className="border-[#d7ede0] bg-[#ecf7f0] text-[#2f8b58]">
                  Local prototype
                </Badge>
              </div>
            </div>
            <NewSessionButton />
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.45fr)_360px] lg:p-8">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[32px] border border-[#eadfd4] bg-[linear-gradient(135deg,#fffdf9,rgba(239,247,241,0.95))] p-7 lg:p-8">
              <div className="pointer-events-none absolute -right-10 top-8 size-48 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14),transparent_68%)]" />
              <div className="pointer-events-none absolute -left-10 bottom-0 size-40 rounded-full bg-[radial-gradient(circle,rgba(91,52,64,0.12),transparent_68%)]" />
              <div className="relative space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-[#eadfd4] bg-white text-[#5b3440]">
                    Clinical scribe workspace
                  </Badge>
                  <Badge className="border-[#d7ede0] bg-[#f1faf4] text-[#2f8b58]">
                    Fast capture → refine → export
                  </Badge>
                </div>
                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#1f1820] lg:text-6xl">
                    A spacious scribe workspace built for fast chart drafting.
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-[#6e5e5a] lg:text-lg">
                    Start a visit, watch the transcript build in real time, then shape
                    a structured clinical note in a calmer, document-first workspace.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      icon: <Mic className="size-4" />,
                      value: "Transcribe",
                      label: "Browser mic capture with live STT and fallback demo mode.",
                    },
                    {
                      icon: <Sparkles className="size-4" />,
                      value: "Draft",
                      label: "Generate structured Clinical or SOAP notes from transcript.",
                    },
                    {
                      icon: <ShieldCheck className="size-4" />,
                      value: "Refine",
                      label: "Edit, copy, and export notes without needing a backend.",
                    },
                  ].map((item) => (
                    <div
                      key={item.value}
                      className="rounded-[28px] border border-[#ece3da] bg-white/85 p-4 shadow-sm"
                    >
                      <div className="mb-3 inline-flex rounded-2xl bg-[#f7efe9] p-2 text-[#5b3440]">
                        {item.icon}
                      </div>
                      <p className="text-sm font-semibold text-[#201a19]">{item.value}</p>
                      <p className="mt-1 text-sm leading-6 text-[#726562]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4 text-[#2f8b58]" />
                    <p className="text-sm font-medium text-[#2f8b58]">Recent local sessions</p>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1f1820]">
                    Pick up a note where you left off
                  </h2>
                </div>
                <div className="hidden rounded-2xl border border-[#eadfd4] bg-white px-4 py-3 text-right shadow-sm md:block">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#b19f96]">
                    Saved locally
                  </p>
                  <p className="text-lg font-semibold text-[#201a19]">{sessions.length}</p>
                </div>
              </div>
              <p className="text-sm text-[#7a6d69]">
                Sessions stay in this browser using local storage only.
              </p>
              <SessionList sessions={sessions} />
            </div>
          </div>

          <div className="space-y-4">
            <Card className="border border-[#eadfd4] bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Prototype priorities</CardTitle>
                  <Badge variant="outline" className="border-[#e8ddd2] bg-[#fffaf6] text-[#8d7b76]">
                    Doc Notes MVP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: <Mic className="size-4" />,
                    title: "Real-time capture",
                    copy: "Stream browser microphone audio into a live transcript with interim and final states.",
                    tone: "bg-[#eef6ff] text-[#3476c7]",
                  },
                  {
                    icon: <Stethoscope className="size-4" />,
                    title: "Template-ready drafting",
                    copy: "Create SOAP or clinical notes in a roomy editor that feels closer to a document canvas.",
                    tone: "bg-[#f7e9ef] text-[#8c4560]",
                  },
                  {
                    icon: <Waves className="size-4" />,
                    title: "Frictionless demo mode",
                    copy: "If provider keys are absent, transcription and note generation fall back so the workflow still demos cleanly.",
                    tone: "bg-[#ecf7f0] text-[#2f8b58]",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-[#efe6de] bg-[#fffdfa] p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`inline-flex rounded-2xl p-2 ${item.tone}`}>
                        {item.icon}
                      </div>
                      <div className="text-sm font-medium text-[#201a19]">{item.title}</div>
                    </div>
                    <p className="text-sm leading-6 text-[#726562]">{item.copy}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

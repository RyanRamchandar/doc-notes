"use client";

import { Clock3, Mic, ShieldCheck, Sparkles, Stethoscope, Waves } from "lucide-react";

import { NewSessionButton } from "@/components/new-session-button";
import { SessionList } from "@/components/session-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionHistory } from "@/hooks/use-session-history";

export function WorkspaceHome() {
  const { sessions } = useSessionHistory();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <Card className="relative overflow-hidden border-0 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.34),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.3),transparent_24%),linear-gradient(140deg,rgba(2,6,23,0.94),rgba(15,23,42,0.98))]" />
          <div className="pointer-events-none absolute -right-12 top-8 size-44 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          <CardContent className="relative flex h-full flex-col justify-between gap-10 p-8 lg:p-10">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/10 bg-white/10 text-white">
                  Clinical scribe workspace
                </Badge>
                <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                  Light, fast, demo-ready
                </Badge>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance lg:text-5xl">
                  Capture the visit, draft the note, and keep everything local.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-200">
                  Record patient conversations from the browser, follow the live
                  transcript, then generate an editable clinical note or SOAP draft.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: <Mic className="size-4" />,
                    value: "Live STT",
                    label: "Deepgram-compatible recording",
                  },
                  {
                    icon: <Sparkles className="size-4" />,
                    value: "Clinical + SOAP",
                    label: "Structured note generation",
                  },
                  {
                    icon: <ShieldCheck className="size-4" />,
                    value: "Local first",
                    label: "Browser session history",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-white/10 p-2 text-cyan-100">
                      {item.icon}
                    </div>
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <NewSessionButton />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-sky-100/70 bg-white/85">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Prototype priorities</CardTitle>
              <Badge variant="outline">Doc Notes MVP</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: <Mic className="size-4" />,
                title: "Real-time capture",
                copy: "Stream browser microphone audio into a live transcript with interim and final states.",
                tint: "bg-sky-50 text-sky-700 ring-sky-100",
              },
              {
                icon: <Stethoscope className="size-4" />,
                title: "Clinical note generation",
                copy: "Generate structured chart-ready drafts grounded only in the transcript.",
                tint: "bg-teal-50 text-teal-700 ring-teal-100",
              },
              {
                icon: <ShieldCheck className="size-4" />,
                title: "Replaceable provider layer",
                copy: "Deepgram and OpenRouter stay behind thin service boundaries for easy swapping later.",
                tint: "bg-indigo-50 text-indigo-700 ring-indigo-100",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`inline-flex rounded-2xl p-2 ring-1 ${item.tint}`}>
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium text-slate-900">{item.title}</div>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.copy}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-gradient-to-r from-sky-50 to-cyan-50 p-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-2xl bg-white p-2 text-sky-700 shadow-sm">
                  <Waves className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Fast path to demo</p>
                  <p className="text-sm leading-6 text-slate-600">
                    Missing provider keys automatically drop into demo mode so the
                    product can still be shown end-to-end.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-sky-600" />
              <p className="text-sm font-medium text-sky-700">Recent local sessions</p>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Pick up a visit where you left off
            </h2>
          </div>
          <div className="hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-right shadow-sm md:block">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Saved locally</p>
            <p className="text-lg font-semibold text-slate-950">{sessions.length}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500">
            Sessions stay in this browser using local storage only.
          </p>
        </div>
        <SessionList sessions={sessions} />
      </section>
    </div>
  );
}

"use client";

import { Mic, ShieldCheck, Stethoscope } from "lucide-react";

import { NewSessionButton } from "@/components/new-session-button";
import { SessionList } from "@/components/session-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionHistory } from "@/hooks/use-session-history";

export function WorkspaceHome() {
  const { sessions } = useSessionHistory();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card className="border-slate-950 bg-slate-950 text-white">
          <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">
                Clinical scribe workspace
              </p>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight">
                  Capture the visit, draft the note, and keep everything local.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  Record patient conversations from the browser, follow the live
                  transcript, then generate an editable clinical note or SOAP draft.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <NewSessionButton />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prototype priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: <Mic className="size-4" />,
                title: "Real-time capture",
                copy: "Stream browser microphone audio into a live transcript with interim and final states.",
              },
              {
                icon: <Stethoscope className="size-4" />,
                title: "Clinical note generation",
                copy: "Generate structured chart-ready drafts grounded only in the transcript.",
              },
              {
                icon: <ShieldCheck className="size-4" />,
                title: "Replaceable provider layer",
                copy: "Deepgram and OpenRouter stay behind thin service boundaries for easy swapping later.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-900">
                  {item.icon}
                  {item.title}
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.copy}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Recent local sessions</h2>
            <p className="text-sm text-slate-500">
              Sessions stay in this browser using local storage only.
            </p>
          </div>
        </div>
        <SessionList sessions={sessions} />
      </section>
    </div>
  );
}

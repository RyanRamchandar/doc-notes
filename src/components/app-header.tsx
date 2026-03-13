import Link from "next/link";
import { ActivitySquare, Sparkles } from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500 text-white shadow-[0_12px_32px_rgba(14,165,233,0.24)]">
              <ActivitySquare className="size-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-semibold tracking-tight text-slate-950">
                {APP_NAME}
              </div>
              <p className="text-sm text-slate-500">
                Fast clinical scribe prototype for live capture and note drafting.
              </p>
            </div>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Badge className="gap-1.5">
            <Sparkles className="size-3" />
            Clarafi-inspired workflow
          </Badge>
        </div>
      </div>
    </header>
  );
}

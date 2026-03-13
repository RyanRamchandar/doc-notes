import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="space-y-1">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-950">
            {APP_NAME}
          </Link>
          <p className="text-sm text-slate-500">
            Fast clinical scribe prototype for live capture and note drafting.
          </p>
        </div>
      </div>
    </header>
  );
}

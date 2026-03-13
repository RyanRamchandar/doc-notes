import Link from "next/link";
import { ActivitySquare } from "lucide-react";

import { APP_NAME } from "@/lib/constants";

export function AppHeader() {
  return (
    <header className="border-b border-[#ece4db] bg-[#f7f1ea]">
      <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl border border-[#e5d8c7] bg-white text-[#4c3137] shadow-sm">
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
      </div>
    </header>
  );
}

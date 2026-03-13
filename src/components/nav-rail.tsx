"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Clock3,
  FilePenLine,
  Home,
  Plus,
  Settings2,
  Sparkles,
  Waves,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSessionHistory } from "@/hooks/use-session-history";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Workspace", match: (path: string) => path === "/" },
  {
    href: "/",
    icon: FilePenLine,
    label: "Sessions",
    match: (path: string) => path.startsWith("/sessions/"),
  },
  { href: "/", icon: Clock3, label: "History", match: (path: string) => path === "/" },
];

export function NavRail() {
  const pathname = usePathname();
  const router = useRouter();
  const { createSession } = useSessionHistory();

  return (
    <aside className="hidden min-h-screen w-[92px] shrink-0 border-r border-[#ece4db] bg-[#f7f1ea] px-4 py-5 lg:flex lg:flex-col lg:items-center lg:justify-between">
      <div className="flex flex-col items-center gap-5">
        <Link
          href="/"
          className="flex size-12 items-center justify-center rounded-2xl border border-[#e5d8c7] bg-white text-[#4c3137] shadow-sm"
        >
          <Waves className="size-5" />
        </Link>

        <Button
          size="icon"
          className="h-12 w-12 rounded-2xl bg-[#5b3440] text-white shadow-none hover:bg-[#4c2a35]"
          onClick={() => {
            const session = createSession();
            router.push(`/sessions/${session.id}`);
          }}
        >
          <Plus className="size-5" />
        </Button>

        <div className="mt-2 flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex size-12 items-center justify-center rounded-2xl transition-colors",
                  active
                    ? "bg-white text-[#4c3137] shadow-sm ring-1 ring-[#eadfd4]"
                    : "text-[#8d7b76] hover:bg-white hover:text-[#4c3137]",
                )}
                aria-label={item.label}
                title={item.label}
              >
                <Icon className="size-5" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Badge className="rotate-[-90deg] rounded-full border-[#d8eee2] bg-[#edf8f1] px-3 py-1 text-[#2e8b57] shadow-none">
          Doc Notes
        </Badge>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-2xl text-[#8d7b76] transition-colors hover:bg-white hover:text-[#4c3137]"
          aria-label="Settings"
          title="Settings"
        >
          <Settings2 className="size-5" />
        </button>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-2xl text-[#8d7b76] transition-colors hover:bg-white hover:text-[#4c3137]"
          aria-label="Enhancements"
          title="Enhancements"
        >
          <Sparkles className="size-5" />
        </button>
      </div>
    </aside>
  );
}

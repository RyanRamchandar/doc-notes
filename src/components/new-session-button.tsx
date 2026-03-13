"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSessionHistory } from "@/hooks/use-session-history";

export function NewSessionButton() {
  const router = useRouter();
  const { createSession } = useSessionHistory();

  return (
    <Button
      size="lg"
      className="rounded-2xl bg-[#1ea24a] text-white shadow-none hover:bg-[#18833c]"
      onClick={() => {
        const session = createSession();
        router.push(`/sessions/${session.id}`);
      }}
    >
      <Plus className="size-4" />
      Start new recording
    </Button>
  );
}

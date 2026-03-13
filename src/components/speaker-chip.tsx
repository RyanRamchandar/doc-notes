import { Badge } from "@/components/ui/badge";

export function SpeakerChip({ speaker }: { speaker: string }) {
  return <Badge variant="outline">{speaker}</Badge>;
}

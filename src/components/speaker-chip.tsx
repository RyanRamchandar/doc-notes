import { Badge } from "@/components/ui/badge";

export function SpeakerChip({ speaker }: { speaker: string }) {
  return (
    <Badge variant="outline" className="border-sky-100 bg-white text-sky-700">
      {speaker}
    </Badge>
  );
}

import { Badge } from "@/components/ui/badge";

export function SpeakerChip({ speaker }: { speaker: string }) {
  return (
    <Badge variant="outline" className="border-[#e8ddd2] bg-[#fffaf6] text-[#784351]">
      {speaker}
    </Badge>
  );
}

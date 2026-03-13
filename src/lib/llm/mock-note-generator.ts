import { getSectionTemplate } from "@/lib/llm/prompts";
import { type GeneratedNote } from "@/types/note";

export function createMockNote(
  format: GeneratedNote["format"],
  transcript: string,
): GeneratedNote {
  const excerpt = transcript.trim()
    ? transcript.trim()
    : "No visit transcript was available, so this draft is intentionally minimal.";

  return {
    format,
    generatedAt: new Date().toISOString(),
    sections: getSectionTemplate(format).map((section, index) => ({
      key: section.key,
      label: section.label,
      content:
        index === 0
          ? excerpt
          : "Prototype draft generated in demo mode. Replace with visit-specific documentation as needed.",
    })),
  };
}

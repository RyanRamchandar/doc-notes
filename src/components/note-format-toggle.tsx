"use client";

import { NOTE_FORMAT_LABELS } from "@/lib/constants";
import { type NoteFormat } from "@/types/note";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formats: NoteFormat[] = ["clinical", "soap"];

export function NoteFormatToggle({
  value,
  onValueChange,
}: {
  value: NoteFormat;
  onValueChange: (value: NoteFormat) => void;
}) {
  return (
    <Tabs
      value={formats.includes(value) ? value : "clinical"}
      onValueChange={(nextValue) => onValueChange(nextValue as NoteFormat)}
    >
      <TabsList>
        {formats.map((format) => (
          <TabsTrigger key={format} value={format}>
            {NOTE_FORMAT_LABELS[format]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

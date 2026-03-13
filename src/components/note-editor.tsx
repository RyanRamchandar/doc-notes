"use client";

import { FileText } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { ExportActions } from "@/components/export-actions";
import { Textarea } from "@/components/ui/textarea";
import { type GeneratedNote } from "@/types/note";

export function NoteEditor({
  note,
  sessionTitle,
  onChange,
}: {
  note: GeneratedNote | null;
  sessionTitle: string;
  onChange: (note: GeneratedNote) => void;
}) {
  if (!note) {
    return (
      <EmptyState
        icon={<FileText className="size-6" />}
        title="No note generated yet"
        description="Generate a Clinical Note or SOAP Note after recording to create an editable draft."
      />
    );
  }

  return (
    <div className="space-y-6">
      <ExportActions note={note} sessionTitle={sessionTitle} />
      <div className="space-y-4">
        {note.sections.map((section) => (
          <div key={section.key} className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{section.label}</label>
            <Textarea
              value={section.content}
              onChange={(event) =>
                onChange({
                  ...note,
                  sections: note.sections.map((currentSection) =>
                    currentSection.key === section.key
                      ? { ...currentSection, content: event.target.value }
                      : currentSection,
                  ),
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

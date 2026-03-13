"use client";

import { Check, Clipboard, Download } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { downloadTextFile } from "@/lib/utils";
import { type GeneratedNote } from "@/types/note";

function formatPlainText(note: GeneratedNote) {
  return note.sections
    .map((section) => `${section.label}\n${section.content}`)
    .join("\n\n")
    .trim();
}

function formatMarkdown(note: GeneratedNote) {
  return note.sections
    .map((section) => `## ${section.label}\n\n${section.content}`)
    .join("\n\n")
    .trim();
}

export function ExportActions({
  note,
  sessionTitle,
}: {
  note: GeneratedNote;
  sessionTitle: string;
}) {
  const [copied, setCopied] = useState(false);
  const slug = sessionTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatPlainText(note));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={handleCopy}>
        {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
        {copied ? "Copied" : "Copy note"}
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadTextFile(`${slug || "doc-notes"}.txt`, formatPlainText(note), "text/plain")
        }
      >
        <Download className="size-4" />
        Export .txt
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          downloadTextFile(`${slug || "doc-notes"}.md`, formatMarkdown(note), "text/markdown")
        }
      >
        <Download className="size-4" />
        Export .md
      </Button>
    </div>
  );
}

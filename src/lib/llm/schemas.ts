import { type NoteFormat } from "@/types/note";

export function getResponseSchema(format: NoteFormat) {
  return {
    name: `doc_notes_${format}`,
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        format: {
          type: "string",
          enum: [format],
        },
        sections: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              key: { type: "string" },
              label: { type: "string" },
              content: { type: "string" },
            },
            required: ["key", "label", "content"],
          },
        },
      },
      required: ["format", "sections"],
    },
  };
}

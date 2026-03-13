import { z } from "zod";

export const noteSectionSchema = z.object({
  key: z.string(),
  label: z.string(),
  content: z.string(),
});

export const generatedNoteSchema = z.object({
  format: z.enum(["clinical", "soap", "patientSummary"]),
  sections: z.array(noteSectionSchema),
});

export type GeneratedNotePayload = z.infer<typeof generatedNoteSchema>;

import { type NoteFormat } from "@/types/note";

export const APP_NAME = "Doc Notes";
export const SESSION_STORAGE_KEY = "doc-notes.sessions.v1";
export const DEFAULT_OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
export const DEEPGRAM_MODEL = "nova-3";
export const NOTE_FORMAT_LABELS: Record<NoteFormat, string> = {
  clinical: "Clinical Note",
  soap: "SOAP Note",
  patientSummary: "Patient Summary",
};

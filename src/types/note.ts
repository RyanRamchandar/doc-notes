export type NoteFormat = "clinical" | "soap" | "patientSummary";

export type NoteSection = {
  key: string;
  label: string;
  content: string;
};

export type GeneratedNote = {
  format: NoteFormat;
  sections: NoteSection[];
  generatedAt: string;
};

export type NoteGenerationRequest = {
  format: NoteFormat;
  transcript: string;
};

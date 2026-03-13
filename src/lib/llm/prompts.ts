import { type NoteFormat, type NoteSection } from "@/types/note";

const clinicalSections: Array<Pick<NoteSection, "key" | "label">> = [
  { key: "chiefComplaint", label: "Chief Complaint" },
  { key: "hpi", label: "HPI" },
  { key: "relevantHistory", label: "Relevant History" },
  { key: "reviewOfSymptoms", label: "Review of Symptoms" },
  { key: "assessment", label: "Assessment" },
  { key: "plan", label: "Plan" },
  { key: "followUp", label: "Follow-up / Patient Instructions" },
];

const soapSections: Array<Pick<NoteSection, "key" | "label">> = [
  { key: "subjective", label: "Subjective" },
  { key: "objective", label: "Objective" },
  { key: "assessment", label: "Assessment" },
  { key: "plan", label: "Plan" },
];

const patientSummarySections: Array<Pick<NoteSection, "key" | "label">> = [
  { key: "summary", label: "Visit Summary" },
  { key: "nextSteps", label: "Next Steps" },
  { key: "warningSigns", label: "When to Seek Care" },
];

export function getSectionTemplate(format: NoteFormat) {
  switch (format) {
    case "soap":
      return soapSections;
    case "patientSummary":
      return patientSummarySections;
    case "clinical":
    default:
      return clinicalSections;
  }
}

export function buildSystemPrompt(format: NoteFormat) {
  const sectionTemplate = getSectionTemplate(format)
    .map((section) => `${section.label} (${section.key})`)
    .join(", ");

  return [
    "You are a clinical documentation assistant creating a draft note from a visit transcript.",
    "Use only information explicitly stated in the transcript.",
    "Do not invent symptoms, diagnoses, medications, vitals, exam findings, or history.",
    "If information is uncertain or incomplete, state that clearly.",
    "Preserve medically relevant negatives when they are clearly stated.",
    "Remove filler, false starts, and conversational fluff.",
    "Use concise professional chart-ready language.",
    "Do not overstate assessment or make unsupported diagnosis claims.",
    `Return JSON only, with sections for: ${sectionTemplate}.`,
    "Keep each section useful but concise. Empty or unsupported sections should say 'Not clearly discussed.'",
  ].join(" ");
}

export function buildUserPrompt(format: NoteFormat, transcript: string) {
  return [
    `Requested note format: ${format}.`,
    "Create a draft clinical note using only the transcript below.",
    "Transcript:",
    transcript,
  ].join("\n\n");
}

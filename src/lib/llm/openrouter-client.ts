import { DEFAULT_OPENROUTER_MODEL } from "@/lib/constants";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/llm/prompts";
import { getResponseSchema } from "@/lib/llm/schemas";
import { generatedNoteSchema } from "@/lib/llm/types";
import { type NoteFormat } from "@/types/note";

export async function generateNoteWithOpenRouter(
  format: NoteFormat,
  transcript: string,
) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is not configured.");
  }

  console.info("[api] Calling OpenRouter note generation with server API key.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://doc-notes.local",
      "X-Title": "Doc Notes",
    },
    body: JSON.stringify({
      model: DEFAULT_OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(format),
        },
        {
          role: "user",
          content: buildUserPrompt(format, transcript),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: getResponseSchema(format),
      },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `OpenRouter request failed (${response.status}): ${detail || "Unknown error"}`,
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned an empty completion.");
  }

  const parsed = JSON.parse(content) as unknown;
  return generatedNoteSchema.parse(parsed);
}

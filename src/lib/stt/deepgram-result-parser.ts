import type { TranscriptSegment } from "../../types/transcript";

type DeepgramWord = {
  word?: string;
  punctuated_word?: string;
  start: number;
  end: number;
  speaker?: number;
  confidence?: number;
};

export type DeepgramResultMessage = {
  type?: "Results" | "UtteranceEnd" | "SpeechStarted";
  is_final?: boolean;
  start?: number;
  duration?: number;
  channel?: {
    alternatives?: Array<{
      transcript?: string;
      confidence?: number;
      words?: DeepgramWord[];
    }>;
  };
};

type SegmentIdFactory = () => string;
type SpeakerRun = {
  speaker: number;
  words: DeepgramWord[];
};

function hasSpeaker(word: DeepgramWord): word is DeepgramWord & { speaker: number } {
  return typeof word.speaker === "number";
}

function formatSpeakerLabel(speaker: number) {
  return `Speaker ${speaker + 1}`;
}

function getPrimarySpeaker(words: DeepgramWord[]) {
  const counts = new Map<number, number>();
  const order: number[] = [];

  for (const word of words) {
    if (!hasSpeaker(word)) {
      continue;
    }

    if (!counts.has(word.speaker)) {
      counts.set(word.speaker, 0);
      order.push(word.speaker);
    }

    counts.set(word.speaker, (counts.get(word.speaker) ?? 0) + 1);
  }

  let selectedSpeaker: number | null = null;
  let selectedCount = -1;

  for (const speaker of order) {
    const count = counts.get(speaker) ?? 0;

    if (count > selectedCount) {
      selectedSpeaker = speaker;
      selectedCount = count;
    }
  }

  return selectedSpeaker;
}

function getWordText(word: DeepgramWord) {
  return (word.punctuated_word ?? word.word ?? "").trim();
}

function wordsToTranscript(words: DeepgramWord[], fallbackTranscript: string) {
  const text = words
    .map(getWordText)
    .filter(Boolean)
    .join(" ")
    .trim();

  return text || fallbackTranscript.trim();
}

function groupWordsBySpeaker(words: DeepgramWord[]) {
  const runs: SpeakerRun[] = [];
  const leadingWords: DeepgramWord[] = [];

  for (const word of words) {
    const lastRun = runs[runs.length - 1];

    if (!hasSpeaker(word)) {
      if (lastRun) {
        lastRun.words.push(word);
      } else {
        leadingWords.push(word);
      }
      continue;
    }

    if (!lastRun) {
      runs.push({
        speaker: word.speaker,
        words: [...leadingWords, word],
      });
      leadingWords.length = 0;
      continue;
    }

    if (lastRun.speaker === word.speaker) {
      lastRun.words.push(word);
      continue;
    }

    runs.push({
      speaker: word.speaker,
      words: [word],
    });
  }

  return runs;
}

function createTranscriptSegment(
  message: DeepgramResultMessage,
  transcript: string,
  confidence: number | null,
  words: DeepgramWord[],
  speaker: number | null,
  createSegmentId: SegmentIdFactory,
): TranscriptSegment {
  const firstWord = words[0];
  const lastWord = words[words.length - 1];

  return {
    id: createSegmentId(),
    text: transcript,
    startMs: Math.round((firstWord?.start ?? message.start ?? 0) * 1000),
    endMs: Math.round(
      (lastWord?.end ?? (message.start ?? 0) + (message.duration ?? 0)) * 1000,
    ),
    speaker: speaker === null ? null : formatSpeakerLabel(speaker),
    isFinal: Boolean(message.is_final),
    confidence,
    createdAt: new Date().toISOString(),
    source: "deepgram",
  };
}

export function toTranscriptSegments(
  message: DeepgramResultMessage,
  createSegmentId: SegmentIdFactory = () => crypto.randomUUID(),
) {
  const alternative = message.channel?.alternatives?.[0];
  const transcript = alternative?.transcript?.trim();

  if (!transcript) {
    return [] as TranscriptSegment[];
  }

  const words = alternative?.words ?? [];
  const confidence = alternative?.confidence ?? null;

  if (!message.is_final) {
    return [
      createTranscriptSegment(
        message,
        transcript,
        confidence,
        words,
        getPrimarySpeaker(words),
        createSegmentId,
      ),
    ];
  }

  const speakerRuns = groupWordsBySpeaker(words);

  if (speakerRuns.length < 2) {
    return [
      createTranscriptSegment(
        message,
        transcript,
        confidence,
        words,
        getPrimarySpeaker(words),
        createSegmentId,
      ),
    ];
  }

  return speakerRuns.map((run) =>
    createTranscriptSegment(
      message,
      wordsToTranscript(run.words, transcript),
      confidence,
      run.words,
      run.speaker,
      createSegmentId,
    ),
  );
}

"use client";

import { createId } from "@/lib/utils";
import {
  type LiveTranscriptionCallbacks,
  type LiveTranscriptionClient,
} from "@/lib/stt/types";

type BrowserSpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

type BrowserSpeechRecognitionResult = {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
};

type BrowserSpeechRecognitionResultList = {
  length: number;
  [index: number]: BrowserSpeechRecognitionResult;
};

type BrowserSpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: BrowserSpeechRecognitionResultList;
};

type BrowserSpeechRecognitionErrorEvent = Event & {
  error: string;
  message?: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((event: Event) => void) | null;
  onerror: ((event: BrowserSpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type BrowserSpeechWindow = Window & {
  SpeechRecognition?: BrowserSpeechRecognitionConstructor;
  webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
};

function getRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as BrowserSpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function getRecognitionErrorMessage(event: BrowserSpeechRecognitionErrorEvent) {
  switch (event.error) {
    case "audio-capture":
      return "Browser speech recognition could not access audio input.";
    case "language-not-supported":
      return "Browser speech recognition does not support the selected language.";
    case "network":
      return "Browser speech recognition is unavailable.";
    case "not-allowed":
    case "service-not-allowed":
      return "Browser speech recognition permission was denied.";
    default:
      return event.message?.trim() || "Browser speech recognition failed.";
  }
}

export class BrowserSpeechClient implements LiveTranscriptionClient {
  private readonly callbacks: LiveTranscriptionCallbacks;
  private recognition: BrowserSpeechRecognition | null = null;
  private stream: MediaStream | null = null;
  private shouldContinue = false;
  private isPaused = false;
  private startupCompleted = false;
  private lastFinalEndMs = 0;
  private sessionStartedAtMs = 0;

  constructor(callbacks: LiveTranscriptionCallbacks) {
    this.callbacks = callbacks;
  }

  async start() {
    const RecognitionCtor = getRecognitionConstructor();

    if (!RecognitionCtor) {
      throw new Error("Browser speech recognition is not supported in this browser.");
    }

    this.callbacks.onStateChange("connecting");
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.shouldContinue = true;
    this.isPaused = false;
    this.startupCompleted = false;
    this.lastFinalEndMs = 0;
    this.sessionStartedAtMs = Date.now();
    this.recognition = new RecognitionCtor();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.bindRecognitionHandlers();

    try {
      this.recognition.start();
    } catch (error) {
      this.cleanup();
      throw error instanceof Error
        ? error
        : new Error("Browser speech recognition could not start.");
    }

    this.callbacks.onStateChange("recording", "Using browser speech recognition fallback.");
    return this.stream;
  }

  pause() {
    if (!this.recognition) {
      return;
    }

    this.shouldContinue = false;
    this.isPaused = true;
    this.recognition.stop();
    this.callbacks.onStateChange("paused", "Browser speech recognition paused.");
  }

  resume() {
    if (!this.recognition) {
      return;
    }

    this.shouldContinue = true;
    this.isPaused = false;

    try {
      this.recognition.start();
      this.callbacks.onStateChange("recording", "Browser speech recognition resumed.");
    } catch (error) {
      const nextError =
        error instanceof Error
          ? error
          : new Error("Browser speech recognition could not resume.");
      this.handleFatalError(nextError);
    }
  }

  stop() {
    this.shouldContinue = false;
    this.isPaused = false;
    this.recognition?.stop();
    this.cleanup();
    this.callbacks.onStateChange("stopped");
  }

  private bindRecognitionHandlers() {
    if (!this.recognition) {
      return;
    }

    this.recognition.onstart = () => {
      this.startupCompleted = true;
    };

    this.recognition.onresult = (event) => {
      let nextInterimText = "";
      let nextInterimConfidence: number | null = null;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const alternative = result[0];
        const transcript = alternative?.transcript?.trim();

        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          const segment = this.createSegment(
            transcript,
            true,
            Number.isFinite(alternative.confidence) ? alternative.confidence : null,
          );
          this.lastFinalEndMs = segment.endMs;
          this.callbacks.onSegment(segment);
          continue;
        }

        nextInterimText = transcript;
        nextInterimConfidence = Number.isFinite(alternative.confidence)
          ? alternative.confidence
          : null;
      }

      if (nextInterimText) {
        this.callbacks.onSegment(
          this.createSegment(nextInterimText, false, nextInterimConfidence),
        );
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === "aborted" && (this.isPaused || !this.shouldContinue)) {
        return;
      }

      if (event.error === "no-speech" && this.shouldContinue) {
        return;
      }

      this.handleFatalError(new Error(getRecognitionErrorMessage(event)));
    };

    this.recognition.onend = () => {
      if (this.isPaused || !this.shouldContinue) {
        return;
      }

      if (!this.startupCompleted) {
        this.handleFatalError(
          new Error("Browser speech recognition ended before it became available."),
        );
        return;
      }

      try {
        this.recognition?.start();
      } catch (error) {
        const nextError =
          error instanceof Error
            ? error
            : new Error("Browser speech recognition could not restart.");
        this.handleFatalError(nextError);
      }
    };
  }

  private createSegment(text: string, isFinal: boolean, confidence: number | null) {
    const endMs = Math.max(Date.now() - this.sessionStartedAtMs, this.lastFinalEndMs + 1);
    const startMs = isFinal ? this.lastFinalEndMs : Math.max(this.lastFinalEndMs, endMs - 1000);

    return {
      id: createId(),
      text,
      startMs,
      endMs,
      speaker: null,
      isFinal,
      confidence,
      createdAt: new Date().toISOString(),
      source: "browser" as const,
    };
  }

  private handleFatalError(error: Error) {
    this.shouldContinue = false;
    this.isPaused = false;
    this.cleanup();
    this.callbacks.onError(error);
    this.callbacks.onStateChange("error", error.message);
  }

  private cleanup() {
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      this.recognition = null;
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.startupCompleted = false;
  }
}

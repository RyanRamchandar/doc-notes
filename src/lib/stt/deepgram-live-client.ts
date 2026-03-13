"use client";

import { DefaultDeepgramClient } from "@deepgram/sdk";

import { DEEPGRAM_MODEL } from "@/lib/constants";
import { createId } from "@/lib/utils";
import {
  type LiveTranscriptionCallbacks,
  type LiveTranscriptionClient,
} from "@/lib/stt/types";
import { type TranscriptSegment } from "@/types/transcript";

type DeepgramResultMessage = {
  type?: "Results" | "UtteranceEnd" | "SpeechStarted";
  is_final?: boolean;
  start?: number;
  duration?: number;
  channel?: {
    alternatives?: Array<{
      transcript?: string;
      confidence?: number;
      words?: Array<{
        start: number;
        end: number;
        speaker?: number;
        confidence?: number;
      }>;
    }>;
  };
};

function getSupportedMediaRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );
}

async function getDeepgramAuthorization() {
  try {
    const response = await fetch("/api/stt/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const payload = (await response.json()) as { access_token: string };
      return `Bearer ${payload.access_token}`;
    }
  } catch {
    // fall through to public key mode
  }

  const publicKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

  if (publicKey) {
    return `Token ${publicKey}`;
  }

  throw new Error("Deepgram credentials are not configured.");
}

function toTranscriptSegment(message: DeepgramResultMessage): TranscriptSegment | null {
  const alternative = message.channel?.alternatives?.[0];
  const transcript = alternative?.transcript?.trim();

  if (!transcript) {
    return null;
  }

  const words = alternative?.words ?? [];
  const firstWord = words[0];
  const lastWord = words[words.length - 1];
  const speaker =
    typeof firstWord?.speaker === "number" ? `Speaker ${firstWord.speaker + 1}` : null;

  return {
    id: createId(),
    text: transcript,
    startMs: Math.round((firstWord?.start ?? message.start ?? 0) * 1000),
    endMs: Math.round(
      (lastWord?.end ?? (message.start ?? 0) + (message.duration ?? 0)) * 1000,
    ),
    speaker,
    isFinal: Boolean(message.is_final),
    confidence: alternative?.confidence ?? null,
    createdAt: new Date().toISOString(),
    source: "deepgram",
  };
}

export class DeepgramLiveClient implements LiveTranscriptionClient {
  private readonly callbacks: LiveTranscriptionCallbacks;
  private socket: Awaited<
    ReturnType<InstanceType<typeof DefaultDeepgramClient>["listen"]["v1"]["connect"]>
  > | null = null;
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private reconnectAttempts = 0;
  private closedByUser = false;
  private keepAliveInterval: number | null = null;

  constructor(callbacks: LiveTranscriptionCallbacks) {
    this.callbacks = callbacks;
  }

  async start() {
    this.callbacks.onStateChange("connecting");
    this.closedByUser = false;
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    await this.connectSocket();
    this.startRecorder();
    this.callbacks.onStateChange("recording");

    return this.stream;
  }

  pause() {
    this.recorder?.pause();
    this.callbacks.onStateChange("paused");
  }

  resume() {
    this.recorder?.resume();
    this.callbacks.onStateChange("recording");
  }

  stop() {
    this.closedByUser = true;
    this.recorder?.stop();
    this.recorder = null;
    this.socket?.sendCloseStream({ type: "CloseStream" });
    this.socket?.close();
    this.socket = null;
    this.clearKeepAlive();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.callbacks.onStateChange("stopped");
  }

  private async connectSocket() {
    const authorization = await getDeepgramAuthorization();
    const client = new DefaultDeepgramClient();
    this.socket = await client.listen.v1.connect({
      Authorization: authorization,
      model: DEEPGRAM_MODEL,
      punctuate: "true",
      smart_format: "true",
      interim_results: "true",
      diarize: "true",
      vad_events: "true",
      utterance_end_ms: 1000,
      reconnectAttempts: 2,
    });

    this.socket.on("open", () => {
      this.reconnectAttempts = 0;
      this.callbacks.onStateChange("recording");
      this.startKeepAlive();
    });

    this.socket.on("message", (message) => {
      if (message.type !== "Results") {
        return;
      }

      const segment = toTranscriptSegment(message as DeepgramResultMessage);

      if (segment) {
        this.callbacks.onSegment(segment);
      }
    });

    this.socket.on("close", () => {
      this.clearKeepAlive();
      if (!this.closedByUser && this.reconnectAttempts < 2) {
        this.reconnectAttempts += 1;
        this.callbacks.onStateChange(
          "connecting",
          `Reconnecting to transcription service (${this.reconnectAttempts}/2)…`,
        );
        void this.connectSocket();
        return;
      }

      if (!this.closedByUser) {
        this.callbacks.onStateChange(
          "error",
          "Transcription connection ended unexpectedly.",
        );
      }
    });

    this.socket.on("error", (error) => {
      this.callbacks.onError(error);
      this.callbacks.onStateChange("error", error.message);
    });
  }

  private startRecorder() {
    if (!this.stream) {
      throw new Error("Cannot start recording without a media stream.");
    }

    const mimeType = getSupportedMediaRecorderMimeType();

    this.recorder = mimeType
      ? new MediaRecorder(this.stream, {
          mimeType,
        })
      : new MediaRecorder(this.stream);

    this.recorder.addEventListener("dataavailable", async (event) => {
      if (!event.data.size || !this.socket || this.recorder?.state === "paused") {
        return;
      }

      const buffer = await event.data.arrayBuffer();
      this.socket.sendMedia(buffer);
    });

    this.recorder.start(250);
  }

  private startKeepAlive() {
    this.clearKeepAlive();
    this.keepAliveInterval = window.setInterval(() => {
      this.socket?.sendKeepAlive({ type: "KeepAlive" });
    }, 10_000);
  }

  private clearKeepAlive() {
    if (this.keepAliveInterval) {
      window.clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }
}

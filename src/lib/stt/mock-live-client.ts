"use client";

import { createId } from "@/lib/utils";
import {
  type LiveTranscriptionCallbacks,
  type LiveTranscriptionClient,
} from "@/lib/stt/types";

const MOCK_SEGMENTS = [
  "Good morning, what brings you in today?",
  "I've had a cough and some congestion for about five days.",
  "No fever, chest pain, or shortness of breath.",
  "Symptoms are worse at night and I'm taking over-the-counter cold medicine.",
  "We'll review supportive care and talk about return precautions.",
];

export class MockLiveClient implements LiveTranscriptionClient {
  private readonly callbacks: LiveTranscriptionCallbacks;
  private stream: MediaStream | null = null;
  private timer: number | null = null;
  private index = 0;

  constructor(callbacks: LiveTranscriptionCallbacks) {
    this.callbacks = callbacks;
  }

  async start() {
    this.callbacks.onStateChange("connecting");
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      // Create a dummy media stream for demo mode when no microphone is available
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const dst = ctx.createMediaStreamDestination();
      oscillator.connect(dst);
      oscillator.start();
      this.stream = dst.stream;
    }
    this.callbacks.onStateChange("recording", "Demo transcription mode is active.");
    this.scheduleNext();
    return this.stream;
  }

  pause() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.callbacks.onStateChange("paused", "Demo transcription paused.");
  }

  resume() {
    this.callbacks.onStateChange("recording", "Demo transcription resumed.");
    this.scheduleNext();
  }

  stop() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.index = 0;
    this.callbacks.onStateChange("stopped", "Demo transcription complete.");
  }

  private scheduleNext() {
    if (this.index >= MOCK_SEGMENTS.length) {
      return;
    }

    const currentIndex = this.index;
    this.timer = window.setTimeout(() => {
      const text = MOCK_SEGMENTS[currentIndex];
      this.callbacks.onSegment({
        id: createId(),
        text,
        startMs: currentIndex * 4000,
        endMs: currentIndex * 4000 + 3000,
        speaker: currentIndex % 2 === 0 ? "Speaker 1" : "Speaker 2",
        isFinal: true,
        confidence: 0.99,
        createdAt: new Date().toISOString(),
        source: "mock",
      });
      this.index += 1;
      this.scheduleNext();
    }, currentIndex === 0 ? 800 : 2200);
  }
}

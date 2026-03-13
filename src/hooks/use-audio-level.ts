"use client";

import { useEffect, useState } from "react";

export function useAudioLevel(stream: MediaStream | null, active: boolean) {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream || !active) {
      setLevel(0);
      return;
    }

    const AudioContextCtor =
      window.AudioContext ??
      ((window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext ??
        null);

    if (!AudioContextCtor) {
      return;
    }

    const audioContext = new AudioContextCtor();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    let frameId = 0;

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;
      setLevel(Math.min(1, average * 1.8));
      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(frameId);
      source.disconnect();
      analyser.disconnect();
      void audioContext.close();
      setLevel(0);
    };
  }, [active, stream]);

  return level;
}

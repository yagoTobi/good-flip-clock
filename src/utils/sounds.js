let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a pleasant completion chime using Web Audio API.
 * Three-note ascending tone (C5-E5-G5) — clean and unobtrusive.
 * No audio files needed; falls back silently if Web Audio API is unavailable.
 */
export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const playTone = (frequency, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = frequency;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Three-note ascending chime
    playTone(523.25, now, 0.3); // C5
    playTone(659.25, now + 0.15, 0.3); // E5
    playTone(783.99, now + 0.3, 0.5); // G5
  } catch {
    // Web Audio API not available — silent fallback
  }
}

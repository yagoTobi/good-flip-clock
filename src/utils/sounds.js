let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a single bell-like ding using Web Audio API.
 * No audio files needed; falls back silently if unavailable.
 */
export function playCompletionSound() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Fundamental tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 830; // ~G#5, bright bell tone

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

    osc.start(now);
    osc.stop(now + 1.2);

    // Soft harmonic overtone for bell character
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.value = 830 * 2.5; // 2nd partial

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc2.start(now);
    osc2.stop(now + 0.6);
  } catch {
    // Web Audio API not available — silent fallback
  }
}

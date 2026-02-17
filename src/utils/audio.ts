// 各弦の開放弦周波数 (6弦→1弦: E2, A2, D3, G3, B3, E4)
const OPEN_STRING_FREQS = [82.41, 110, 146.83, 196, 246.94, 329.63];

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playNote(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  masterGain: GainNode,
) {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + 2);
}

function fretToFreq(stringIndex: number, fret: number): number {
  return OPEN_STRING_FREQS[stringIndex] * Math.pow(2, fret / 12);
}

/**
 * 和音モード: 全弦同時発音
 */
export function playChord(frets: number[], volume: number) {
  const ctx = getAudioContext();
  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  for (let i = 0; i < frets.length; i++) {
    if (frets[i] === -1) continue;
    playNote(ctx, fretToFreq(i, frets[i]), now, master);
  }
}

/**
 * ストロークモード: 6弦から約80ms間隔で順次発音
 */
export function playStrum(frets: number[], volume: number) {
  const ctx = getAudioContext();
  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  let delay = 0;
  for (let i = 0; i < frets.length; i++) {
    if (frets[i] === -1) continue;
    playNote(ctx, fretToFreq(i, frets[i]), now + delay, master);
    delay += 0.08;
  }
}

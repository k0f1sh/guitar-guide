import { playChord, playStrum } from '../utils/audio';

interface PlaybackControlsProps {
  frets: number[];
  volume: number;
  onVolumeChange: (v: number) => void;
}

export default function PlaybackControls({ frets, volume, onVolumeChange }: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <button
        type="button"
        onClick={() => playChord(frets, volume)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-semibold transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
        </svg>
        和音
      </button>
      <button
        type="button"
        onClick={() => playStrum(frets, volume)}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white text-sm font-semibold transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
        ストローク
      </button>
      <label className="flex items-center gap-2 ml-2 text-sm text-slate-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.5l4.2-3.78A.5.5 0 0111.5 5.7v12.6a.5.5 0 01-.8.4L6.5 15z" />
        </svg>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24 accent-indigo-500"
        />
      </label>
    </div>
  );
}

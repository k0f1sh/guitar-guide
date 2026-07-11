export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

export type PitchClass = (typeof NOTE_NAMES)[number];
// Backwards-compatible alias for pitch-class values used throughout the UI.
export type NoteName = PitchClass;
export type SpelledNote = string;

// Standard tuning for display order: string 1 (high E) to string 6 (low E)
export const STANDARD_TUNING: NoteName[] = ['E', 'B', 'G', 'D', 'A', 'E'];

export const FRET_COUNT = 24;

// Frets that have position markers
export const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
export const DOUBLE_MARKERS = [12, 24];

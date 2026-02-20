export interface ChordVoicing {
  // Fret per string (string 6 to string 1). -1 = mute, 0 = open
  frets: number[];
  // Finger numbers (0 = open/mute, 1-4 = index to pinky)
  fingers: number[];
}

export interface ChordType {
  suffix: string;
  label: string;
}

export const CHORD_TYPES: ChordType[] = [
  { suffix: 'major', label: 'major' },
  { suffix: 'minor', label: 'minor' },
  { suffix: '7', label: '7' },
  { suffix: 'm7', label: 'm7' },
  { suffix: 'maj7', label: 'maj7' },
  { suffix: 'dim', label: 'dim' },
  { suffix: 'aug', label: 'aug' },
  { suffix: 'sus4', label: 'sus4' },
  { suffix: 'sus2', label: 'sus2' },
  { suffix: '7sus4', label: '7sus4' },
  { suffix: 'dim7', label: 'dim7' },
  { suffix: 'm7b5', label: 'm7b5' },
  { suffix: 'add9', label: 'add9' },
  { suffix: '9', label: '9' },
];

// ── CAGED system ──
export type CagedForm = 'C' | 'A' | 'G' | 'E' | 'D';

export const CAGED_FORMS: CagedForm[] = ['C', 'A', 'G', 'E', 'D'];

export interface CagedShape {
  frets: number[];
  fingers: number[];
  baseRoot: string;
}

// フォーム × コードタイプ の基準オープンシェイプ
// キー: "フォーム-コードタイプ"
export const CAGED_SHAPES: Record<string, CagedShape> = {
  // ── C フォーム ──
  'C-major':  { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseRoot: 'C' },
  'C-minor':  { frets: [-1, 3, 1, 0, 1, 3], fingers: [0, 3, 1, 0, 2, 4], baseRoot: 'C' },
  'C-7':      { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseRoot: 'C' },
  'C-m7':     { frets: [-1, 3, 1, 3, 1, 3], fingers: [0, 2, 1, 3, 1, 4], baseRoot: 'C' },
  'C-maj7':   { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], baseRoot: 'C' },

  // ── A フォーム ──
  'A-major':  { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseRoot: 'A' },
  'A-minor':  { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseRoot: 'A' },
  'A-7':      { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseRoot: 'A' },
  'A-m7':     { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], baseRoot: 'A' },
  'A-maj7':   { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], baseRoot: 'A' },

  // ── G フォーム ──
  'G-major':  { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseRoot: 'G' },
  'G-minor':  { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseRoot: 'G' },
  'G-7':      { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseRoot: 'G' },
  'G-m7':     { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], baseRoot: 'G' },
  'G-maj7':   { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 1, 0, 0, 0, 2], baseRoot: 'G' },

  // ── E フォーム ──
  'E-major':  { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseRoot: 'E' },
  'E-minor':  { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseRoot: 'E' },
  'E-7':      { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseRoot: 'E' },
  'E-m7':     { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], baseRoot: 'E' },
  'E-maj7':   { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], baseRoot: 'E' },

  // ── D フォーム ──
  'D-major':  { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseRoot: 'D' },
  'D-minor':  { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseRoot: 'D' },
  'D-7':      { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseRoot: 'D' },
  'D-m7':     { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], baseRoot: 'D' },
  'D-maj7':   { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 2, 3], baseRoot: 'D' },
};

// Key: "root-suffix", e.g. "C-major", "A-minor"
export const CHORD_VOICINGS: Record<string, ChordVoicing> = {
  // ── C ──
  'C-major':  { frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 2, 2, 1] },
  'C-minor':  { frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 3, 2, 1] },
  'C-7':      { frets: [-1, 3, 5, 3, 5, 3], fingers: [0, 1, 2, 1, 2, 1] },
  'C-m7':     { frets: [-1, 3, 5, 3, 4, 3], fingers: [0, 1, 3, 1, 2, 1] },
  'C-maj7':   { frets: [-1, 3, 5, 4, 5, 3], fingers: [0, 1, 3, 2, 3, 1] },
  'C-dim':    { frets: [-1, 3, 1, -1, 1, 2], fingers: [0, 3, 1, 0, 2, 4] },
  'C-aug':    { frets: [-1, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 1, 2, 0] },
  'C-sus4':   { frets: [-1, 3, 3, 0, 1, 1], fingers: [0, 3, 4, 0, 1, 1] },
  'C-sus2':   { frets: [-1, 3, 0, 0, 1, 0], fingers: [0, 3, 0, 0, 1, 0] },
  'C-7sus4':  { frets: [-1, 3, 3, 3, 1, 1], fingers: [0, 2, 3, 4, 1, 1] },
  'C-dim7':   { frets: [-1, 3, 1, 2, 1, 2], fingers: [0, 3, 1, 2, 1, 2] },
  'C-m7b5':   { frets: [-1, 3, 1, 3, 1, 2], fingers: [0, 2, 1, 3, 1, 2] },
  'C-add9':   { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0] },
  'C-9':      { frets: [-1, 3, 2, 3, 3, 0], fingers: [0, 2, 1, 3, 4, 0] },

  // ── D ──
  'D-major':  { frets: [-1, 5, 7, 7, 7, 5], fingers: [0, 1, 2, 2, 2, 1] },
  'D-minor':  { frets: [-1, 5, 7, 7, 6, 5], fingers: [0, 1, 3, 3, 2, 1] },
  'D-7':      { frets: [-1, 5, 7, 5, 7, 5], fingers: [0, 1, 2, 1, 2, 1] },
  'D-m7':     { frets: [-1, 5, 7, 5, 6, 5], fingers: [0, 1, 3, 1, 2, 1] },
  'D-maj7':   { frets: [-1, 5, 7, 6, 7, 5], fingers: [0, 1, 3, 2, 3, 1] },
  'D-dim':    { frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2] },
  'D-aug':    { frets: [-1, -1, 0, 3, 3, 2], fingers: [0, 0, 0, 2, 3, 1] },
  'D-sus4':   { frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  'D-sus2':   { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  'D-7sus4':  { frets: [-1, -1, 0, 2, 1, 3], fingers: [0, 0, 0, 2, 1, 3] },
  'D-dim7':   { frets: [-1, -1, 0, 1, 0, 1], fingers: [0, 0, 0, 1, 0, 2] },
  'D-m7b5':   { frets: [-1, -1, 0, 1, 1, 1], fingers: [0, 0, 0, 1, 2, 3] },
  'D-add9':   { frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
  'D-9':      { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0] },

  // ── E ──
  'E-major':  { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 2, 1, 0, 0] },
  'E-minor':  { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 1, 1, 0, 0, 0] },
  'E-7':      { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
  'E-m7':     { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  'E-maj7':   { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 2, 1, 1, 0, 0] },
  'E-dim':    { frets: [0, 1, 2, 0, -1, -1], fingers: [0, 1, 2, 0, 0, 0] },
  'E-aug':    { frets: [0, 3, 2, 1, 1, 0], fingers: [0, 4, 3, 2, 1, 0] },
  'E-sus4':   { frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0] },
  'E-sus2':   { frets: [0, 2, 4, 1, 0, 0], fingers: [0, 1, 4, 2, 0, 0] },
  'E-7sus4':  { frets: [0, 2, 0, 2, 0, 0], fingers: [0, 1, 0, 2, 0, 0] },
  'E-dim7':   { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  'E-m7b5':   { frets: [0, 1, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0] },
  'E-add9':   { frets: [0, 2, 2, 1, 0, 2], fingers: [0, 2, 3, 1, 0, 4] },
  'E-9':      { frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3] },

  // ── F ──
  'F-major':  { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 3, 2, 1, 1] },
  'F-minor':  { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 2, 2, 1, 1, 1] },
  'F-7':      { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1] },
  'F-m7':     { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 2, 1, 1, 1, 1] },
  'F-maj7':   { frets: [1, 3, 2, 2, 1, 1], fingers: [1, 3, 2, 2, 1, 1] },
  'F-dim':    { frets: [-1, 1, 2, 1, -1, 1], fingers: [0, 1, 3, 2, 0, 1] },
  'F-aug':    { frets: [2, 3, 3, 2, 1, 1], fingers: [2, 3, 4, 2, 1, 1] },
  'F-sus4':   { frets: [1, 3, 3, 3, 1, 1], fingers: [1, 4, 3, 2, 1, 1] },
  'F-sus2':   { frets: [1, 1, 3, 3, 1, 1], fingers: [1, 1, 3, 4, 1, 1] },
  'F-7sus4':  { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1] },
  'F-dim7':   { frets: [-1, -1, 2, 1, 2, 1], fingers: [0, 0, 4, 2, 3, 1] },
  'F-m7b5':   { frets: [1, 1, 1, 1, -1, -1], fingers: [1, 2, 3, 4, 0, 0] },
  'F-add9':   { frets: [1, 1, 3, 2, 1, 1], fingers: [1, 1, 4, 2, 1, 1] },
  'F-9':      { frets: [1, 1, 1, 2, 1, 1], fingers: [1, 1, 1, 2, 1, 1] },

  // ── G ──
  'G-major':  { frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 3, 2, 1, 1] },
  'G-minor':  { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 2, 2, 1, 1, 1] },
  'G-7':      { frets: [3, 5, 3, 4, 3, 3], fingers: [1, 3, 1, 2, 1, 1] },
  'G-m7':     { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 2, 1, 1, 1, 1] },
  'G-maj7':   { frets: [3, 5, 4, 4, 3, 3], fingers: [1, 3, 2, 2, 1, 1] },
  'G-dim':    { frets: [-1, 3, 4, 3, -1, 3], fingers: [0, 1, 3, 2, 0, 1] },
  'G-aug':    { frets: [3, 2, 1, 0, 0, 3], fingers: [3, 2, 1, 0, 0, 4] },
  'G-sus4':   { frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4] },
  'G-sus2':   { frets: [3, 0, 0, 0, 0, 3], fingers: [1, 0, 0, 0, 0, 2] },
  'G-7sus4':  { frets: [3, 3, 0, 0, 1, 1], fingers: [3, 4, 0, 0, 1, 2] },
  'G-dim7':   { frets: [-1, -1, 4, 3, 4, 3], fingers: [0, 0, 4, 2, 3, 1] },
  'G-m7b5':   { frets: [3, 3, 3, 3, -1, -1], fingers: [1, 2, 3, 4, 0, 0] },
  'G-add9':   { frets: [3, 2, 0, 2, 0, 3], fingers: [3, 1, 0, 2, 0, 4] },
  'G-9':      { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },

  // ── A ──
  'A-major':  { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 1, 1, 0] },
  'A-minor':  { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 2, 1, 0] },
  'A-7':      { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 1, 0] },
  'A-m7':     { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  'A-maj7':   { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 2, 0] },
  'A-dim':    { frets: [-1, 0, 1, 2, 1, -1], fingers: [0, 0, 1, 3, 2, 0] },
  'A-aug':    { frets: [-1, 0, 3, 2, 2, 1], fingers: [0, 0, 4, 3, 2, 1] },
  'A-sus4':   { frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  'A-sus2':   { frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  'A-7sus4':  { frets: [-1, 0, 2, 0, 3, 0], fingers: [0, 0, 1, 0, 3, 0] },
  'A-dim7':   { frets: [-1, 0, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
  'A-m7b5':   { frets: [-1, 0, 1, 0, 1, 0], fingers: [0, 0, 1, 0, 2, 0] },
  'A-add9':   { frets: [-1, 0, 2, 4, 2, 0], fingers: [0, 0, 1, 4, 2, 0] },
  'A-9':      { frets: [-1, 0, 2, 4, 2, 3], fingers: [0, 0, 1, 3, 1, 2] },

  // ── B ──
  'B-major':  { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 2, 2, 1] },
  'B-minor':  { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 3, 2, 1] },
  'B-7':      { frets: [-1, 2, 4, 2, 4, 2], fingers: [0, 1, 2, 1, 2, 1] },
  'B-m7':     { frets: [-1, 2, 4, 2, 3, 2], fingers: [0, 1, 3, 1, 2, 1] },
  'B-maj7':   { frets: [-1, 2, 4, 3, 4, 2], fingers: [0, 1, 3, 2, 3, 1] },
  'B-dim':    { frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0] },
  'B-aug':    { frets: [-1, 2, 1, 0, 0, 3], fingers: [0, 2, 1, 0, 0, 3] },
  'B-sus4':   { frets: [-1, 2, 4, 4, 5, 2], fingers: [0, 1, 2, 3, 4, 1] },
  'B-sus2':   { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1] },
  'B-7sus4':  { frets: [-1, 2, 2, 2, 0, 2], fingers: [0, 1, 2, 3, 0, 4] },
  'B-dim7':   { frets: [-1, 2, 3, 1, 3, 1], fingers: [0, 2, 3, 1, 4, 1] },
  'B-m7b5':   { frets: [-1, 2, 3, 2, 3, 2], fingers: [0, 1, 2, 1, 3, 1] },
  'B-add9':   { frets: [-1, 2, 4, 4, 2, 2], fingers: [0, 1, 3, 4, 1, 1] },
  'B-9':      { frets: [-1, 2, 1, 2, 2, 2], fingers: [0, 2, 1, 3, 3, 3] },

  // ── C# ──
  'C#-major': { frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 2, 2, 1] },
  'C#-minor': { frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 3, 2, 1] },
  'C#-7':     { frets: [-1, 4, 6, 4, 6, 4], fingers: [0, 1, 2, 1, 2, 1] },
  'C#-m7':    { frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1] },
  'C#-maj7':  { frets: [-1, 4, 6, 5, 6, 4], fingers: [0, 1, 3, 2, 3, 1] },
  'C#-dim':   { frets: [-1, 4, 2, -1, 2, 3], fingers: [0, 3, 1, 0, 2, 4] },
  'C#-aug':   { frets: [-1, 4, 3, 2, 2, 1], fingers: [0, 4, 3, 2, 2, 1] },
  'C#-sus4':  { frets: [-1, 4, 4, 1, 2, 2], fingers: [0, 3, 4, 1, 2, 2] },
  'C#-sus2':  { frets: [-1, 4, 1, 1, 2, -1], fingers: [0, 4, 1, 1, 2, 0] },
  'C#-dim7':  { frets: [-1, 4, 2, 3, 2, 3], fingers: [0, 3, 1, 2, 1, 2] },
  'C#-m7b5':  { frets: [-1, 4, 2, 4, 2, 3], fingers: [0, 2, 1, 3, 1, 2] },

  // ── D# ──
  'D#-major': { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 2, 2, 1] },
  'D#-minor': { frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 3, 2, 1] },
  'D#-7':     { frets: [-1, 6, 8, 6, 8, 6], fingers: [0, 1, 2, 1, 2, 1] },
  'D#-m7':    { frets: [-1, 6, 8, 6, 7, 6], fingers: [0, 1, 3, 1, 2, 1] },
  'D#-maj7':  { frets: [-1, 6, 8, 7, 8, 6], fingers: [0, 1, 3, 2, 3, 1] },
  'D#-dim':   { frets: [-1, -1, 1, 2, 4, 2], fingers: [0, 0, 1, 2, 4, 3] },
  'D#-aug':   { frets: [-1, -1, 1, 0, 0, 3], fingers: [0, 0, 1, 0, 0, 2] },
  'D#-sus4':  { frets: [-1, -1, 1, 3, 4, 4], fingers: [0, 0, 1, 2, 3, 4] },
  'D#-sus2':  { frets: [-1, -1, 1, 3, 4, 1], fingers: [0, 0, 1, 3, 4, 1] },
  'D#-dim7':  { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
  'D#-m7b5':  { frets: [-1, -1, 1, 2, 2, 2], fingers: [0, 0, 1, 2, 3, 4] },

  // ── F# ──
  'F#-major': { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 3, 2, 1, 1] },
  'F#-minor': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 2, 2, 1, 1, 1] },
  'F#-7':     { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1] },
  'F#-m7':    { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 2, 1, 1, 1, 1] },
  'F#-maj7':  { frets: [2, 4, 3, 3, 2, 2], fingers: [1, 3, 2, 2, 1, 1] },
  'F#-dim':   { frets: [-1, 2, 3, 2, -1, 2], fingers: [0, 1, 3, 2, 0, 1] },
  'F#-aug':   { frets: [3, 4, 4, 3, 2, 2], fingers: [2, 3, 4, 2, 1, 1] },
  'F#-sus4':  { frets: [2, 4, 4, 4, 2, 2], fingers: [1, 4, 3, 2, 1, 1] },
  'F#-sus2':  { frets: [2, 2, 4, 4, 2, 2], fingers: [1, 1, 3, 4, 1, 1] },
  'F#-dim7':  { frets: [-1, -1, 3, 2, 3, 2], fingers: [0, 0, 4, 2, 3, 1] },
  'F#-m7b5':  { frets: [2, 2, 2, 2, -1, -1], fingers: [1, 2, 3, 4, 0, 0] },

  // ── G# ──
  'G#-major': { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 3, 2, 1, 1] },
  'G#-minor': { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 2, 2, 1, 1, 1] },
  'G#-7':     { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1] },
  'G#-m7':    { frets: [4, 6, 4, 4, 4, 4], fingers: [1, 2, 1, 1, 1, 1] },
  'G#-maj7':  { frets: [4, 6, 5, 5, 4, 4], fingers: [1, 3, 2, 2, 1, 1] },
  'G#-dim':   { frets: [-1, 4, 5, 4, -1, 4], fingers: [0, 1, 3, 2, 0, 1] },
  'G#-aug':   { frets: [5, 6, 6, 5, 4, 4], fingers: [2, 3, 4, 2, 1, 1] },
  'G#-sus4':  { frets: [4, 6, 6, 6, 4, 4], fingers: [1, 4, 3, 2, 1, 1] },
  'G#-sus2':  { frets: [4, 4, 6, 6, 4, 4], fingers: [1, 1, 3, 4, 1, 1] },
  'G#-dim7':  { frets: [-1, -1, 5, 4, 5, 4], fingers: [0, 0, 4, 2, 3, 1] },
  'G#-m7b5':  { frets: [4, 4, 4, 4, -1, -1], fingers: [1, 2, 3, 4, 0, 0] },

  // ── A# ──
  'A#-major': { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 2, 2, 1] },
  'A#-minor': { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 3, 2, 1] },
  'A#-7':     { frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 2, 1, 2, 1] },
  'A#-m7':    { frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 3, 1, 2, 1] },
  'A#-maj7':  { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 3, 1] },
  'A#-dim':   { frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0] },
  'A#-aug':   { frets: [-1, 1, 0, 3, 3, 2], fingers: [0, 1, 0, 3, 4, 2] },
  'A#-sus4':  { frets: [-1, 1, 3, 3, 4, 1], fingers: [0, 1, 2, 3, 4, 1] },
  'A#-sus2':  { frets: [-1, 1, 3, 3, 1, 1], fingers: [0, 1, 3, 4, 1, 1] },
  'A#-dim7':  { frets: [-1, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0] },
  'A#-m7b5':  { frets: [-1, 1, 2, 1, 2, 1], fingers: [0, 1, 2, 1, 3, 1] },
};

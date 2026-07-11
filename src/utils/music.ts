import { FRET_COUNT, NOTE_NAMES, type NoteName, STANDARD_TUNING } from '../data/notes';
import { CAGED_SHAPES, type CagedForm } from '../data/chords';
import type { ChordVoicing } from '../data/chords';

export interface DiatonicChord {
  degree: number;
  root: NoteName;
  suffix: string;
  label: string;
}

export type NoteLabel = 'note' | 'finger' | 'degree';

export function getNoteIndex(note: NoteName): number {
  return NOTE_NAMES.indexOf(note);
}

export function getNoteAtFret(openString: NoteName, fret: number): NoteName {
  const index = (getNoteIndex(openString) + fret) % 12;
  return NOTE_NAMES[index];
}

export function getScaleNotes(root: NoteName, intervals: number[]): NoteName[] {
  const rootIndex = getNoteIndex(root);
  return intervals.map((interval) => NOTE_NAMES[(rootIndex + interval) % 12]);
}

export function isNoteInScale(
  note: NoteName,
  root: NoteName,
  intervals: number[],
): boolean {
  const scaleNotes = getScaleNotes(root, intervals);
  return scaleNotes.includes(note);
}

export function getFretboardNotes(): NoteName[][] {
  return STANDARD_TUNING.map((openNote) =>
    Array.from({ length: FRET_COUNT + 1 }, (_, fret) => getNoteAtFret(openNote, fret)),
  );
}

const NATURAL_PITCHES = [0, 2, 4, 5, 7, 9, 11];
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const COMMON_TONICS: Record<NoteName, string> = {
  C: 'C', 'C#': 'Db', D: 'D', 'D#': 'Eb', E: 'E', F: 'F',
  'F#': 'F#', G: 'G', 'G#': 'Ab', A: 'A', 'A#': 'Bb', B: 'B',
};

function normalizedAccidental(target: number, natural: number): number {
  let delta = (target - natural + 12) % 12;
  if (delta > 6) delta -= 12;
  return delta;
}

function accidentalText(accidental: number): string {
  if (accidental > 0) return '#'.repeat(accidental);
  if (accidental < 0) return 'b'.repeat(-accidental);
  return '';
}

function degreeNumber(degree: string): number {
  const match = degree.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

interface SpellingCandidate {
  tonic: string;
  notes: string[];
  score: number;
}

/** Choose a theoretically valid spelling with the fewest accidentals. */
export function spellPitchClasses(
  root: NoteName,
  intervals: number[],
  degrees: string[],
): string[] {
  const rootIndex = getNoteIndex(root);
  const candidates: SpellingCandidate[] = [];

  for (let tonicLetter = 0; tonicLetter < LETTERS.length; tonicLetter++) {
    const tonicAccidental = normalizedAccidental(rootIndex, NATURAL_PITCHES[tonicLetter]);
    if (Math.abs(tonicAccidental) > 2) continue;

    const notes: string[] = [];
    let score = 0;
    let valid = true;
    for (let i = 0; i < intervals.length; i++) {
      const letterOffset = (degreeNumber(degrees[i]) - 1) % 7;
      const letterIndex = (tonicLetter + letterOffset) % 7;
      const targetPitch = (rootIndex + intervals[i]) % 12;
      const accidental = normalizedAccidental(targetPitch, NATURAL_PITCHES[letterIndex]);
      if (Math.abs(accidental) > 2) {
        valid = false;
        break;
      }
      notes.push(`${LETTERS[letterIndex]}${accidentalText(accidental)}`);
      score += Math.abs(accidental);
    }
    if (valid) {
      const tonic = `${LETTERS[tonicLetter]}${accidentalText(tonicAccidental)}`;
      candidates.push({
        tonic,
        notes,
        // Keep the familiar tonic name unless another spelling removes
        // substantially more accidentals (for example C# minor vs Db minor).
        score: score + (tonic === COMMON_TONICS[root] ? 0 : 3),
      });
    }
  }

  candidates.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    const preferred = COMMON_TONICS[root];
    if (a.tonic === preferred) return -1;
    if (b.tonic === preferred) return 1;
    return a.tonic.localeCompare(b.tonic);
  });

  return candidates[0]?.notes ?? getScaleNotes(root, intervals);
}

export function getSpellingMap(
  root: NoteName,
  intervals: number[],
  degrees: string[],
): Map<NoteName, string> {
  const pitchClasses = getScaleNotes(root, intervals);
  const spellings = spellPitchClasses(root, intervals, degrees);
  return new Map(pitchClasses.map((pitch, index) => [pitch, spellings[index]]));
}

export function getContextDegreeName(
  root: NoteName,
  note: NoteName,
  intervals: number[],
  degrees: string[],
): string {
  const interval = (getNoteIndex(note) - getNoteIndex(root) + 12) % 12;
  const index = intervals.indexOf(interval);
  return index >= 0 ? degrees[index] : getDegreeName(root, note);
}

const DEGREE_NAMES: Record<number, string> = {
  0: 'R',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
};

export function getDegreeName(root: NoteName, note: NoteName): string {
  const interval = (getNoteIndex(note) - getNoteIndex(root) + 12) % 12;
  return DEGREE_NAMES[interval];
}

/**
 * CAGED フォーム + コードタイプを指定ルートに移調する
 * 該当するフォーム×タイプの基準シェイプから目標ルートへシフト
 * 対応シェイプがない場合は null を返す
 */
export function transposeCagedForm(
  form: CagedForm,
  chordType: string,
  targetRoot: NoteName,
): ChordVoicing | null {
  const shapeKey = `${form}-${chordType}`;
  const shape = CAGED_SHAPES[shapeKey];
  if (!shape) return null;

  const baseIndex = getNoteIndex(shape.baseRoot as NoteName);
  const targetIndex = getNoteIndex(targetRoot);
  const shift = (targetIndex - baseIndex + 12) % 12;

  if (shift === 0) {
    return { frets: [...shape.frets], fingers: [...shape.fingers] };
  }

  const movableFrets = shape.movableFrets ?? shape.frets;
  const frets = movableFrets.map((f) => (f === -1 ? -1 : f + shift));
  const fingers = [...shape.movableFingers];

  return { frets, fingers };
}

/**
 * 7音スケールからダイアトニックコード（トライアド）を算出する
 */
export function getDiatonicChords(
  root: NoteName,
  intervals: number[],
  degrees?: string[],
): DiatonicChord[] {
  if (intervals.length !== 7) return [];

  const rootIndex = getNoteIndex(root);

  const spellingMap = degrees ? getSpellingMap(root, intervals, degrees) : null;

  return intervals.map((_, i) => {
    const chordRootInterval = intervals[i];
    const thirdInterval = intervals[(i + 2) % 7];
    const fifthInterval = intervals[(i + 4) % 7];

    const rootTo3rd = (thirdInterval - chordRootInterval + 12) % 12;
    const rootTo5th = (fifthInterval - chordRootInterval + 12) % 12;

    let suffix: string;
    if (rootTo3rd === 4 && rootTo5th === 7) suffix = 'major';
    else if (rootTo3rd === 3 && rootTo5th === 7) suffix = 'minor';
    else if (rootTo3rd === 3 && rootTo5th === 6) suffix = 'dim';
    else if (rootTo3rd === 4 && rootTo5th === 8) suffix = 'aug';
    else suffix = 'major';

    const chordRoot = NOTE_NAMES[(rootIndex + chordRootInterval) % 12];
    const displayRoot = spellingMap?.get(chordRoot) ?? chordRoot;
    const label = suffix === 'major'
      ? displayRoot
      : suffix === 'minor'
        ? `${displayRoot}m`
        : suffix === 'dim'
          ? `${displayRoot}dim`
          : `${displayRoot}aug`;

    return { degree: i + 1, root: chordRoot, suffix, label };
  });
}

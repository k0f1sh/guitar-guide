import { NOTE_NAMES, type NoteName, STANDARD_TUNING } from '../data/notes';
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
    Array.from({ length: 13 }, (_, fret) => getNoteAtFret(openNote, fret)),
  );
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

  const frets = shape.frets.map((f) => (f === -1 ? -1 : f + shift));
  const fingers = shape.fingers.map((f, i) => {
    if (shape.frets[i] === -1) return 0;
    if (shape.frets[i] === 0) return 1; // was open, now barre'd by index finger
    return f;
  });

  return { frets, fingers };
}

/**
 * 7音スケールからダイアトニックコード（トライアド）を算出する
 */
export function getDiatonicChords(root: NoteName, intervals: number[]): DiatonicChord[] {
  if (intervals.length !== 7) return [];

  const rootIndex = getNoteIndex(root);

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
    const label = suffix === 'major'
      ? chordRoot
      : suffix === 'minor'
        ? `${chordRoot}m`
        : suffix === 'dim'
          ? `${chordRoot}dim`
          : `${chordRoot}aug`;

    return { degree: i + 1, root: chordRoot, suffix, label };
  });
}

import { describe, expect, it } from 'vitest';
import { CHORD_TYPES, CHORD_VOICINGS, CAGED_FORMS } from '../data/chords';
import { FRET_COUNT, NOTE_NAMES, STANDARD_TUNING, type NoteName } from '../data/notes';
import { SCALES } from '../data/scales';
import {
  getDiatonicChords,
  getFretboardNotes,
  getNoteAtFret,
  getNoteIndex,
  spellPitchClasses,
  transposeCagedForm,
} from './music';

function intervalsInVoicing(root: NoteName, frets: number[]): number[] {
  const tuning = [...STANDARD_TUNING].reverse();
  return [...new Set(frets.flatMap((fret, index) => {
    if (fret < 0) return [];
    const note = getNoteAtFret(tuning[index], fret);
    return [(getNoteIndex(note) - getNoteIndex(root) + 12) % 12];
  }))].sort((a, b) => a - b);
}

function validateVoicing(root: NoteName, type: typeof CHORD_TYPES[number], frets: number[]) {
  const actual = intervalsInVoicing(root, frets);
  const optional = new Set(type.optionalIntervals ?? []);
  expect(actual.filter((interval) => !type.intervals.includes(interval))).toEqual([]);
  expect(type.intervals.filter((interval) => !optional.has(interval) && !actual.includes(interval))).toEqual([]);
}

describe('scale and spelling data', () => {
  it('keeps every scale definition internally aligned', () => {
    for (const scale of SCALES) {
      expect(scale.intervals).toHaveLength(scale.degrees.length);
      expect(new Set(scale.intervals).size).toBe(scale.intervals.length);
      expect(scale.intervals[0]).toBe(0);
    }
  });

  it.each([
    ['F major', 'F', 0, ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']],
    ['F# major', 'F#', 0, ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']],
    ['Db major', 'C#', 0, ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']],
    ['C# natural minor', 'C#', 1, ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B']],
  ] as const)('spells %s correctly', (_name, root, scaleIndex, expected) => {
    const scale = SCALES[scaleIndex];
    expect(spellPitchClasses(root, scale.intervals, scale.degrees)).toEqual(expected);
  });

  it('uses chord-specific augmented, diminished-seventh, and ninth spellings', () => {
    const cases = [
      ['aug', ['C', 'E', 'G#']],
      ['dim7', ['C', 'Eb', 'Gb', 'Bbb']],
      ['add9', ['C', 'E', 'G', 'D']],
    ] as const;
    for (const [suffix, expected] of cases) {
      const type = CHORD_TYPES.find((item) => item.suffix === suffix)!;
      expect(spellPitchClasses('C', type.intervals, type.degrees)).toEqual(expected);
    }
  });

  it('derives the expected major and natural-minor triads', () => {
    expect(getDiatonicChords('C', SCALES[0].intervals, SCALES[0].degrees).map((chord) => chord.label))
      .toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
    expect(getDiatonicChords('A', SCALES[1].intervals, SCALES[1].degrees).map((chord) => chord.label))
      .toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });
});

describe('direct chord voicings', () => {
  it('covers every root and chord type with valid chord tones', () => {
    expect(Object.keys(CHORD_VOICINGS)).toHaveLength(NOTE_NAMES.length * CHORD_TYPES.length);
    for (const root of NOTE_NAMES) {
      for (const type of CHORD_TYPES) {
        const voicing = CHORD_VOICINGS[`${root}-${type.suffix}`];
        expect(voicing, `${root}-${type.suffix}`).toBeDefined();
        expect(voicing.frets).toHaveLength(6);
        expect(voicing.fingers).toHaveLength(6);
        validateVoicing(root, type, voicing.frets);
        voicing.frets.forEach((fret, index) => {
          expect(fret).toBeGreaterThanOrEqual(-1);
          expect(fret).toBeLessThanOrEqual(FRET_COUNT);
          expect(voicing.fingers[index]).toBeGreaterThanOrEqual(0);
          expect(voicing.fingers[index]).toBeLessThanOrEqual(4);
          expect(voicing.fingers[index] === 0).toBe(fret <= 0);
        });
      }
    }
  });
});

describe('CAGED voicings', () => {
  const supportedTypes = CHORD_TYPES.filter((type) => ['major', 'minor', '7', 'm7', 'maj7'].includes(type.suffix));

  it('transposes all supported forms without impossible finger assignments', () => {
    for (const form of CAGED_FORMS) {
      for (const type of supportedTypes) {
        for (const root of NOTE_NAMES) {
          const voicing = transposeCagedForm(form, type.suffix, root)!;
          validateVoicing(root, type, voicing.frets);
          voicing.frets.forEach((fret, index) => {
            expect(fret).toBeGreaterThanOrEqual(-1);
            expect(fret).toBeLessThanOrEqual(FRET_COUNT);
            expect(voicing.fingers[index] === 0).toBe(fret <= 0);
          });
          for (let finger = 1; finger <= 4; finger++) {
            const fingerFrets = new Set(voicing.frets.filter((_, index) => voicing.fingers[index] === finger));
            expect(fingerFrets.size, `${root} ${type.suffix} ${form}-form finger ${finger}`).toBeLessThanOrEqual(1);
          }
        }
      }
    }
  });

  it('rejects unsupported CAGED chord types', () => {
    expect(transposeCagedForm('E', 'dim7', 'C')).toBeNull();
  });
});

describe('fretboard generation', () => {
  it('returns open string through fret 24 for all six strings', () => {
    const fretboard = getFretboardNotes();
    expect(fretboard).toHaveLength(6);
    fretboard.forEach((string) => expect(string).toHaveLength(FRET_COUNT + 1));
    expect(fretboard[0][0]).toBe('E');
    expect(fretboard[0][24]).toBe('E');
  });
});

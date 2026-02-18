import type { NoteName } from '../data/notes';
import { getDiatonicChords } from '../utils/music';

interface Props {
  root: NoteName;
  intervals: number[];
  onSelectChord: (root: NoteName, suffix: string) => void;
}

export default function DiatonicChords({ root, intervals, onSelectChord }: Props) {
  const chords = getDiatonicChords(root, intervals);

  // ディグリー表記をコード品質に合わせて生成
  const degreeLabels = chords.map((chord) => {
    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][chord.degree - 1];
    if (chord.suffix === 'minor') return roman.toLowerCase();
    if (chord.suffix === 'dim') return roman.toLowerCase() + '°';
    if (chord.suffix === 'aug') return roman + '+';
    return roman;
  });

  return (
    <div className="mt-4 flex flex-wrap gap-2 justify-center min-h-[3rem]">
      {chords.map((chord, i) => (
        <button
          key={chord.degree}
          onClick={() => onSelectChord(chord.root, chord.suffix)}
          className="flex flex-col items-center px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors cursor-pointer min-w-[3.5rem]"
        >
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
            {degreeLabels[i]}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight mt-0.5">
            {chord.label}
          </span>
        </button>
      ))}
    </div>
  );
}

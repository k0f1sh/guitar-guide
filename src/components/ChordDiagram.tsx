import { CHORD_VOICINGS } from '../data/chords';
import type { CagedForm } from '../data/chords';
import { STANDARD_TUNING, type NoteName } from '../data/notes';
import type { NoteLabel } from '../utils/music';
import { transposeCagedForm, getNoteAtFret, getNoteIndex, getDegreeName } from '../utils/music';
import Fretboard from './Fretboard';

function getChordNotesSorted(frets: number[], root: NoteName): NoteName[] {
  const tuning = [...STANDARD_TUNING].reverse(); // frets は 6→1 順、STANDARD_TUNING は 1→6 順なので反転
  const notes = frets
    .map((fret, i) => fret >= 0 ? getNoteAtFret(tuning[i], fret) : null)
    .filter((n): n is NoteName => n !== null);
  const unique = [...new Set(notes)];
  const rootIdx = getNoteIndex(root);
  unique.sort((a, b) => (getNoteIndex(a) - rootIdx + 12) % 12 - (getNoteIndex(b) - rootIdx + 12) % 12);
  return unique;
}

function ChordNotes({ frets, root }: { frets: number[]; root: NoteName }) {
  const notes = getChordNotesSorted(frets, root);
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">構成音</span>
      {notes.map((note) => (
        <div
          key={note}
          className={`flex flex-col items-center px-3 py-1.5 rounded-lg ${note === root ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
        >
          <span className="font-extrabold text-base leading-tight">{note}</span>
          <span className="text-xs font-bold opacity-60">{getDegreeName(root, note)}</span>
        </div>
      ))}
    </div>
  );
}

interface ChordDiagramProps {
  root: NoteName;
  chordType: string;
  labelMode: NoteLabel;
  cagedForm: CagedForm | null;
}

export default function ChordDiagram({ root, chordType, labelMode, cagedForm }: ChordDiagramProps) {
  // CAGED モード: フォーム + コードタイプを組み合わせて移調
  if (cagedForm) {
    const voicing = transposeCagedForm(cagedForm, chordType, root);
    if (!voicing) {
      const fallback = CHORD_VOICINGS[`${root}-${chordType}`];
      return (
        <div className="relative">
          {fallback && <ChordNotes frets={fallback.frets} root={root} />}
          <Fretboard
            root={root}
            highlightedNotes={[]}
            mode="chord"
            labelMode={labelMode}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 rounded-xl">
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-xl px-5 py-3 text-sm font-medium shadow">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {cagedForm} フォーム × {chordType} の組み合わせは未対応です
            </div>
          </div>
        </div>
      );
    }
    return (
      <>
        <ChordNotes frets={voicing.frets} root={root} />
        <Fretboard
          root={root}
          highlightedNotes={[]}
          mode="chord"
          labelMode={labelMode}
          chordFrets={voicing.frets}
          chordFingers={voicing.fingers}
        />
      </>
    );
  }

  // 通常コードモード
  const key = `${root}-${chordType}`;
  const voicing = CHORD_VOICINGS[key];

  if (!voicing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 rounded-xl px-5 py-3 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {root} {chordType} のボイシングデータがありません
        </div>
      </div>
    );
  }

  return (
    <>
      <ChordNotes frets={voicing.frets} root={root} />
      <Fretboard
        root={root}
        highlightedNotes={[]}
        mode="chord"
        labelMode={labelMode}
        chordFrets={voicing.frets}
        chordFingers={voicing.fingers}
      />
    </>
  );
}

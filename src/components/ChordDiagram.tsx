import { CHORD_VOICINGS } from '../data/chords';
import type { CagedForm } from '../data/chords';
import type { NoteName } from '../data/notes';
import type { NoteLabel } from '../utils/music';
import { transposeCagedForm } from '../utils/music';
import Fretboard from './Fretboard';

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
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-5 py-3 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {cagedForm} フォーム × {chordType} の組み合わせは未対応です
          </div>
        </div>
      );
    }
    return (
      <Fretboard
        root={root}
        highlightedNotes={[]}
        mode="chord"
        labelMode={labelMode}
        chordFrets={voicing.frets}
        chordFingers={voicing.fingers}
      />
    );
  }

  // 通常コードモード
  const key = `${root}-${chordType}`;
  const voicing = CHORD_VOICINGS[key];

  if (!voicing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl px-5 py-3 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {root} {chordType} のボイシングデータがありません
        </div>
      </div>
    );
  }

  return (
    <Fretboard
      root={root}
      highlightedNotes={[]}
      mode="chord"
      labelMode={labelMode}
      chordFrets={voicing.frets}
      chordFingers={voicing.fingers}
    />
  );
}

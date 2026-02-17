import { useState } from 'react';
import type { NoteName } from './data/notes';
import type { CagedForm } from './data/chords';
import { SCALES } from './data/scales';
import { getScaleNotes } from './utils/music';
import type { NoteLabel } from './utils/music';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Fretboard from './components/Fretboard';
import ChordDiagram from './components/ChordDiagram';

type Mode = 'scale' | 'chord';

export default function App() {
  const [mode, setMode] = useState<Mode>('scale');
  const [root, setRoot] = useState<NoteName>('C');
  const [scaleIndex, setScaleIndex] = useState(0);
  const [chordType, setChordType] = useState('major');
  const [cagedForm, setCagedForm] = useState<CagedForm | null>(null);
  const [labelMode, setLabelMode] = useState<NoteLabel>('note');

  const scale = SCALES[scaleIndex];
  const highlightedNotes = getScaleNotes(root, scale.intervals);

  const title = mode === 'scale'
    ? scale.name
    : cagedForm
      ? `${chordType} - ${cagedForm} フォーム`
      : chordType;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Fretboard - 上側・横幅いっぱい */}
      <section className="w-full px-4 pt-5 pb-2">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-5">
          <h2 className="text-2xl font-extrabold text-slate-700 mb-4 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-base font-extrabold">
              {root}
            </span>
            {title}
          </h2>
          {mode === 'scale' ? (
            <Fretboard
              root={root}
              highlightedNotes={highlightedNotes}
              mode="scale"
              labelMode={labelMode}
            />
          ) : (
            <ChordDiagram
              root={root}
              chordType={chordType}
              labelMode={labelMode}
              cagedForm={cagedForm}
            />
          )}
        </div>
      </section>

      {/* Control panel - 下側・max-width で中央寄せ */}
      <section className="w-full px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <ControlPanel
            mode={mode}
            onModeChange={setMode}
            root={root}
            onRootChange={setRoot}
            scaleIndex={scaleIndex}
            onScaleChange={setScaleIndex}
            chordType={chordType}
            onChordTypeChange={setChordType}
            cagedForm={cagedForm}
            onCagedFormChange={setCagedForm}
            labelMode={labelMode}
            onLabelModeChange={setLabelMode}
          />
        </div>
      </section>
    </div>
  );
}

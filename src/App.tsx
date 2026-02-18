import { useState } from 'react';
import type { NoteName } from './data/notes';
import type { CagedForm } from './data/chords';
import { CHORD_VOICINGS } from './data/chords';
import { SCALES } from './data/scales';
import { getScaleNotes, transposeCagedForm } from './utils/music';
import type { NoteLabel } from './utils/music';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import CircleOfFifths from './components/CircleOfFifths';
import Fretboard from './components/Fretboard';
import ChordDiagram from './components/ChordDiagram';
import PlaybackControls from './components/PlaybackControls';
import DiatonicChords from './components/DiatonicChords';

type Mode = 'scale' | 'chord';

export default function App() {
  const [mode, setMode] = useState<Mode>('scale');
  const [root, setRoot] = useState<NoteName>('C');
  const [scaleIndex, setScaleIndex] = useState(0);
  const [chordType, setChordType] = useState('major');
  const [cagedForm, setCagedForm] = useState<CagedForm | null>(null);
  const [labelMode, setLabelMode] = useState<NoteLabel>('note');
  const [volume, setVolume] = useState(0.5);

  const handleSelectDiatonicChord = (chordRoot: NoteName, suffix: string) => {
    setRoot(chordRoot);
    setChordType(suffix);
    setCagedForm(null);
    setMode('chord');
  };

  const scale = SCALES[scaleIndex];
  const highlightedNotes = getScaleNotes(root, scale.intervals);

  // コード音再生用の frets 配列を取得
  const chordFrets = mode === 'chord'
    ? cagedForm
      ? transposeCagedForm(cagedForm, chordType, root)?.frets ?? null
      : CHORD_VOICINGS[`${root}-${chordType}`]?.frets ?? null
    : null;

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
          <h2 className="text-4xl font-extrabold text-slate-700 mb-4 flex items-center gap-3">
            <span className="text-4xl font-extrabold text-slate-700">
              {root}
            </span>
            {title}
          </h2>
          {mode === 'scale' ? (
            <>
              <Fretboard
                root={root}
                highlightedNotes={highlightedNotes}
                mode="scale"
                labelMode={labelMode}
              />
              <DiatonicChords
                root={root}
                intervals={scale.intervals}
                onSelectChord={handleSelectDiatonicChord}
              />
            </>
          ) : (
            <ChordDiagram
              root={root}
              chordType={chordType}
              labelMode={labelMode}
              cagedForm={cagedForm}
            />
          )}
          {mode === 'chord' && (
            <PlaybackControls
              frets={chordFrets}
              volume={volume}
              onVolumeChange={setVolume}
            />
          )}
        </div>
      </section>

      {/* Control panel + 五度圏 */}
      <section className="w-full px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-auto md:flex-shrink-0 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-5">
            <CircleOfFifths root={root} onRootChange={setRoot} />
          </div>
          <div className="flex-1 min-w-0">
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
        </div>
      </section>
    </div>
  );
}

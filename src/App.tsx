import { useState, useEffect } from 'react';
import type { NoteName } from './data/notes';
import type { CagedForm } from './data/chords';
import { CHORD_VOICINGS } from './data/chords';
import { SCALES } from './data/scales';
import { getScaleNotes, transposeCagedForm } from './utils/music';
import type { NoteLabel } from './utils/music';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Fretboard from './components/Fretboard';
import ChordDiagram, { ChordNotes } from './components/ChordDiagram';
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(d => !d)} />

      {/* Fretboard - 上側・横幅いっぱい */}
      <section className="w-full px-4 pt-5 pb-2">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 p-5">
          <h2 className="text-4xl font-extrabold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-3">
            <span className="text-4xl font-extrabold text-slate-700 dark:text-slate-200">
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

          {/* Shared bottom row: diatonic chords (scale) or chord notes + playback (chord) */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 min-h-[3.5rem]">
            {mode === 'scale' ? (
              <DiatonicChords
                root={root}
                intervals={scale.intervals}
                onSelectChord={handleSelectDiatonicChord}
              />
            ) : (
              <>
                {chordFrets ? <ChordNotes frets={chordFrets} root={root} /> : <div />}
                <PlaybackControls
                  frets={chordFrets}
                  volume={volume}
                  onVolumeChange={setVolume}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Control panel */}
      <section className="w-full px-4 py-4">
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
      </section>

      <footer className="px-4 pb-5 text-center text-xs text-slate-500 dark:text-slate-400">
        AI生成のため、コードや指番号は正確でない場合があります。
      </footer>
    </div>
  );
}

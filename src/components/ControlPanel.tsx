import { NOTE_NAMES, type NoteName } from '../data/notes';
import { SCALES } from '../data/scales';
import { CHORD_TYPES, CAGED_FORMS } from '../data/chords';
import type { CagedForm } from '../data/chords';
import type { NoteLabel } from '../utils/music';
import CircleOfFifths from './CircleOfFifths';
import type { CircleQuality } from './CircleOfFifths';

type Mode = 'scale' | 'chord';

const LABEL_OPTIONS: { value: NoteLabel; label: string }[] = [
  { value: 'note', label: '音名' },
  { value: 'degree', label: '度数' },
  { value: 'finger', label: '指番号' },
];

const ROOT_LABELS: Record<NoteName, string> = {
  C: 'C', 'C#': 'C♯/D♭', D: 'D', 'D#': 'D♯/E♭', E: 'E', F: 'F',
  'F#': 'F♯/G♭', G: 'G', 'G#': 'G♯/A♭', A: 'A', 'A#': 'A♯/B♭', B: 'B',
};

const CAGED_CHORD_TYPES = new Set(['major', 'minor', '7', 'm7', 'maj7']);

interface ControlPanelProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  root: NoteName;
  onRootChange: (root: NoteName) => void;
  scaleIndex: number;
  onScaleChange: (index: number) => void;
  chordType: string;
  onChordTypeChange: (type: string) => void;
  cagedForm: CagedForm | null;
  onCagedFormChange: (form: CagedForm | null) => void;
  labelMode: NoteLabel;
  onLabelModeChange: (mode: NoteLabel) => void;
}

export default function ControlPanel({
  mode,
  onModeChange,
  root,
  onRootChange,
  scaleIndex,
  onScaleChange,
  chordType,
  onChordTypeChange,
  cagedForm,
  onCagedFormChange,
  labelMode,
  onLabelModeChange,
}: ControlPanelProps) {
  const inactiveBtn = 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95';
  const visibleChordTypes = cagedForm
    ? CHORD_TYPES.filter((type) => CAGED_CHORD_TYPES.has(type.suffix))
    : CHORD_TYPES;
  const circleQuality: CircleQuality | null = mode === 'scale'
    ? scaleIndex === 0 ? 'major' : scaleIndex === 1 ? 'minor' : null
    : chordType === 'major' || chordType === 'minor' ? chordType : null;
  const handleCircleSelect = (note: NoteName, quality: CircleQuality) => {
    onRootChange(note);
    if (mode === 'scale') onScaleChange(quality === 'major' ? 0 : 1);
    else onChordTypeChange(quality);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 p-5 border border-slate-100 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Col 1: モード + ルート音 */}
        <div className="space-y-4">
          <div className="flex gap-1.5">
            <button
              className={`flex-1 py-3.5 px-4 rounded-xl text-base font-extrabold transition-all duration-200 ${
                mode === 'scale'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              onClick={() => onModeChange('scale')}
            >
              スケール
            </button>
            <button
              className={`flex-1 py-3.5 px-4 rounded-xl text-base font-extrabold transition-all duration-200 ${
                mode === 'chord'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              onClick={() => onModeChange('chord')}
            >
              コード
            </button>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              ルート音
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  className={`py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                    root === note
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200 scale-105'
                      : inactiveBtn
                  }`}
                  onClick={() => onRootChange(note)}
                >
                  <span className="text-sm">{ROOT_LABELS[note]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: スケール or コードタイプ + CAGED */}
        <div className="space-y-4">
          {mode === 'scale' ? (
            <div>
              <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                スケール
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SCALES.map((scale, i) => (
                  <button
                    key={scale.name}
                    className={`px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      scaleIndex === i
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200'
                        : inactiveBtn
                    }`}
                    onClick={() => onScaleChange(i)}
                  >
                    {scale.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  コードタイプ
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {visibleChordTypes.map((ct) => (
                    <button
                      key={ct.suffix}
                      className={`py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                        chordType === ct.suffix
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200'
                          : inactiveBtn
                      }`}
                      onClick={() => onChordTypeChange(ct.suffix)}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  CAGED フォーム
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {CAGED_FORMS.map((form) => (
                    <button
                      key={form}
                      className={`py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                        cagedForm === form
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                          : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 active:scale-95'
                      }`}
                      onClick={() => {
                        const nextForm = cagedForm === form ? null : form;
                        if (nextForm && !CAGED_CHORD_TYPES.has(chordType)) onChordTypeChange('major');
                        onCagedFormChange(nextForm);
                      }}
                    >
                      {form} フォーム
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Col 3: 五度圏 */}
        <div>
          <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Circle of Fifths
          </label>
          <CircleOfFifths root={root} quality={circleQuality} onSelect={handleCircleSelect} />
        </div>

        {/* Col 4: 表示切替 */}
        <div>
          <label className="block text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            表示
          </label>
          <div className="flex gap-1.5">
            {LABEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`flex-1 py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                  labelMode === opt.value
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                onClick={() => onLabelModeChange(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

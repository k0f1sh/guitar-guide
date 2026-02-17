import { NOTE_NAMES, type NoteName } from '../data/notes';
import { SCALES } from '../data/scales';
import { CHORD_TYPES, CAGED_FORMS } from '../data/chords';
import type { CagedForm } from '../data/chords';
import type { NoteLabel } from '../utils/music';

type Mode = 'scale' | 'chord';

const LABEL_OPTIONS: { value: NoteLabel; label: string }[] = [
  { value: 'note', label: '音名' },
  { value: 'degree', label: '度数' },
  { value: 'finger', label: '指番号' },
];

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
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-5 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Col 1: モード + ルート音 */}
        <div className="space-y-4">
          <div className="flex gap-1.5">
            <button
              className={`flex-1 py-3.5 px-4 rounded-xl text-base font-extrabold transition-all duration-200 ${
                mode === 'scale'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
              onClick={() => onModeChange('scale')}
            >
              スケール
            </button>
            <button
              className={`flex-1 py-3.5 px-4 rounded-xl text-base font-extrabold transition-all duration-200 ${
                mode === 'chord'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
              onClick={() => onModeChange('chord')}
            >
              コード
            </button>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              ルート音
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {NOTE_NAMES.map((note) => (
                <button
                  key={note}
                  className={`py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                    root === note
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200 scale-105'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95'
                  }`}
                  onClick={() => onRootChange(note)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: スケール or コードタイプ */}
        <div>
          {mode === 'scale' ? (
            <>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                スケール
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SCALES.map((scale, i) => (
                  <button
                    key={scale.name}
                    className={`px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      scaleIndex === i
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95'
                    }`}
                    onClick={() => onScaleChange(i)}
                  >
                    {scale.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                コードタイプ
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {CHORD_TYPES.map((ct) => (
                  <button
                    key={ct.suffix}
                    className={`py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                      chordType === ct.suffix
                        ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95'
                    }`}
                    onClick={() => onChordTypeChange(ct.suffix)}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Col 3: CAGED (コードモード時) or 凡例 */}
        <div>
          {mode === 'chord' ? (
            <>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                CAGED フォーム
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {CAGED_FORMS.map((form) => (
                  <button
                    key={form}
                    className={`py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                      cagedForm === form
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 active:scale-95'
                    }`}
                    onClick={() => onCagedFormChange(cagedForm === form ? null : form)}
                  >
                    {form} フォーム
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">凡例</p>
              <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-500 inline-block" />
                  ルート音
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-500 inline-block" />
                  スケール音
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Col 4: 表示切替 + 凡例(コード時) */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              表示
            </label>
            <div className="flex gap-1.5">
              {LABEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`flex-1 py-3 rounded-xl text-base font-extrabold transition-all duration-200 ${
                    labelMode === opt.value
                      ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                  onClick={() => onLabelModeChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'chord' && (
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">凡例</p>
              <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-500 inline-block" />
                  ルート
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-400 inline-block" />
                  コード音
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-rose-500 font-extrabold">×</span>
                  ミュート
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full border-2 border-slate-400 inline-block" />
                  開放弦
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

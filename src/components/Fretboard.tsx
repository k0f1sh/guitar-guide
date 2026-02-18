import { FRET_COUNT, FRET_MARKERS, DOUBLE_MARKERS, STANDARD_TUNING } from '../data/notes';
import type { NoteName } from '../data/notes';
import { getNoteAtFret } from '../utils/music';
import type { NoteLabel } from '../utils/music';
import FretboardNote from './FretboardNote';

interface FretboardProps {
  root: NoteName;
  highlightedNotes: NoteName[];
  mode: 'scale' | 'chord';
  labelMode: NoteLabel;
  chordFrets?: number[];
  chordFingers?: number[];
}

const PADDING_LEFT = 40;
const PADDING_RIGHT = 10;
const PADDING_TOP = 40;
const PADDING_BOTTOM = 45;
const STRING_SPACING = 32;
const NUM_STRINGS = 6;

// フレット位置（ハイフレットをやや狭くしつつ横幅を有効活用）
function fretPosition(fret: number, totalWidth: number): number {
  if (fret === 0) return 0;
  // 均等配置と物理比率のブレンド（0.7 = ほぼ均等寄り）
  const uniform = fret / FRET_COUNT;
  const physical = 1 - Math.pow(2, -fret / 12);
  const ratio = uniform * 0.7 + physical * 0.3;
  return ratio * totalWidth;
}

const BOARD_WIDTH = 1400;
const TOTAL_WIDTH = PADDING_LEFT + BOARD_WIDTH + PADDING_RIGHT;
const TOTAL_HEIGHT = PADDING_TOP + STRING_SPACING * (NUM_STRINGS - 1) + PADDING_BOTTOM;

export default function Fretboard({
  root,
  highlightedNotes,
  mode,
  labelMode,
  chordFrets,
  chordFingers,
}: FretboardProps) {
  // コードデータは6弦→1弦の順、描画は1弦(上)→6弦(下)なので反転
  const displayChordFrets = chordFrets ? [...chordFrets].reverse() : undefined;
  const displayChordFingers = chordFingers ? [...chordFingers].reverse() : undefined;

  const stringY = (stringIndex: number) => PADDING_TOP + stringIndex * STRING_SPACING;
  const fretX = (fret: number) => PADDING_LEFT + fretPosition(fret, BOARD_WIDTH);
  const noteCenterX = (fret: number) =>
    fret === 0
      ? PADDING_LEFT - 16
      : (fretX(fret - 1) + fretX(fret)) / 2;

  return (
    <svg
      viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}
      className="w-full drop-shadow-xl"
      role="img"
      aria-label="ギター指板"
    >
      <defs>
        <linearGradient id="grad-root" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--fb-grad-root-1)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--fb-grad-root-2)' }} />
        </linearGradient>
        <linearGradient id="grad-scale" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--fb-grad-scale-1)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--fb-grad-scale-2)' }} />
        </linearGradient>
        <linearGradient id="grad-chord" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--fb-grad-chord-1)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--fb-grad-chord-2)' }} />
        </linearGradient>
        <linearGradient id="wood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--fb-wood-1)' }} />
          <stop offset="50%" style={{ stopColor: 'var(--fb-wood-2)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--fb-wood-3)' }} />
        </linearGradient>
        <filter id="board-shadow" x="-1%" y="-5%" width="102%" height="115%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" style={{ floodColor: 'var(--fb-shadow-color)' }} floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Fretboard background */}
      <rect
        x={PADDING_LEFT}
        y={PADDING_TOP - 12}
        width={BOARD_WIDTH}
        height={STRING_SPACING * (NUM_STRINGS - 1) + 24}
        fill="url(#wood)"
        rx={6}
        filter="url(#board-shadow)"
      />

      {/* Nut */}
      <rect
        x={PADDING_LEFT - 4}
        y={PADDING_TOP - 12}
        width={7}
        height={STRING_SPACING * (NUM_STRINGS - 1) + 24}
        fill="var(--fb-nut)"
        rx={2}
        stroke="var(--fb-nut-stroke)"
        strokeWidth={0.5}
      />

      {/* Fret wires */}
      {Array.from({ length: FRET_COUNT }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={fretX(i + 1)}
          y1={PADDING_TOP - 12}
          x2={fretX(i + 1)}
          y2={PADDING_TOP + STRING_SPACING * (NUM_STRINGS - 1) + 12}
          stroke="var(--fb-fret-wire)"
          strokeWidth={2.5}
          opacity={0.7}
        />
      ))}

      {/* Fret markers (inlays) */}
      {FRET_MARKERS.map((fret) => {
        const cx = noteCenterX(fret);
        if (DOUBLE_MARKERS.includes(fret)) {
          return (
            <g key={`marker-${fret}`}>
              <circle cx={cx} cy={stringY(1)} r={7} fill="var(--fb-inlay)" opacity={0.6} />
              <circle cx={cx} cy={stringY(4)} r={7} fill="var(--fb-inlay)" opacity={0.6} />
            </g>
          );
        }
        return (
          <circle
            key={`marker-${fret}`}
            cx={cx}
            cy={PADDING_TOP + (STRING_SPACING * (NUM_STRINGS - 1)) / 2}
            r={7}
            fill="var(--fb-inlay)"
            opacity={0.6}
          />
        );
      })}

      {/* Strings */}
      {Array.from({ length: NUM_STRINGS }, (_, i) => (
        <g key={`string-${i}`}>
          <line
            x1={PADDING_LEFT}
            y1={stringY(i) + 1}
            x2={PADDING_LEFT + BOARD_WIDTH}
            y2={stringY(i) + 1}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth={1.5 + i * 0.5}
          />
          <line
            x1={PADDING_LEFT}
            y1={stringY(i)}
            x2={PADDING_LEFT + BOARD_WIDTH}
            y2={stringY(i)}
            stroke={i < 3 ? 'var(--fb-string-hi)' : 'var(--fb-string-lo)'}
            strokeWidth={1 + i * 0.5}
          />
        </g>
      ))}

      {/* Fret numbers */}
      {Array.from({ length: FRET_COUNT }, (_, i) => (
        <text
          key={`fretnum-${i}`}
          x={noteCenterX(i + 1)}
          y={TOTAL_HEIGHT - 6}
          textAnchor="middle"
          fill="var(--fb-fret-num)"
          fontSize={16}
          fontWeight="800"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {i + 1}
        </text>
      ))}

      {/* Chord mode: mute/open indicators */}
      {mode === 'chord' && displayChordFrets && (
        <>
          {displayChordFrets.map((fret, stringIdx) => {
            const y = stringY(stringIdx);
            const x = PADDING_LEFT - 16;
            if (fret === -1) {
              return (
                <text
                  key={`mute-${stringIdx}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#F43F5E"
                  fontSize={24}
                  fontWeight="800"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  ×
                </text>
              );
            }
            if (fret === 0) {
              return (
                <circle
                  key={`open-${stringIdx}`}
                  cx={x}
                  cy={y}
                  r={9}
                  fill="none"
                  stroke="var(--fb-open-stroke)"
                  strokeWidth={2.5}
                />
              );
            }
            return null;
          })}
        </>
      )}

      {/* Notes */}
      {STANDARD_TUNING.map((openNote, stringIdx) =>
        Array.from({ length: FRET_COUNT + 1 }, (_, fret) => {
          const note = getNoteAtFret(openNote, fret);
          const isRoot = note === root;

          if (mode === 'chord' && displayChordFrets) {
            const isChordNote = displayChordFrets[stringIdx] === fret && fret >= 0;
            if (!isChordNote) return null;
            return (
              <FretboardNote
                key={`${stringIdx}-${fret}`}
                note={note}
                root={root}
                x={noteCenterX(fret)}
                y={stringY(stringIdx)}
                isRoot={isRoot}
                isHighlighted={false}
                isChordNote
                finger={displayChordFingers?.[stringIdx]}
                labelMode={labelMode}
              />
            );
          }

          const isHighlighted = highlightedNotes.includes(note);
          return (
            <FretboardNote
              key={`${stringIdx}-${fret}`}
              note={note}
              root={root}
              x={noteCenterX(fret)}
              y={stringY(stringIdx)}
              isRoot={isRoot}
              isHighlighted={isHighlighted}
              labelMode={labelMode}
            />
          );
        }),
      )}
    </svg>
  );
}

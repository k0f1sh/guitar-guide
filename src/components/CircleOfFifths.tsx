import { useState } from 'react';
import type { NoteName } from '../data/notes';

const CIRCLE_ORDER: NoteName[] = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

const KEY_SIGNATURES: Record<string, string> = {
  C: '', G: '1♯', D: '2♯', A: '3♯', E: '4♯', B: '5♯',
  'F#': '6♯', 'C#': '7♯', 'G#': '4♭', 'D#': '3♭', 'A#': '2♭', F: '1♭',
};

const RELATIVE_MINORS: Record<string, string> = {
  C: 'Am', G: 'Em', D: 'Bm', A: 'F♯m', E: 'C♯m', B: 'G♯m',
  'F#': 'D♯m', 'C#': 'A♯m', 'G#': 'Fm', 'D#': 'Cm', 'A#': 'Gm', F: 'Dm',
};

// Root note to set when clicking a minor sector
const RELATIVE_MINOR_ROOTS: Record<string, NoteName> = {
  C: 'A', G: 'E', D: 'B', A: 'F#', E: 'C#', B: 'G#',
  'F#': 'D#', 'C#': 'A#', 'G#': 'F', 'D#': 'C', 'A#': 'G', F: 'D',
};

interface CircleOfFifthsProps {
  root: NoteName;
  onRootChange?: (note: NoteName) => void;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number) {
  const outerStart = polarToCartesian(cx, cy, outerR, startDeg);
  const outerEnd = polarToCartesian(cx, cy, outerR, endDeg);
  const innerStart = polarToCartesian(cx, cy, innerR, startDeg);
  const innerEnd = polarToCartesian(cx, cy, innerR, endDeg);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export default function CircleOfFifths({ root, onRootChange }: CircleOfFifthsProps) {
  const [hoveredMajor, setHoveredMajor] = useState<NoteName | null>(null);
  const [hoveredMinor, setHoveredMinor] = useState<string | null>(null);
  const interactive = !!onRootChange;

  const cx = 100, cy = 100;
  const outerR = 92;
  const midR = 52;       // major inner / minor outer boundary
  const minorInnerR = 36; // minor inner edge (larger → bigger center)
  const noteR = 76;
  const sigR = 61;
  const minorNoteR = 44;  // midpoint of minorInnerR(36) and midR(52)

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[330px] mx-auto select-none">
      {CIRCLE_ORDER.map((note, i) => {
        const startDeg = -105 + i * 30;
        const endDeg = -105 + (i + 1) * 30;
        const midDeg = startDeg + 15;
        const textPos = polarToCartesian(cx, cy, noteR, midDeg);
        const sigPos = polarToCartesian(cx, cy, sigR, midDeg);
        const minorPos = polarToCartesian(cx, cy, minorNoteR, midDeg);

        const isMajorSelected = note === root;
        const isMajorHovered = interactive && note === hoveredMajor;
        const isMinorSelected = RELATIVE_MINOR_ROOTS[note] === root;
        const isMinorHovered = interactive && hoveredMinor === note;
        let majorFill = '#F1F5F9';
        if (isMajorSelected) majorFill = '#FDA4AF';
        else if (isMajorHovered) majorFill = '#E2E8F0';

        let minorFill = '#EEF2FF';
        if (isMinorSelected) minorFill = '#C7D2FE';
        else if (isMinorHovered) minorFill = '#E0E7FF';

        return (
          <g key={note}>
            {/* Major ring sector */}
            <path
              d={sectorPath(cx, cy, outerR, midR, startDeg, endDeg)}
              fill={majorFill}
              stroke="white"
              strokeWidth="2"
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onClick={interactive ? () => onRootChange!(note) : undefined}
              onMouseEnter={interactive ? () => setHoveredMajor(note) : undefined}
              onMouseLeave={interactive ? () => setHoveredMajor(null) : undefined}
            />
            {/* Minor ring sector */}
            <path
              d={sectorPath(cx, cy, midR, minorInnerR, startDeg, endDeg)}
              fill={minorFill}
              stroke="white"
              strokeWidth="2"
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onClick={interactive ? () => onRootChange!(RELATIVE_MINOR_ROOTS[note]) : undefined}
              onMouseEnter={interactive ? () => setHoveredMinor(note) : undefined}
              onMouseLeave={interactive ? () => setHoveredMinor(null) : undefined}
            />

            {/* Major note name */}
            <text
              x={textPos.x}
              y={textPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="bold"
              fill={isMajorSelected ? '#9f1239' : '#334155'}
              style={{ pointerEvents: 'none' }}
            >
              {note}
            </text>
            {/* Major key signature */}
            {KEY_SIGNATURES[note] && (
              <text
                x={sigPos.x}
                y={sigPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7"
                fill={isMajorSelected ? '#be123c' : '#64748b'}
                style={{ pointerEvents: 'none' }}
              >
                {KEY_SIGNATURES[note]}
              </text>
            )}
            {/* Relative minor label */}
            <text
              x={minorPos.x}
              y={minorPos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="7"
              fontWeight={isMinorSelected ? 'bold' : 'normal'}
              fill={isMinorSelected ? '#3730a3' : '#4338ca'}
              style={{ pointerEvents: 'none' }}
            >
              {RELATIVE_MINORS[note]}
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={minorInnerR - 3} fill="white" stroke="#E2E8F0" strokeWidth="1.5" />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="bold"
        fill="#be123c"
        style={{ pointerEvents: 'none' }}
      >
        {root}
      </text>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fill="#64748b"
        style={{ pointerEvents: 'none' }}
      >
        {KEY_SIGNATURES[root] || '♮'}
      </text>
    </svg>
  );
}

import { useState } from 'react';
import type { NoteName } from '../data/notes';

export type CircleQuality = 'major' | 'minor';

const CIRCLE_KEYS: Array<{
  root: NoteName;
  label: string;
  signature: string;
  relativeRoot: NoteName;
  relativeLabel: string;
}> = [
  { root: 'C', label: 'C', signature: '♮', relativeRoot: 'A', relativeLabel: 'Am' },
  { root: 'G', label: 'G', signature: '1♯', relativeRoot: 'E', relativeLabel: 'Em' },
  { root: 'D', label: 'D', signature: '2♯', relativeRoot: 'B', relativeLabel: 'Bm' },
  { root: 'A', label: 'A', signature: '3♯', relativeRoot: 'F#', relativeLabel: 'F♯m' },
  { root: 'E', label: 'E', signature: '4♯', relativeRoot: 'C#', relativeLabel: 'C♯m' },
  { root: 'B', label: 'B', signature: '5♯', relativeRoot: 'G#', relativeLabel: 'G♯m' },
  { root: 'F#', label: 'F♯', signature: '6♯', relativeRoot: 'D#', relativeLabel: 'D♯m' },
  { root: 'C#', label: 'D♭', signature: '5♭', relativeRoot: 'A#', relativeLabel: 'B♭m' },
  { root: 'G#', label: 'A♭', signature: '4♭', relativeRoot: 'F', relativeLabel: 'Fm' },
  { root: 'D#', label: 'E♭', signature: '3♭', relativeRoot: 'C', relativeLabel: 'Cm' },
  { root: 'A#', label: 'B♭', signature: '2♭', relativeRoot: 'G', relativeLabel: 'Gm' },
  { root: 'F', label: 'F', signature: '1♭', relativeRoot: 'D', relativeLabel: 'Dm' },
];

interface CircleOfFifthsProps {
  root: NoteName;
  quality: CircleQuality | null;
  onSelect?: (note: NoteName, quality: CircleQuality) => void;
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

export default function CircleOfFifths({ root, quality, onSelect }: CircleOfFifthsProps) {
  const [hoveredMajor, setHoveredMajor] = useState<NoteName | null>(null);
  const [hoveredMinor, setHoveredMinor] = useState<string | null>(null);
  const interactive = !!onSelect;
  const selectedKey = quality === 'major'
    ? CIRCLE_KEYS.find((key) => key.root === root)
    : quality === 'minor'
      ? CIRCLE_KEYS.find((key) => key.relativeRoot === root)
      : undefined;
  const centerLabel = quality === 'minor'
    ? selectedKey?.relativeLabel.replace(/m$/, '') ?? root
    : selectedKey?.label ?? root;
  const selectedIndex = quality === 'major'
    ? CIRCLE_KEYS.findIndex((key) => key.root === root)
    : quality === 'minor'
      ? CIRCLE_KEYS.findIndex((key) => key.relativeRoot === root)
      : -1;

  const cx = 100, cy = 100;
  const outerR = 92;
  const midR = 52;
  const minorInnerR = 36;
  const noteR = 76;
  const sigR = 61;
  const minorNoteR = 44;

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[330px] mx-auto select-none">
      {CIRCLE_KEYS.map((keyInfo, i) => {
        const note = keyInfo.root;
        const startDeg = -105 + i * 30;
        const endDeg = -105 + (i + 1) * 30;
        const midDeg = startDeg + 15;
        const textPos = polarToCartesian(cx, cy, noteR, midDeg);
        const sigPos = polarToCartesian(cx, cy, sigR, midDeg);
        const minorPos = polarToCartesian(cx, cy, minorNoteR, midDeg);

        const isMajorSelected = quality === 'major' && note === root;
        const isMajorHovered = interactive && note === hoveredMajor;
        const isMinorSelected = quality === 'minor' && keyInfo.relativeRoot === root;
        const isMinorHovered = interactive && hoveredMinor === note;

        let majorFill = 'var(--cof-major-default)';
        if (isMajorSelected) majorFill = '#FDA4AF';
        else if (isMajorHovered) majorFill = 'var(--cof-major-hover)';

        let minorFill = 'var(--cof-minor-default)';
        if (isMinorSelected) minorFill = '#C7D2FE';
        else if (isMinorHovered) minorFill = 'var(--cof-minor-hover)';

        return (
          <g key={note}>
            {/* Major ring sector */}
            <path
              className="cof-sector"
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-label={`${keyInfo.label}メジャーを選択`}
              d={sectorPath(cx, cy, outerR, midR, startDeg, endDeg)}
              fill={majorFill}
              stroke="var(--cof-stroke)"
              strokeWidth="2"
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onClick={interactive ? () => onSelect!(note, 'major') : undefined}
              onKeyDown={interactive ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect!(note, 'major');
              } : undefined}
              onMouseEnter={interactive ? () => setHoveredMajor(note) : undefined}
              onMouseLeave={interactive ? () => setHoveredMajor(null) : undefined}
            />
            {/* Minor ring sector */}
            <path
              className="cof-sector"
              role="button"
              tabIndex={interactive ? 0 : -1}
              aria-label={`${keyInfo.relativeLabel}を選択`}
              d={sectorPath(cx, cy, midR, minorInnerR, startDeg, endDeg)}
              fill={minorFill}
              stroke="var(--cof-stroke)"
              strokeWidth="2"
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              onClick={interactive ? () => onSelect!(keyInfo.relativeRoot, 'minor') : undefined}
              onKeyDown={interactive ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect!(keyInfo.relativeRoot, 'minor');
              } : undefined}
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
              fill={isMajorSelected ? 'var(--cof-text-major-sel)' : 'var(--cof-text-major)'}
              style={{ pointerEvents: 'none' }}
            >
              {keyInfo.label}
            </text>
            {/* Major key signature */}
            {keyInfo.signature !== '♮' && (
              <text
                x={sigPos.x}
                y={sigPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7"
                fill={isMajorSelected ? 'var(--cof-text-sig-sel)' : 'var(--cof-text-sig)'}
                style={{ pointerEvents: 'none' }}
              >
                {keyInfo.signature}
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
              fill={isMinorSelected ? 'var(--cof-text-minor-sel)' : 'var(--cof-text-minor)'}
              style={{ pointerEvents: 'none' }}
            >
              {keyInfo.relativeLabel}
            </text>
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={minorInnerR - 3} fill="var(--cof-center-bg)" stroke="var(--cof-center-stroke)" strokeWidth="1.5" />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="18"
        fontWeight="bold"
        fill="var(--cof-center-root)"
        style={{ pointerEvents: 'none' }}
      >
        {centerLabel}
      </text>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fill="var(--cof-center-sig)"
        style={{ pointerEvents: 'none' }}
      >
        {selectedKey?.signature ?? '—'}
      </text>

      {/* Draw the selected outline last so adjacent sectors cannot cover it. */}
      {selectedIndex >= 0 && quality && (
        <path
          d={sectorPath(
            cx,
            cy,
            quality === 'major' ? outerR : midR,
            quality === 'major' ? midR : minorInnerR,
            -105 + selectedIndex * 30,
            -105 + (selectedIndex + 1) * 30,
          )}
          fill="none"
          stroke={quality === 'major'
            ? 'var(--cof-major-selected-stroke)'
            : 'var(--cof-minor-selected-stroke)'}
          strokeWidth="3.5"
          strokeLinejoin="round"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

import type { NoteName } from '../data/notes';
import type { NoteLabel } from '../utils/music';
import { getDegreeName } from '../utils/music';

interface FretboardNoteProps {
  note: NoteName;
  root: NoteName;
  x: number;
  y: number;
  isRoot: boolean;
  isHighlighted: boolean;
  isChordNote?: boolean;
  finger?: number;
  labelMode: NoteLabel;
}

export default function FretboardNote({
  note,
  root,
  x,
  y,
  isRoot,
  isHighlighted,
  isChordNote,
  finger,
  labelMode,
}: FretboardNoteProps) {
  if (!isHighlighted && !isChordNote) return null;

  const gradientId = isRoot
    ? 'grad-root'
    : isChordNote
      ? 'grad-chord'
      : 'grad-scale';

  let label: string;
  if (labelMode === 'finger' && finger != null && finger > 0) {
    label = String(finger);
  } else if (labelMode === 'degree') {
    label = getDegreeName(root, note);
  } else {
    label = note;
  }

  return (
    <g>
      {/* Shadow */}
      <circle cx={x} cy={y + 2} r={16} fill="rgba(0,0,0,0.1)" />
      {/* Main circle */}
      <circle cx={x} cy={y} r={16} fill={`url(#${gradientId})`} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--fb-note-text)"
        fontSize={label.length > 2 ? 16 : 21}
        fontWeight="800"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

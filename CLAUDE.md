# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check (tsc -b) then build to dist/
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

There are no tests in this project.

## Architecture

This is a React + TypeScript SPA built with Vite and Tailwind CSS v4. It is deployed to GitHub Pages at `/guitar-guide/` (configured in `vite.config.ts`).

**App state** lives entirely in `src/App.tsx`. The two top-level modes are `'scale'` and `'chord'`, toggled by `ControlPanel`. All state is passed down as props — there is no context or external state library.

### Data layer (`src/data/`)

- `notes.ts` — chromatic pitch classes (C, C#, … B), standard guitar tuning (1→6 string order: E B G D A E), fret constants and position markers
- `scales.ts` — scale definitions as `{ name, intervals }` where `intervals` is a semitone array from root (e.g. major = `[0,2,4,5,7,9,11]`)
- `chords.ts` — two data structures:
  - `CHORD_VOICINGS`: flat lookup keyed `"root-suffix"` (e.g. `"C-major"`) for direct open/barre chord shapes
  - `CAGED_SHAPES`: lookup keyed `"form-suffix"` (e.g. `"E-major"`) for base shapes used to transpose via the CAGED system; `baseRoot` is the open-position root for that shape

### Music logic (`src/utils/music.ts`)

Core musical computations:
- `getScaleNotes(root, intervals)` → array of `NoteName`
- `getFretboardNotes()` → 6×25 matrix of notes (open string through fret 24)
- `getDiatonicChords(root, intervals)` → triads derived from a 7-note scale (returns empty array for pentatonic/blues scales)
- `transposeCagedForm(form, chordType, targetRoot)` → shifts a CAGED base shape by semitone offset to produce a `ChordVoicing`; returns `null` if that form+type combination isn't in `CAGED_SHAPES`
- `getDegreeName(root, note)` → interval label (R, b2, 2, … 7) for the degree label mode

### Component hierarchy

```
App
├── Header
├── ControlPanel          # mode / root / scale / chord / CAGED / label selectors
├── Fretboard (SVG)       # full-neck SVG, used in both scale and chord modes
│   └── FretboardNote     # individual note circle with conditional styling
├── ChordDiagram          # wraps Fretboard; resolves voicing from CHORD_VOICINGS or transposeCagedForm
├── DiatonicChords        # shown only in scale mode; calls getDiatonicChords → clickable chord buttons
└── PlaybackControls      # chord/strum playback buttons + volume slider
```

**Data flow for chord mode:** `App` resolves `chordFrets` (for audio) from either `transposeCagedForm` (CAGED selected) or `CHORD_VOICINGS` (no CAGED form). `ChordDiagram` independently performs the same lookup to pass frets/fingers to `Fretboard`. `PlaybackControls` receives the resolved frets directly.

**String order convention:** All data arrays use 6→1 string order (low E first). `Fretboard` reverses them internally for display (1→6, top to bottom in the SVG).

### Audio (`src/utils/audio.ts`)

Uses Web Audio API with a lazily-initialized singleton `AudioContext`. Exports `playChord` (all strings simultaneously) and `playStrum` (strings 80ms apart). Uses triangle oscillator with exponential gain decay.

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed). No CSS modules; all styling is inline Tailwind classes. Global styles in `src/index.css`.

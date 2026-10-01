# Deepfake Detective

A media-literacy game (React + Vite). Flow: welcome → S.U.R.E. framework
walkthrough → pick a school → Phase One (spot real vs. fake video clips) →
Phase Two (find the AI-edited regions in that school's image, then review the
answers).

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run preview  # serve the build
```

## Structure

```
public/               static assets served as-is
  videos/             Phase One clips (v1..v8)
  original.jpg        Phase Two challenge image
src/
  main.jsx            entry
  App.jsx             screen router + shared game state
  styles.css          all styles (ported from the original)
  data/
    scenarios.js      Phase One content + which ids are used
    schools.js        Phase Two schools: image + hotspots (title/reason) + time limit
  audio/audio.js      all Web Audio synthesis (lobby, SFX, music)
  screens/            Welcome, SchoolSelect, Learn, LearnPhaseTwo, PhaseOne, PhaseTwo, Results
  components/         Background, SurePopup, FeedbackOverlay
```

## Extending

- **Add/change video rounds:** edit `src/data/scenarios.js`. Add a scenario
  object, then list its `id` in `PHASE_ONE_SCENARIO_IDS`.
- **Add/change a school:** edit `src/data/schools.js` — add an entry with its
  `image` (drop the file in `public/`) and `hotspots` (percentage boxes with a
  `title`/`reason` for the answer-review panel).
- **Timers:** `QUESTION_TIME_LIMIT` (scenarios.js), `PHASE_TWO_TIME_LIMIT` (schools.js).

The hotspot editor from the original single-file version was intentionally not
ported (dev-only tool). Hotspot boxes are hand-authored in `schools.js`.

`reference-original.html` is the original single-file version, kept for reference.

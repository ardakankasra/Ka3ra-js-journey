# Ka3ra JS Journey

7-day focused sprint through JS core mechanics (types, scope, prototypes, async, memory, security, ES2025/26). Learning repo: day folders with runnable demo scripts + markdown notes. No app, no deps, no build.

## Dev environment

- Plain Node.js only. No package.json, no dependencies, no env vars, no CI.
- Run any exercise directly: `node <path/to/file.js>` (e.g. `node Day-01-Foundation/closure.js`)
- Later days (06+) use ES2025/26 syntax (Set operations, iterator helpers, Temporal) — needs a current Node.

## Repo layout

- `Day-01-Foundation/` — values, coercion, scope, hoisting, closure (+ `notes.md`)
- `DAy-02-Function-Objects/` — `01-this.js`, `02-prototype.js`, `03-class.js`, `04-mixin.js` (+ `note.md`)
- `day-03-async-control-flow/` — `01-property-descriptor.js` … `06-generator.js` (+ `note.md`)
- `README.md` — syllabus, concept one-liners, daily-log template; `progress.md` — completion status
- Days 04–07 folders do not exist yet; create as `day-0N-<topic>/` when starting a day.

## Build & test

- No build step, no test runner, no linter. Verify by running the file with `node` and checking `console.log` output.
- Exercise files contain `// ?` prediction comments — keep them; the workflow is predict output first, then run.

## Conventions

- New day: folder `day-0N-<kebab-topic>/` with numbered scripts `NN-<kebab-topic>.js` (e.g. `02-prototype.js`), one concept per file.
- Each script is self-contained and runnable top-to-bottom via `node`; demos print numbered sections (`console.log("1:", …)`).
- `"use strict";` is first line in day-03 files; day-01/02 files omit it — match the surrounding day folder.
- Notes live next to code (`note.md`/`notes.md`) and follow the README daily-log template: What I learned / Where this shows up in backend work / Trickiest part / One thing I'd explain.
- After finishing a day, update the Progress Tracker table in `README.md` and `progress.md`.

## Pitfalls

- Folder naming is inconsistent on disk (`Day-01-Foundation` vs `DAy-02-Function-Objects` vs `day-03-…`) and differs from the lowercase paths in the README structure diagram — use exact on-disk names in commands, do not "fix" casing (breaks git on Windows).
- Work happens on per-day branches (`day-02`, `day-03`, `day-04` exist); check `git branch` before adding a new day's work.
- Filenames contain a typo kept as-is: `Day-01-Foundation/reassigngment.js` — do not rename; other notes may reference it.

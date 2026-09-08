# apps

Two Next.js surfaces.

| App | Port | Job |
|---|---|---|
| `intake` | 3000 | The patient. PWA, XState interview runner, offline-capable. Not scaffolded yet. |
| `console` | 3001 | Staff. Queue, triage, the case record, documents/medications, and the standards/governance screens PS 26047 requires. Imported from the Hospital-Side-Panel design source (`git subtree`) and trimmed to PS scope — see docs/19-frontend-status.md for route-by-route LIVE/MOCK status. |

`clinician`, `triage` and `admin` as three separate apps — the original Day 0 plan — were
folded into `console` as one staff app once the route list turned out to overlap almost
entirely (queue/triage board/summary/sign/audit/analytics all live under one staff nav in
practice). Split them back out only if a real reason to run them on separate origins shows up.

`intake` scaffold with `pnpm create next-app@latest intake --ts --tailwind --app --src-dir` from
inside `apps/`, then wire `@careflow/ui` and `@careflow/contracts` as workspace dependencies —
`@careflow/ui` today only covers the staff density (see docs/16-design-system.md); the patient
signage components it also needs (`BigButton`, `MicOrb`, `BodyMap`, `FaceScale`, …) are speced
but not yet built.

Design rules before you build a screen: `docs/10-ui-guidelines.md` (patient) and
`docs/16-design-system.md` (staff, and the colour rules that apply to both).

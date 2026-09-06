# apps

Four Next.js surfaces. Not scaffolded yet — Day 0/1 work.

| App | Port | Owner | Job |
|---|---|---|---|
| `intake` | 3000 | FE-1 | The patient. PWA, XState interview runner, offline-capable. |
| `clinician` | 3001 | FE-2 | The eight-second summary and sign-off. |
| `triage` | 3002 | FE-2 | Realtime red-flag board. Wall display and nurse tablet. |
| `admin` | 3003 | FE-2 | Impact analytics. |

Scaffold with `pnpm create next-app@latest <name> --ts --tailwind --app --src-dir` from inside
`apps/`, then wire `@careflow/ui` and `@careflow/contracts` as workspace dependencies.

Design rules before you build a screen: `docs/10-ui-guidelines.md`.

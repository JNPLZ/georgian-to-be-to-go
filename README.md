# Georgian Verbs — Quiz App

A small flashcard-style quiz app for practising Georgian verb conjugations at A1 level. Covers the verbs **to be** (ყოფნა) and **to go** (სიარული) across three tenses and all directional prefixes.

## Features

- **Quiz mode** — random questions, balanced across verbs, tenses, and prefixes; six grammatical persons
- **Configurable per round** — choose which verbs (to be / to go) and tenses (present, past, future) to practise; all selected by default on every load
- **Directional prefixes** — all nine directional prefixes for "to go" included; quiz shows a direction icon and accepts any valid conjugated form as correct
- **Instant feedback** — correct answers auto-advance with a pop animation; wrong answers show the correct form with a shake animation
- **Progress tracking** — live score and question counter during the round, summary at the end
- **Quit at any time** — click the app title or the "✕ Quit" button in the nav to exit a round
- **Cheatsheet** — full conjugation tables for both verbs; "to go" grouped by direction with a combined მი-/წა- entry (since they share forms) and scroll-fade indicators on small screens
- **UI language** — English (default), German, Russian; persisted to localStorage
- **Question count** — 10 / 20 / 30 questions per round; preference is saved between sessions
- **No tracking, no cookies**

> **Note:** Answers must be typed in Georgian script (Mkhedruli). Add a Georgian keyboard layout in your OS settings before you start.

## Tech stack

Vanilla TypeScript · Vite · CSS Modules · no frameworks · no backend

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build   # type-checks with tsc, then builds to dist/
npm run preview # serve the production build locally
```

## Deployment

The app is deployed automatically to GitHub Pages on every push to `main` via the included GitHub Actions workflow (`.github/workflows/deploy.yml`).

To enable it, go to your repository's **Settings → Pages** and set the source to **GitHub Actions**.

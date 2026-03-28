# Georgian Verbs — Quiz App

A small flashcard-style quiz app for practising Georgian verb conjugations at A1 level. Covers the verbs **to be** (ყოფნა) and **to go** (სიარული) across three tenses and all nine directional prefixes.

## Features

- **Quiz mode** — random questions across present, past (aorist), and future tenses for all six grammatical persons
- **Directional prefixes** — all nine prefixes for "to go" (მი-, მო-, შე-, გა-, ა-, ჩა-, გადა-, წა-, და-) included in the question pool
- **Instant feedback** — correct answers are confirmed, wrong answers show the correct form
- **Progress tracking** — live score and question counter during the round, summary screen at the end
- **Cheatsheet** — full conjugation tables for both verbs, browsable by prefix; always accessible via the nav
- **UI language** — English (default), German, Russian; persisted to localStorage
- **Settings persistence** — verb selection and question count are saved between sessions

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

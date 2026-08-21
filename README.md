# SQL 98: Digital Detective

![app demo](https://github.com/DevStrikerTech/sql98detective/blob/main/public/short_demo.gif?raw=true)

Boot the machine, read your precinct inbox, open case files, inspect suspicious logs and use SQL.exe to turn messy office gossip into proof. The goal is to feel like an investigation game first and an SQL-learning toy second: SQL is the detective tool, not the whole personality.

## Play The Pitch

You are the precinct's digital detective. Chief Brannigan keeps sending tiny office disasters to your inbox, and every disaster leaves a trail somewhere in the machine.

The current build includes:

- A draggable Windows 98-inspired desktop shell with Start menu, taskbar, dialogs and fake apps.
- Case 001: `THE MISSING SPREADSHEET`, a filesystem-and-log investigation about a vanished payroll file.
- Case 002: `THE PHANTOM PRINT JOB`, a lean lead-board case about an unclaimed printer incident.
- A fake SQL console that accepts small SELECT queries against in-game records.
- Case files, evidence stamps, clue progression, inbox follow-ups, retro audio cues and a first-run guide.

## Why This Exists

SQL exercises are usually presented like homework. This project wraps the same core skill in mystery, comedy and atmosphere: the player learns that a query is a way to ask a better question.

The design target is late-90s office software: chunky windows, tiny icons, over-serious dialogs, suspicious printers and the emotional weight of a missing `.xls` file.

## Tech Snapshot

- React
- TypeScript
- TanStack Start / Router
- Zustand
- Tailwind CSS
- Vite

## Run Locally

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run lint
npm run build
```

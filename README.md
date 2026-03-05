# Boaty McBoatface Fantasy F1 2026

A fantasy F1 league app where players snake-draft drivers, pick constructor teams, and compete across the 2026 season. Scores are calculated automatically from live race results via the Ergast F1 API.

## Features

- **Snake Draft** — Players draft 3 drivers each in a fair snake order (Round 1: 1→N, Round 2: N→1, Round 3: 1→N). Last year's winner gets the last pick in Round 1. Draft progress auto-saves so you can close the browser and resume later.
- **Constructor Pick** — Each player picks a constructor team. Podium finishes by that team's drivers earn bonus points (+0.5 standard, +1 for underdog teams).
- **Live Scoring** — Race results are fetched from the Ergast F1 API and scored automatically based on configurable rules in `scoring.json`.
- **Driver Tiers** — Drivers are classified as All Stars (top 6 from 2025), Rising Stars (1st/2nd year), or Underdogs (bottom 6 from 2025), each with unique scoring bonuses.
- **Leaderboard** — Championship standings with podium display.
- **Driver Standings** — Individual driver points with team colors and a bar chart.
- **Player Teams** — Detailed breakdown of each player's fantasy team with achievement badges and pie chart composition.
- **Roster** — Full 2026 F1 grid with all 11 teams, race drivers, and reserve/development drivers.
- **Hall of Fame** — Past fantasy league champions (2025: Ashley, Taylor, Ryan).
- **Rules** — Complete scoring reference with position points, bonuses, penalties, tier info, and draft explanation.

## Scoring

| Category | Points |
| --- | --- |
| P1–P10 finish | 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 |
| Fastest lap | +1 |
| Pole position | +0.5 |
| Podium streak (consecutive) | +0.5 |
| Underdog driver top 5 | +2 |
| Constructor team podium | +0.5 |
| Underdog team podium | +1 |
| DNF | -1.5 |

## Tech Stack

- **React** with functional components and hooks
- **React Router** (HashRouter) for client-side navigation
- **Tailwind CSS v3** with PostCSS build pipeline
- **Recharts** for charts (bar chart, pie chart)
- **Ergast F1 API** (via `api.jolpi.ca/ergast/f1`) for live race data
- **localStorage** for draft persistence and player config

## Quick Start

```bash
git clone https://github.com/ascchung/f1fantasy.git
cd f1fantasy
npm install
npm start
```

Visit `http://localhost:3000` to view the app.

## Build for Production

```bash
npm run build
```

This runs `postcss src/App.css -o src/output.css && react-scripts build`.

## Deploy

```bash
npm run deploy
```

Deploys the built app to GitHub Pages.

## Project Structure

```
src/
  Components/
    Leaderboard.jsx       — Championship standings & podium
    DriverStandings.jsx   — Driver points & bar chart
    PlayerBreakdown.jsx   — Player team analysis & badges
    FantasyDraft.jsx      — Snake draft with auto-save
    Roster.jsx            — Full 2026 F1 grid
    HallOfFame.jsx        — Past champions
    Rules.jsx             — Scoring rules reference
  data/
    players.json          — Default player/driver assignments
    scoring.json          — Scoring configuration
    driverTiers.js        — Tier classifications
  services/
    f1Api.js              — Ergast API client
    scoringEngine.js      — Points calculation
    playerConfig.js       — localStorage/fallback config helper
  App.js                  — Navigation & routing
  App.css                 — Tailwind source
  output.css              — Generated Tailwind output
```

---

## Archive: 2025 Season (v1)

<details>
<summary>Click to expand the original 2025 README</summary>

### F1 Fantasy (2025)

A fantasy F1 app displaying driver standings and player scores powered by Google Sheets.

#### Project Overview

This repository contained:

* **Express Backend** (`/backend`)
  Served Google Sheets data via REST endpoints:

  * `/drivers` — list of drivers, teams, and points
  * `/race-scores` — per-race points table
  * `/leaderboard` — overall player leaderboard

* **React Frontend** (`/src`)
  Displayed tables and charts using Recharts and TailwindCSS.

#### Prerequisites

* Node.js v16+ and npm
* Google Cloud service account with Sheets API enabled
* Git for version control

#### Environment Setup

1. Clone the repo

```bash
git clone https://github.com/ascchung/f1fantasy.git
cd f1fantasy
```

2. Install dependencies

```bash
npm install
```

#### Express Backend Setup

1. **Environment variables**
   Create `backend/.env` (ignored by Git) with:

   ```dotenv
   CLIENT_ORIGINS=http://localhost:3000,https://ascchung.github.io,https://f1fantasy-o25v.onrender.com
   PORT=3001
   SPREADSHEET_ID=<your_spreadsheet_id>
   GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-credentials.json
   ```

2. **Place your Google credentials**

   * Download the service-account JSON into `backend/secrets/google-credentials.json`
   * Ensure `backend/secrets/` is listed in `.gitignore`

3. **Start the backend**

```bash
npm run start-backend
```

Runs Express on `http://localhost:3001`.

#### React Frontend Setup

1. **Development proxy**
   In `package.json`:

   ```json
   "proxy": "http://localhost:3001",
   ```

2. **Production API URL**
   Create `.env.production` with:

   ```dotenv
   REACT_APP_API_URL=https://f1fantasy-o25v.onrender.com/api/f1-points
   ```

3. **Start all services**

```bash
npm start
```

Launched Express API, Tailwind CSS watcher, and React dev server.

#### Available Scripts (2025)

| Command | Description |
| --- | --- |
| `npm start` | Start backend, CSS watcher, and React dev server |
| `npm run build` | Build React app for production |
| `npm run deploy` | Deploy the built app to GitHub Pages |
| `npm run start-backend` | Start Express API only |

#### Notes

* **Data Source**: All driver and player data was pulled from Google Sheets.
* **Key Files**: `google-credentials.json` and `.env` files were kept out of source control.

</details>

### What Changed in 2026

| Area | 2025 (v1) | 2026 (v2) |
| --- | --- | --- |
| **Data source** | Google Sheets via Express backend | Ergast F1 API (no backend needed) |
| **Scoring** | Manual spreadsheet | Automated engine with `scoring.json` config |
| **Draft** | Manual JSON editing | Interactive snake draft with auto-save |
| **Constructor pick** | Not available | Players pick a team for podium bonuses |
| **Driver tiers** | Not available | All Stars / Rising Stars / Underdogs with bonus scoring |
| **Pages** | Leaderboard, Driver Standings, Player Teams | + Draft, Roster, Hall of Fame, Rules |
| **UI** | Colorful gradients, heavy animations | Clean dark minimal design with custom palette |
| **Persistence** | Server-side (Google Sheets) | Client-side (localStorage) |
| **Deployment** | Express + React (Render + GitHub Pages) | Static React app (GitHub Pages only) |

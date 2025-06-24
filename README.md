# F1 Fantasy

A fantasy F1 app displaying driver standings and player scores powered by Google Sheets.

## 🚀 Project Overview

This repository contains:

* **Express Backend** (`/backend`)
  Serves Google Sheets data via REST endpoints:

  * `/drivers` → list of drivers, teams, and points
  * `/race-scores` → per-race points table
  * `/leaderboard` → overall player leaderboard

* **React Frontend** (`/src`)
  Displays tables and charts using Recharts and TailwindCSS.

---

## 🛠️ Prerequisites

* **Node.js** v16+ and npm
* **Google Cloud service account** with Sheets API enabled
* **Git** for version control

---

## ⚙️ Environment Setup

### 1. Clone the repo

```bash
git clone https://github.com/ascchung/f1fantasy.git
cd f1fantasy
```

### 2. Install dependencies

```bash
npm install
```

---

## 📦 Express Backend Setup

1. **Environment variables**
   Create `backend/.env` (ignored by Git) with:

   ```dotenv
   # Allowed front-end origins (comma-separated)
   CLIENT_ORIGINS=http://localhost:3000,https://ascchung.github.io,https://f1fantasy-o25v.onrender.com

   # Express server port
   PORT=3001

   # Google Sheets credentials and ID
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

---

## 🎨 React Frontend Setup

1. **Development proxy**
   In `package.json`:

   ```json
   "proxy": "http://localhost:3001",
   ```

   This proxies `/api/f1-points/*` to your local backend.

2. **Production API URL**
   Create `.env.production` with:

   ```dotenv
   REACT_APP_API_URL=https://f1fantasy-o25v.onrender.com/api/f1-points
   ```

3. **Start all services**

```bash
npm start
```

Launches:

* Express API (`start-backend`)
* Tailwind CSS watcher (`start-css`)
* React dev server (`start-frontend`)

Visit `http://localhost:3000` to view the app.

---

## 🔧 Available Scripts

| Command                 | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `npm start`             | Start backend, CSS watcher, and React dev server |
| `npm run build`         | Build React app for production                   |
| `npm run deploy`        | Deploy the built app to GitHub Pages             |
| `npm run start-backend` | Start Express API only                           |

---

## 📂 `.gitignore`

```
# Node
node_modules/

# Secrets & dotenv
.env*
backend/secrets/

# Tailwind output
src/output.css
```

---

## 📖 Notes

* **Data Source**: All driver and player data is pulled from Google Sheets, ensuring easy updates by maintaining the spreadsheet.
* **Key Files**: Keep your `google-credentials.json` and `.env` files out of source control to protect sensitive information.

Happy racing! 🏎️🎉

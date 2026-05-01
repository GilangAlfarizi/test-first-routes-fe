# Pokedex Frontend

Simple frontend app for managing Pokemon data (list, sync, detail, update, delete).

## 1) What you need first

- [Node.js](https://nodejs.org/) `v20+` (recommended: latest LTS)
- npm (already included with Node.js)
- Backend API running

## 2) Clone and open the project

```bash
git clone https://github.com/GilangAlfarizi/test-first-routes-fe.git
cd test-first-routes-fe
```

## 3) Install dependencies

```bash
npm install
```

## 4) Setup environment variable

Create a file named `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Important:
- This frontend expects backend endpoints under `/pokemon`.
- Example request base: `http://localhost:8080/pokemon`

## 5) Run the app

```bash
npm run dev
```

Then open the URL shown in terminal (usually `http://localhost:5173`).

## 6) Make sure everything works

- You should see the Pokemon dashboard page.
- Try these quick checks:
  - Sync Pokemon by ID (example: `25`)
  - Open detail panel
  - Edit a Pokemon
  - Delete a Pokemon

If list is empty at start, that is normal. Sync one Pokemon first.

## 7) Useful commands

```bash
npm run lint     # check code quality
npm run build    # production build test
npm run preview  # preview production build
```

## Common setup issues

### Backend is not running
- Symptom: requests fail / no data loaded
- Fix: start backend first and confirm it runs on the same URL as `VITE_API_BASE_URL`

### Wrong API base URL
- Symptom: frontend opens, but all API calls fail
- Fix: check `.env` value and restart dev server after any `.env` change

### Port conflict
- Symptom: Vite fails to start or uses a different port
- Fix: stop other process on that port or use the new URL shown by Vite

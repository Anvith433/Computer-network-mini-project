# Chatbot Frontend

React + Vite chat client for the computer networks mini project. Each question takes this path:

```
Browser  ──HTTP POST /ask──▶  Flask backend (:5000)  ──TCP socket──▶  chatbot server (:12345)
```

## Running

```bash
npm install
npm run dev            # http://localhost:5173
npm run dev -- --host  # also reachable from other machines on the LAN
```

Start the Flask backend (`chatbot-backend/server.py`) and the socket server it points to first.

## Configuration

By default the app calls the backend on port `5000` of whatever host served the page, so it works both
on `localhost` and when opened from another machine via the LAN IP. To use a different backend, set
`VITE_API_URL`:

```bash
VITE_API_URL=http://192.168.1.20:5000 npm run dev
```

## Features

- Chat bubbles with timestamps and round-trip latency for every reply
- Connection status in the header that shows which hop failed: backend offline, socket server error, or timeout
- Typing indicator while waiting, and a Retry button on failed requests
- Multi-line input (<kbd>Shift</kbd> + <kbd>Enter</kbd>), suggested starter questions, and copy-to-clipboard
- Conversation saved in `localStorage`, light/dark theme toggle, responsive layout for phones

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start the dev server            |
| `npm run build`   | Production build into `dist/`   |
| `npm run preview` | Serve the production build      |
| `npm run lint`    | Run ESLint                      |

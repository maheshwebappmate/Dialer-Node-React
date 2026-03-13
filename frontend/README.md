# Custom Dialer (Frontend)

A free local test-mode dialer with SIP and WebRTC support. This React app provides a modern dialer interface with real-time call status and call history.

## Features

- **Dialer** — Place calls with a numeric keypad
- **Call log** — View call history
- **Status bar** — Real-time connection and call status via Socket.io
- **WebRTC** — Browser-based voice/video calling support

## Tech Stack

- **React 18** — UI framework
- **Create React App** — Build tooling
- **Socket.io Client** — Real-time communication with the backend
- **WebRTC Adapter** — Cross-browser WebRTC compatibility
- **styled-components** — Styling
- **react-icons** — Icons

## Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- A running Dialer backend (for full functionality)

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
```

Output is in the `build` folder.

### Run tests

```bash
npm test
```

## Project Structure

```
src/
├── App.js           # Main app, layout, Socket.io connection
├── App.css          # Global styles
├── index.js         # Entry point
└── components/
    ├── Dialer.js    # Dialer keypad and call controls
    ├── CallLog.js   # Call history list
    └── StatusBar.js # Connection/call status display
```

## Configuration

Create a `.env` file in the project root to override defaults:

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_WS_URL` | WebSocket/Socket.io backend URL | `http://localhost:3001` |

The app expects the Dialer backend to be running at this URL (e.g. `http://localhost:3001` for local development).

## License

Private project.

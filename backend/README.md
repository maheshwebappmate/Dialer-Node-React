# Dialer Backend

Custom dialer backend with SIP, WebRTC, and Smartflo click-to-call support. Built with Express and Socket.IO for real-time call state and signaling.

## Features

- **REST API** — Initiate, answer, and hang up calls
- **Socket.IO** — Real-time call events and WebRTC signaling
- **Asterisk/SIP** — Configurable SIP connection for traditional telephony
- **Smartflo** — Tata Tele Services Smartflo click-to-call API integration
- **WebRTC** — Offer/answer and ICE candidate relay for browser calls

## Prerequisites

- Node.js (v14 or later)
- (Optional) Asterisk for SIP
- (Optional) Smartflo API credentials for click-to-call

## Installation

```bash
npm install
```

## Configuration

1. Copy the environment template and create your `.env` file:

```bash
cp env-template.txt .env
```

2. Edit `.env` and set your values:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: 3001) |
| `ASTERISK_HOST` | Asterisk server host |
| `ASTERISK_PORT` | Asterisk SIP port (default: 5060) |
| `ASTERISK_USERNAME` | SIP username (e.g. extension) |
| `ASTERISK_SECRET` | SIP secret/password |
| `SMARTFLO_API_URL` | Smartflo API base URL |
| `SMARTFLO_API_TOKEN` | Smartflo API token |
| `SMARTFLO_AGENT_NUMBER` | Agent phone number for Smartflo |
| `SMARTFLO_CALLER_ID` | Caller ID for outbound Smartflo calls |
| `FRONTEND_URL` | Frontend app URL |
| `CORS_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:3000`) |

## Running the server

**Production:**
```bash
npm start
```

**Development (with auto-reload):**
```bash
npm run dev
```

The server listens on `0.0.0.0` so it can be reached from other machines. Default port is **3001**.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | API info and SIP config summary |
| GET | `/health` | Health check |
| GET | `/calls` | List active calls |
| POST | `/call` | Start a call (`from`, `to`, optional `type`) |
| POST | `/call/:callId/answer` | Mark call as answered |
| POST | `/call/:callId/hangup` | End a call |
| POST | `/smartflo/call` | Initiate click-to-call via Smartflo (`destination_number`, `agent_number`, optional `caller_id`, `custom_identifier`) |
| GET | `/smartflo/call/:callId/status` | Get status of a Smartflo call |

## Socket.IO Events

**Server → client**

- `connected` — Sent on connect; includes `socketId`, `sipConfig`, `activeCalls`
- `call:initiated` — New call started
- `call:ringing` — Call is ringing
- `call:answered` — Call was answered
- `call:ended` — Call ended

**Client → server**

- `call:initiate` — Start a call (`from`, `to`, optional `type`)
- `call:answer` — Answer a call (`callId`)
- `call:hangup` — Hang up (`callId`)
- `webrtc:offer` — Send WebRTC offer (`callId`, `offer`)
- `webrtc:answer` — Send WebRTC answer (`callId`, `answer`)
- `webrtc:ice-candidate` — Send ICE candidate (`callId`, `candidate`)

## License

MIT

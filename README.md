# Custom Dialer - Free Local Test-Mode SIP & WebRTC Dialer

A free, local, test-mode custom dialer built with Node.js, React, SIP, WebRTC, and Asterisk running in Docker containers.

## 🚀 Features

- **Modern React UI** with glassmorphism design
- **SIP Integration** via Asterisk PBX
- **WebRTC Support** for browser-based calling
- **Smartflo API Integration** for cloud-based calling
- **Real-time Communication** using Socket.IO
- **Docker-based** deployment for easy setup
- **Test Extensions** including echo test and music on hold
- **Call Logging** with active calls and history
- **Responsive Design** for mobile and desktop

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │  Asterisk PBX   │
│   (Port 3000)   │◄──►│   (Port 3001)   │◄──►│   (Port 5060)   │
│                 │    │                 │    │                 │
│ • Modern UI     │    │ • SIP Handling  │    │ • Call Routing  │
│ • WebRTC       │    │ • WebSocket     │    │ • Extensions    │
│ • Real-time    │    │ • Call Mgmt     │    │ • Media         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Modern web browser with WebRTC support

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd DIaler
```

### 2. Start the System

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Asterisk**: localhost:5060 (SIP)

## 🔧 Configuration

### Asterisk Extensions

The system comes with pre-configured test extensions:

- **1001, 1002, 1003**: Basic extensions with hello-world playback
- **999**: Echo test extension
- **888**: Music on hold
- **1XXX**: Extension-to-extension calling

### SIP Configuration

Default SIP credentials (set in `.env` from `backend/env-template.txt`):
- Username: `1001`
- Password: set via `ASTERISK_SECRET` in `.env`
- Host: `asterisk` (internal Docker network)

### Environment Variables

```bash
# Backend
NODE_ENV=development
ASTERISK_HOST=asterisk
ASTERISK_PORT=5060
ASTERISK_USERNAME=1001
ASTERISK_SECRET=your_asterisk_secret_here

# Smartflo API (Optional)
SMARTFLO_API_URL=https://api-smartflo.tatateleservices.com/v1
SMARTFLO_API_TOKEN=your_smartflo_api_token_here
SMARTFLO_AGENT_NUMBER=your_agent_number_here
SMARTFLO_CALLER_ID=your_caller_id_here

# Frontend
REACT_APP_BACKEND_URL=http://localhost:3001
REACT_APP_WS_URL=ws://localhost:3001
```

## 🧪 Testing

### 1. Basic Call Testing

1. Open the dialer at http://localhost:3000
2. Select your extension (1001, 1002, or 1003)
3. Dial a test extension:
   - `999` for echo test
   - `888` for music on hold
   - `1002` to call another extension

### 2. Extension-to-Extension Calls

1. Use extension `1001` to call `1002`
2. Answer the call from extension `1002`
3. Test audio communication

### 3. WebRTC Testing

The system supports WebRTC for browser-based calling:
- Modern browsers with WebRTC support
- Audio-only calls (can be extended to video)
- ICE candidate handling for NAT traversal

### 4. Smartflo API Testing

The system also supports cloud-based calling via Smartflo API:
- Toggle between SIP and Smartflo modes in the UI
- Make calls using Smartflo's cloud infrastructure
- Real-time call status updates via WebSocket
- Requires valid Smartflo API credentials

**Setup Smartflo:**
1. Copy `backend/env-template.txt` to `backend/.env`
2. Fill in your Smartflo API credentials
3. Restart the backend service
4. Toggle "Use Smartflo API" in the dialer UI

## 🛠️ Development

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### Docker Development

```bash
# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f asterisk
```

### File Structure

```
DIaler/
├── docker-compose.yml          # Main orchestration
├── README.md                   # This file
├── asterisk/                   # Asterisk configuration
│   └── config/
│       ├── asterisk.conf      # Main config
│       ├── sip.conf           # SIP settings
│       ├── extensions.conf    # Dialplan
│       ├── modules.conf       # Loaded modules
│       ├── http.conf          # HTTP API
│       └── ari.conf           # REST API
├── backend/                    # Node.js backend
│   ├── Dockerfile
│   ├── package.json
│   └── server.js              # Main server
└── frontend/                   # React frontend
    ├── Dockerfile
    ├── package.json
    ├── public/
    └── src/
        ├── components/         # React components
        │   ├── Dialer.js      # Main dialer
        │   ├── CallLog.js     # Call history
        │   └── StatusBar.js   # Status display
        ├── App.js             # Main app
        └── index.js           # Entry point
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :3001
   lsof -i :5060
   ```

2. **Docker Issues**
   ```bash
   # Clean up containers
   docker-compose down -v
   docker system prune -f
   ```

3. **Asterisk Not Starting**
   ```bash
   # Check Asterisk logs
   docker-compose logs asterisk
   
   # Access Asterisk CLI
   docker-compose exec asterisk asterisk -rvvv
   ```

4. **WebRTC Issues**
   - Ensure HTTPS in production
   - Check browser console for errors
   - Verify STUN/TURN server configuration

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Access container shell
docker-compose exec backend sh
docker-compose exec asterisk sh
```

## 🔒 Security Notes

⚠️ **This is a TEST system only!**

- Default passwords are used for testing
- No encryption or security measures implemented
- Not suitable for production use
- Asterisk is exposed on all interfaces

## 🚀 Production Considerations

For production deployment:

1. **Security**
   - Change default passwords
   - Implement TLS/SRTP
   - Restrict network access
   - Use proper certificates

2. **Scalability**
   - Load balancing
   - Database persistence
   - Monitoring and logging
   - Backup strategies

3. **Features**
   - User authentication
   - Call recording
   - Voicemail
   - Conference calling
   - Video support

## 📚 Resources

- [Asterisk Documentation](https://docs.asterisk.org/)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Socket.IO Documentation](https://socket.io/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Asterisk community for the excellent PBX system
- React team for the amazing frontend framework
- WebRTC community for browser communication standards
- Docker team for containerization technology

---

**Happy Dialing! 📞✨**

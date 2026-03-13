const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require('./config');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store active calls and connections
const activeCalls = new Map();
const userConnections = new Map();

// SIP configuration
const sipConfig = {
  host: config.ASTERISK_HOST,
  port: config.ASTERISK_PORT,
  username: config.ASTERISK_USERNAME,
  secret: config.ASTERISK_SECRET
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Custom Dialer Backend API',
    status: 'running',
    sipConfig: {
      host: sipConfig.host,
      port: sipConfig.port,
      username: sipConfig.username
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/calls', (req, res) => {
  res.json({
    activeCalls: Array.from(activeCalls.values()),
    totalCalls: activeCalls.size
  });
});

app.post('/call', (req, res) => {
  const { from, to, type = 'audio' } = req.body;
  
  if (!from || !to) {
    return res.status(400).json({ error: 'From and To are required' });
  }

  const callId = uuidv4();
  const call = {
    id: callId,
    from,
    to,
    type,
    status: 'initiating',
    startTime: new Date(),
    direction: 'outbound'
  };

  activeCalls.set(callId, call);
  
  // Emit call event to connected clients
  io.emit('call:initiated', call);
  
  res.json({ callId, status: 'initiated' });
});

app.post('/call/:callId/answer', (req, res) => {
  const { callId } = req.params;
  const call = activeCalls.get(callId);
  
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }
  
  call.status = 'answered';
  call.answerTime = new Date();
  activeCalls.set(callId, call);
  
  io.emit('call:answered', call);
  res.json({ status: 'answered' });
});

app.post('/call/:callId/hangup', (req, res) => {
  const { callId } = req.params;
  const call = activeCalls.get(callId);
  
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }
  
  call.status = 'ended';
  call.endTime = new Date();
  call.duration = call.endTime - call.startTime;
  
  activeCalls.delete(callId);
  
  io.emit('call:ended', call);
  res.json({ status: 'ended' });
});

// Smartflo Click to Call API endpoint
app.post('/smartflo/call', async (req, res) => {
  try {
    const { destination_number, agent_number, caller_id, custom_identifier } = req.body;
    
    // Validate required parameters
    if (!destination_number || !agent_number) {
      return res.status(400).json({ 
        error: 'destination_number and agent_number are required' 
      });
    }

    // Prepare Smartflo API request payload
    const smartfloPayload = {
      async: 1,
      // custom_identifier: "1008",
      agent_number: config.SMARTFLO_AGENT_NUMBER,
      destination_number,
      caller_id: config.SMARTFLO_CALLER_ID,
      get_call_id: 1
    };

    console.log('smartfloPayload', smartfloPayload);

    // Make request to Smartflo API
    const response = await axios.post(
      `${config.SMARTFLO_API_URL}/click_to_call`,
      smartfloPayload,
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `${config.SMARTFLO_API_TOKEN}`
        }
      }
    );

    // Create call record in our system
    const callId = uuidv4();
    const call = {
      id: callId,
      from: agent_number || config.SMARTFLO_AGENT_NUMBER,
      to: destination_number,
      type: 'audio',
      status: 'initiating',
      startTime: new Date(),
      direction: 'outbound',
      provider: 'smartflo',
      smartfloResponse: response.data
    };

    activeCalls.set(callId, call);
    
    // Emit call event to connected clients
    io.emit('call:initiated', call);
    
    res.json({ 
      callId, 
      status: 'initiated',
      smartflo: response.data,
      message: 'Call initiated via Smartflo API'
    });

  } catch (error) {
    console.error('Smartflo API Error:', error.response?.data || error.message);
    
    res.status(500).json({ 
      error: 'Failed to initiate call via Smartflo',
      details: error.response?.data || error.message
    });
  }
});

// Get Smartflo call status
app.get('/smartflo/call/:callId/status', async (req, res) => {
  try {
    const { callId } = req.params;
    const call = activeCalls.get(callId);
    
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }
    
    if (call.provider !== 'smartflo') {
      return res.status(400).json({ error: 'Call is not a Smartflo call' });
    }
    
    res.json({
      callId,
      status: call.status,
      smartflo: call.smartfloResponse,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting call status:', error);
    res.status(500).json({ error: 'Failed to get call status' });
  }
});

// WebSocket/Socket.IO handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Store user connection
  userConnections.set(socket.id, {
    id: socket.id,
    connectedAt: new Date(),
    userAgent: socket.handshake.headers['user-agent']
  });
  
  // Send current state
  socket.emit('connected', {
    socketId: socket.id,
    sipConfig,
    activeCalls: Array.from(activeCalls.values())
  });
  
  // Handle call initiation
  socket.on('call:initiate', (data) => {
    const { from, to, type = 'audio' } = data;
    const callId = uuidv4();
    
    const call = {
      id: callId,
      from,
      to,
      type,
      status: 'initiating',
      startTime: new Date(),
      direction: 'outbound',
      socketId: socket.id
    };
    
    activeCalls.set(callId, call);
    io.emit('call:initiated', call);
    
    // Simulate SIP call initiation
    setTimeout(() => {
      call.status = 'ringing';
      io.emit('call:ringing', call);
    }, 1000);
  });
  
  // Handle call answer
  socket.on('call:answer', (data) => {
    const { callId } = data;
    const call = activeCalls.get(callId);
    
    if (call) {
      call.status = 'answered';
      call.answerTime = new Date();
      activeCalls.set(callId, call);
      io.emit('call:answered', call);
    }
  });
  
  // Handle call hangup
  socket.on('call:hangup', (data) => {
    const { callId } = data;
    const call = activeCalls.get(callId);
    
    if (call) {
      call.status = 'ended';
      call.endTime = new Date();
      call.duration = call.endTime - call.startTime;
      activeCalls.delete(callId);
      io.emit('call:ended', call);
    }
  });
  
  // Handle WebRTC signaling
  socket.on('webrtc:offer', (data) => {
    const { callId, offer } = data;
    const call = activeCalls.get(callId);
    
    if (call) {
      // Forward offer to other party
      socket.broadcast.emit('webrtc:offer', { callId, offer });
    }
  });
  
  socket.on('webrtc:answer', (data) => {
    const { callId, answer } = data;
    const call = activeCalls.get(callId);
    
    if (call) {
      // Forward answer to other party
      socket.broadcast.emit('webrtc:answer', { callId, answer });
    }
  });
  
  socket.on('webrtc:ice-candidate', (data) => {
    const { callId, candidate } = data;
    const call = activeCalls.get(callId);
    
    if (call) {
      // Forward ICE candidate to other party
      socket.broadcast.emit('webrtc:ice-candidate', { callId, candidate });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    userConnections.delete(socket.id);
    
    // Clean up any calls associated with this socket
    for (const [callId, call] of activeCalls.entries()) {
      if (call.socketId === socket.id) {
        call.status = 'disconnected';
        call.endTime = new Date();
        activeCalls.delete(callId);
        io.emit('call:ended', call);
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = config.PORT;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Custom Dialer Backend running on port ${PORT}`);
  console.log(`SIP Configuration: ${sipConfig.host}:${sipConfig.port}`);
  console.log(`Username: ${sipConfig.username}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

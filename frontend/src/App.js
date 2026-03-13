import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import Dialer from './components/Dialer';
import CallLog from './components/CallLog';
import StatusBar from './components/StatusBar';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 2rem;
`;

const DialerSection = styled.section`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 100%;
`;

const CallLogSection = styled.section`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 800px;
  width: 100%;
`;

const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.1);
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [activeCalls, setActiveCalls] = useState([]);
  const [callHistory, setCallHistory] = useState([]);

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('Connected to backend');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from backend');
      setConnectionStatus('disconnected');
    });

    newSocket.on('call:initiated', (call) => {
      setActiveCalls(prev => [...prev, call]);
    });

    newSocket.on('call:ringing', (call) => {
      setActiveCalls(prev => 
        prev.map(c => c.id === call.id ? { ...c, status: 'ringing' } : c)
      );
    });

    newSocket.on('call:answered', (call) => {
      setActiveCalls(prev => 
        prev.map(c => c.id === call.id ? { ...c, status: 'answered' } : c)
      );
    });

    newSocket.on('call:ended', (call) => {
      setActiveCalls(prev => prev.filter(c => c.id !== call.id));
      setCallHistory(prev => [call, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCall = (from, to) => {
    if (socket && socket.connected) {
      socket.emit('call:initiate', { from, to, type: 'audio' });
    }
  };

  const handleHangup = (callId) => {
    if (socket && socket.connected) {
      socket.emit('call:hangup', { callId });
    }
  };

  const handleAnswer = (callId) => {
    if (socket && socket.connected) {
      socket.emit('call:answer', { callId });
    }
  };

  const handleSmartfloCall = async (from, to) => {
    try {
      const response = await fetch('http://localhost:3001/smartflo/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination_number: to,
          agent_number: from,
          caller_id: from,
          custom_identifier: 'web_dialer_call'
        })
      });

      const data = await response.json();
      
      if (data.success !== false) {
        console.log('Smartflo call initiated:', data);
        // The call will be added to activeCalls via WebSocket event
      } else {
        console.error('Smartflo call failed:', data);
        alert('Smartflo call failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error making Smartflo call:', error);
      alert('Error making Smartflo call: ' + error.message);
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>Custom Dialer</Title>
        <Subtitle>Free Local Test-Mode SIP & WebRTC Dialer</Subtitle>
      </Header>

      <StatusBar 
        connectionStatus={connectionStatus}
        activeCalls={activeCalls.length}
      />

      <MainContent>
        <DialerSection>
          <Dialer 
            onCall={handleCall}
            onHangup={handleHangup}
            onAnswer={handleAnswer}
            activeCalls={activeCalls}
            connectionStatus={connectionStatus}
            onSmartfloCall={handleSmartfloCall}
          />
        </DialerSection>

        <CallLogSection>
          <CallLog 
            activeCalls={activeCalls}
            callHistory={callHistory}
            onHangup={handleHangup}
            onAnswer={handleAnswer}
          />
        </CallLogSection>
      </MainContent>

      <Footer>
        <p>Built with Node.js, React, SIP, WebRTC & Asterisk • Test Mode Only</p>
      </Footer>
    </AppContainer>
  );
}

export default App;

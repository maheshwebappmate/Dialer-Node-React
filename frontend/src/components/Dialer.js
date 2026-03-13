import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPhoneOff, FiPhoneCall, FiPhoneIncoming } from 'react-icons/fi';

const DialerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Display = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
  color: #495057;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
`;

const NumberButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CallButton = styled.button`
  background: ${props => props.variant === 'call' ? '#28a745' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 15px;
  padding: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const CallControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const CallTypeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e9ecef;
`;

const ToggleLabel = styled.label`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
`;

const ToggleSwitch = styled.input`
  margin: 0;
  cursor: pointer;
`;

const CallTypeIndicator = styled.span`
  font-size: 0.8rem;
  color: ${props => props.isSmartflo ? '#28a745' : '#6c757d'};
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  background: ${props => props.isSmartflo ? '#d4edda' : '#f8f9fa'};
  border-radius: 5px;
  border: 1px solid ${props => props.isSmartflo ? '#c3e6cb' : '#e9ecef'};
`;

const ExtensionSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ExtensionLabel = styled.label`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
`;

const ExtensionSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  color: #495057;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'connected': return '#d4edda';
      case 'disconnected': return '#f8d7da';
      default: return '#fff3cd';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'connected': return '#155724';
      case 'disconnected': return '#721c24';
      default: return '#856404';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'connected': return '#c3e6cb';
      case 'disconnected': return '#f5c6cb';
      default: return '#ffeaa7';
    }
  }};
`;

const Dialer = ({ onCall, onHangup, onAnswer, activeCalls, connectionStatus, onSmartfloCall }) => {
  const [displayNumber, setDisplayNumber] = useState('');
  const [selectedExtension, setSelectedExtension] = useState('1001');
  const [isSmartflo, setIsSmartflo] = useState(false);

  const extensions = [
    { value: '1001', label: 'Extension 1001' },
    { value: '1002', label: 'Extension 1002' },
    { value: '1003', label: 'Extension 1003' },
    { value: '999', label: 'Echo Test (999)' },
    { value: '888', label: 'Music on Hold (888)' }
  ];

  const handleNumberClick = (number) => {
    setDisplayNumber(prev => prev + number);
  };

  const handleClear = () => {
    setDisplayNumber('');
  };

  const handleCall = () => {
    if (displayNumber && connectionStatus === 'connected') {
      if (isSmartflo && onSmartfloCall) {
        // Use Smartflo API for call
        onSmartfloCall(selectedExtension, displayNumber);
      } else {
        // Use regular SIP call
        onCall(selectedExtension, displayNumber);
      }
      setDisplayNumber('');
    }
  };

  const handleHangup = () => {
    if (activeCalls.length > 0) {
      activeCalls.forEach(call => {
        if (call.status === 'answered' || call.status === 'ringing') {
          onHangup(call.id);
        }
      });
    }
  };

  const handleAnswer = () => {
    const incomingCall = activeCalls.find(call => call.status === 'ringing');
    if (incomingCall) {
      onAnswer(incomingCall.id);
    }
  };

  const hasActiveCall = activeCalls.some(call => 
    call.status === 'answered' || call.status === 'ringing'
  );

  const hasIncomingCall = activeCalls.some(call => call.status === 'ringing');

  return (
    <DialerContainer>
      <Title>Phone Dialer</Title>
      
      <StatusIndicator status={connectionStatus}>
        {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
      </StatusIndicator>

      <CallTypeToggle>
        <ToggleLabel>
          <ToggleSwitch
            type="checkbox"
            checked={isSmartflo}
            onChange={(e) => setIsSmartflo(e.target.checked)}
          />
          Use Smartflo API
        </ToggleLabel>
        <CallTypeIndicator isSmartflo={isSmartflo}>
          {isSmartflo ? 'Smartflo' : 'SIP'}
        </CallTypeIndicator>
      </CallTypeToggle>

      <ExtensionSelector>
        <ExtensionLabel>Calling from:</ExtensionLabel>
        <ExtensionSelect 
          value={selectedExtension} 
          onChange={(e) => setSelectedExtension(e.target.value)}
        >
          {extensions.map(ext => (
            <option key={ext.value} value={ext.value}>
              {ext.label}
            </option>
          ))}
        </ExtensionSelect>
      </ExtensionSelector>

      <Display>
        {displayNumber || 'Enter number...'}
      </Display>

      <NumberPad>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <NumberButton 
            key={number} 
            onClick={() => handleNumberClick(number.toString())}
            disabled={connectionStatus !== 'connected'}
          >
            {number}
          </NumberButton>
        ))}
        <NumberButton onClick={handleClear} disabled={connectionStatus !== 'connected'}>
          C
        </NumberButton>
        <NumberButton 
          onClick={() => handleNumberClick('0')}
          disabled={connectionStatus !== 'connected'}
        >
          0
        </NumberButton>
        <NumberButton onClick={handleClear} disabled={connectionStatus !== 'connected'}>
          ←
        </NumberButton>
      </NumberPad>

      <CallControls>
        {!hasActiveCall ? (
          <CallButton 
            variant="call" 
            onClick={handleCall}
            disabled={!displayNumber || connectionStatus !== 'connected'}
            style={{ flex: 1 }}
          >
            <FiPhoneCall />
            {isSmartflo ? 'Smartflo Call' : 'Call'}
          </CallButton>
        ) : (
          <CallButton 
            variant="hangup" 
            onClick={handleHangup}
            style={{ flex: 1 }}
          >
            <FiPhoneOff />
            Hang Up
          </CallButton>
        )}

        {hasIncomingCall && (
          <CallButton 
            variant="answer" 
            onClick={handleAnswer}
            style={{ flex: 1 }}
          >
            <FiPhoneIncoming />
            Answer
          </CallButton>
        )}
      </CallControls>
    </DialerContainer>
  );
};

export default Dialer;

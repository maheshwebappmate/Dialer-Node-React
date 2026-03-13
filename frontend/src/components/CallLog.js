import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPhone, FiPhoneOff, FiPhoneIncoming, FiPhoneOutgoing, FiPhoneMissed } from 'react-icons/fi';

const CallLogContainer = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? '#667eea' : '#6c757d'};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #667eea;
  }
`;

const CallList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
`;

const CallItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'answered': return '#28a745';
      case 'ringing': return '#ffc107';
      case 'ended': return '#6c757d';
      case 'missed': return '#dc3545';
      default: return '#6c757d';
    }
  }};

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CallInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const CallNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #495057;
`;

const CallDirection = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #6c757d;
`;

const CallStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'answered': return '#d4edda';
      case 'ringing': return '#fff3cd';
      case 'ended': return '#e2e3e5';
      case 'missed': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'answered': return '#155724';
      case 'ringing': return '#856404';
      case 'ended': return '#495057';
      case 'missed': return '#721c24';
      default: return '#495057';
    }
  }};
`;

const CallTime = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const CallActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'answer' ? '#28a745' : '#dc3545'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
`;

const CallLog = ({ activeCalls, callHistory, onHangup, onAnswer }) => {
  const [activeTab, setActiveTab] = useState('active');

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (duration) => {
    if (!duration) return '--';
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status, direction) => {
    switch (status) {
      case 'answered':
        return direction === 'outbound' ? <FiPhoneOutgoing /> : <FiPhoneIncoming />;
      case 'ringing':
        return <FiPhoneIncoming />;
      case 'ended':
        return <FiPhone />;
      case 'missed':
        return <FiPhoneMissed />;
      default:
        return <FiPhone />;
    }
  };

  const renderCallItem = (call) => (
    <CallItem key={call.id} status={call.status}>
      <CallInfo>
        <CallNumbers>
          {getStatusIcon(call.status, call.direction)}
          {call.from} → {call.to}
        </CallNumbers>
        <CallDirection>
          {call.direction === 'outbound' ? 'Outgoing' : 'Incoming'} call
        </CallDirection>
        <CallTime>
          {formatTime(call.startTime)}
          {call.duration && ` • Duration: ${formatDuration(call.duration)}`}
        </CallTime>
      </CallInfo>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <CallStatus status={call.status}>
          {call.status}
        </CallStatus>
        
        <CallActions>
          {call.status === 'ringing' && (
            <ActionButton 
              variant="answer" 
              onClick={() => onAnswer(call.id)}
              title="Answer call"
            >
              <FiPhoneIncoming />
            </ActionButton>
          )}
          
          {(call.status === 'answered' || call.status === 'ringing') && (
            <ActionButton 
              variant="hangup" 
              onClick={() => onHangup(call.id)}
              title="Hang up"
            >
              <FiPhoneOff />
            </ActionButton>
          )}
        </CallActions>
      </div>
    </CallItem>
  );

  return (
    <CallLogContainer>
      <Title>Call Log</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'active'} 
          onClick={() => setActiveTab('active')}
        >
          Active Calls ({activeCalls.length})
        </Tab>
        <Tab 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')}
        >
          Call History ({callHistory.length})
        </Tab>
      </TabContainer>

      <CallList>
        {activeTab === 'active' ? (
          activeCalls.length > 0 ? (
            activeCalls.map(renderCallItem)
          ) : (
            <EmptyState>No active calls</EmptyState>
          )
        ) : (
          callHistory.length > 0 ? (
            callHistory.map(renderCallItem)
          ) : (
            <EmptyState>No call history</EmptyState>
          )
        )}
      </CallList>
    </CallLogContainer>
  );
};

export default CallLog;

import React from 'react';
import styled from 'styled-components';
import { FiPhone, FiPhoneOff, FiPhoneCall } from 'react-icons/fi';

const StatusBarContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'connected': return 'rgba(40, 167, 69, 0.2)';
      case 'disconnected': return 'rgba(220, 53, 69, 0.2)';
      default: return 'rgba(255, 193, 7, 0.2)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'connected': return 'rgba(40, 167, 69, 0.3)';
      case 'disconnected': return 'rgba(220, 53, 69, 0.3)';
      default: return 'rgba(255, 193, 7, 0.3)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      default: return '#ffc107';
    }
  }};
`;

const CallCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CallIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.active ? '#28a745' : 'rgba(255, 255, 255, 0.7)'};
`;

const StatusText = styled.span`
  font-weight: 600;
`;

const StatusBar = ({ connectionStatus, activeCalls }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return '🟢 Connected to Asterisk';
      case 'disconnected':
        return '🔴 Disconnected';
      default:
        return '🟡 Connecting...';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <FiPhone />;
      case 'disconnected':
        return <FiPhoneOff />;
      default:
        return <FiPhoneCall />;
    }
  };

  return (
    <StatusBarContainer>
      <StatusSection>
        <StatusIndicator status={connectionStatus}>
          {getStatusIcon(connectionStatus)}
          <StatusText>{getStatusText(connectionStatus)}</StatusText>
        </StatusIndicator>
      </StatusSection>

      <StatusSection>
        <CallCount>
          <CallIcon active={activeCalls > 0}>
            <FiPhoneCall />
            <span>{activeCalls}</span>
          </CallIcon>
          <span>Active Calls</span>
        </CallCount>
      </StatusSection>
    </StatusBarContainer>
  );
};

export default StatusBar;

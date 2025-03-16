import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const MessageContainer = styled(Box)(({ theme, isself }) => ({
  display: 'flex',
  justifyContent: isself === 'true' ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1.5),
}));

const MessageBubble = styled(Paper)(({ theme, isself }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 12,
  maxWidth: '70%',
  backgroundColor: isself === 'true' ? theme.palette.primary.dark : theme.palette.background.paper,
  boxShadow: isself === 'true' 
    ? '0 2px 8px rgba(144, 202, 249, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

const Username = styled(Typography)(({ theme, isself }) => ({
  fontWeight: 500,
  fontSize: '0.875rem',
  color: isself === 'true' ? theme.palette.primary.light : theme.palette.text.secondary,
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
}));

const MessageText = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
}));

const SystemMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontStyle: 'italic',
}));

function Message({ message, currentUsername, isSystem }) {
  if (isSystem) {
    return (
      <SystemMessage>
        {message.text} ({message.timestamp})
      </SystemMessage>
    );
  }

  const isSelf = message.username === currentUsername;

  return (
    <MessageContainer isself={isSelf.toString()}>
      <MessageBubble isself={isSelf.toString()}>
        <MessageHeader>
          <Username isself={isSelf.toString()}>
            {isSelf ? 'You' : message.username}
          </Username>
          <Timestamp>{message.timestamp}</Timestamp>
        </MessageHeader>
        <MessageText>{message.text}</MessageText>
      </MessageBubble>
    </MessageContainer>
  );
}

export default Message; 
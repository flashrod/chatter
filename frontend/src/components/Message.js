import React from 'react';
import { Box, Typography, Paper, Avatar, Tooltip, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Animation for message appearance
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled(Box)(({ theme, isself }) => ({
  display: 'flex',
  justifyContent: isself === 'true' ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(1.5),
  animation: `${slideIn} 0.3s ease-out`,
  position: 'relative',
}));

const MessageBubble = styled(Paper)(({ theme, isself }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: isself === 'true' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  maxWidth: '70%',
  backgroundColor: isself === 'true' 
    ? alpha(theme.palette.primary.main, 0.15)
    : alpha(theme.palette.background.paper, 0.8),
  boxShadow: isself === 'true' 
    ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
    : '0 4px 12px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${isself === 'true' 
    ? alpha(theme.palette.primary.main, 0.3)
    : alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.01)',
    boxShadow: isself === 'true' 
      ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`
      : '0 6px 16px rgba(0, 0, 0, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    [isself === 'true' ? 'right' : 'left']: -8,
    width: 16,
    height: 16,
    backgroundColor: isself === 'true' 
      ? alpha(theme.palette.primary.main, 0.15)
      : alpha(theme.palette.background.paper, 0.8),
    border: `1px solid ${isself === 'true' 
      ? alpha(theme.palette.primary.main, 0.3)
      : alpha(theme.palette.divider, 0.1)}`,
    borderRadius: isself === 'true' ? '0 0 0 16px' : '0 0 16px 0',
    borderTop: 'none',
    [isself === 'true' ? 'borderLeft' : 'borderRight']: 'none',
    boxShadow: isself === 'true' 
      ? `-1px 1px 0 ${alpha(theme.palette.primary.main, 0.3)}`
      : '1px 1px 0 rgba(0, 0, 0, 0.05)',
  },
  // Add a subtle gradient overlay
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    background: isself === 'true'
      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.primary.dark, 0.05)} 100%)`
      : `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.1)} 100%)`,
  },
}));

const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
}));

const Username = styled(Typography)(({ theme, isself }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: isself === 'true' ? theme.palette.primary.main : theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
}));

const Timestamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginLeft: theme.spacing(1),
}));

const MessageText = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.5,
  fontSize: '0.95rem',
  '& .emoji': {
    fontSize: '1.4rem',
    verticalAlign: 'middle',
    margin: '0 1px',
  },
}));

const SystemMessage = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontStyle: 'italic',
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    width: '15%',
    height: '1px',
    backgroundColor: alpha(theme.palette.divider, 0.5),
  },
  '&::before': {
    left: '15%',
  },
  '&::after': {
    right: '15%',
  },
}));

const MessageAvatar = styled(Avatar)(({ theme, isself }) => ({
  width: 28,
  height: 28,
  fontSize: '0.875rem',
  marginRight: theme.spacing(1),
  backgroundColor: isself === 'true' ? theme.palette.primary.main : theme.palette.grey[700],
  boxShadow: `0 0 0 2px ${alpha(
    isself === 'true' ? theme.palette.primary.main : theme.palette.background.paper, 
    0.2
  )}`,
}));

// Function to convert text emoticons to emoji
const convertTextToEmoji = (text) => {
  const emojiMap = {
    ':)': '😊',
    ':-)': '😊',
    ':D': '😃',
    ':-D': '😃',
    ':(': '😞',
    ':-(': '😞',
    ';)': '😉',
    ';-)': '😉',
    ':P': '😛',
    ':-P': '😛',
    ':p': '😛',
    ':-p': '😛',
    ':O': '😮',
    ':-O': '😮',
    ':o': '😮',
    ':-o': '😮',
    '<3': '❤️',
    ':heart:': '❤️',
    ':+1:': '👍',
    ':-1:': '👎',
    ':fire:': '🔥',
    ':star:': '⭐',
    ':check:': '✅',
    ':x:': '❌',
    ':wave:': '👋',
    ':clap:': '👏',
    ':rocket:': '🚀',
    ':eyes:': '👀',
    ':100:': '💯',
    ':ok:': '👌',
    ':thinking:': '🤔',
    ':laugh:': '😂',
    ':cry:': '😢',
    ':angry:': '😠',
    ':cool:': '😎',
    ':party:': '🎉',
  };

  // Replace emoticons with emoji spans
  let formattedText = text;
  Object.entries(emojiMap).forEach(([emoticon, emoji]) => {
    formattedText = formattedText.replace(
      new RegExp(emoticon.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g'),
      `<span class="emoji">${emoji}</span>`
    );
  });

  return formattedText;
};

function Message({ message, currentUsername, isSystem }) {
  const theme = useTheme();
  
  if (isSystem) {
    return (
      <SystemMessage>
        {message.text} ({message.timestamp})
      </SystemMessage>
    );
  }

  const isSelf = message.username === currentUsername;
  const initial = message.username.charAt(0).toUpperCase();
  const colorHash = message.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarColor = `hsl(${colorHash % 360}, 70%, 60%)`;

  // Convert text emoticons to emojis
  const formattedText = convertTextToEmoji(message.text);

  return (
    <MessageContainer isself={isSelf.toString()}>
      {!isSelf && (
        <Box mr={1} mt={0.5}>
          <Tooltip title={message.username} placement="left">
            <MessageAvatar 
              isself={isSelf.toString()}
              sx={{ bgcolor: avatarColor }}
            >
              {initial}
            </MessageAvatar>
          </Tooltip>
        </Box>
      )}
      <MessageBubble isself={isSelf.toString()}>
        <MessageHeader>
          <Username isself={isSelf.toString()}>
            {isSelf ? 'You' : message.username}
          </Username>
          <Box display="flex" alignItems="center">
            {isSelf && (
              <DoneAllIcon 
                sx={{ 
                  fontSize: 14, 
                  color: theme.palette.primary.main, 
                  mr: 0.5,
                  opacity: 0.8,
                }} 
              />
            )}
            <Timestamp>{message.timestamp}</Timestamp>
          </Box>
        </MessageHeader>
        <MessageText dangerouslySetInnerHTML={{ __html: formattedText }} />
      </MessageBubble>
    </MessageContainer>
  );
}

export default Message; 
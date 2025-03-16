import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  InputAdornment,
  Tooltip,
  Fade,
  Avatar,
  Badge,
  useTheme,
  alpha,
  Zoom,
  Popper,
  ClickAwayListener,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '../contexts/SocketContext';
import Message from './Message';
import ParticipantsList from './ParticipantsList';
import { keyframes } from '@mui/system';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ChatContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  height: 'calc(100vh - 100px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  animation: `${slideUp} 0.5s ease-out`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
}));

const TypingIndicator = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  height: '1.2rem',
  margin: theme.spacing(0.5, 2),
  animation: `${fadeIn} 0.3s ease-in-out`,
  display: 'flex',
  alignItems: 'center',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  animation: `${slideUp} 0.3s ease-out`,
}));

const TypingDots = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: theme.spacing(0.5),
  '&::after': {
    content: '""',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
    margin: '0 2px',
    animation: 'typingDot 1.4s infinite ease-in-out both',
  },
  '&::before': {
    content: '""',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
    margin: '0 2px',
    animation: 'typingDot 1.4s infinite ease-in-out both',
    animationDelay: '0.2s',
  },
  '& span': {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: theme.palette.text.secondary,
    margin: '0 2px',
    display: 'inline-block',
    animation: 'typingDot 1.4s infinite ease-in-out both',
    animationDelay: '0.4s',
  },
  '@keyframes typingDot': {
    '0%, 80%, 100%': {
      transform: 'scale(0.6)',
      opacity: 0.6,
    },
    '40%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

// New styled component for emoji picker container
const EmojiPickerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  overflow: 'hidden',
  zIndex: 1300,
  animation: `${slideUp} 0.2s ease-out`,
  '& .EmojiPickerReact': {
    '--epr-bg-color': 'transparent',
    '--epr-category-label-bg-color': alpha(theme.palette.background.paper, 0.8),
    '--epr-text-color': theme.palette.text.primary,
    '--epr-hover-bg-color': alpha(theme.palette.primary.main, 0.1),
    '--epr-search-input-bg-color': alpha(theme.palette.background.default, 0.5),
    '--epr-search-input-border-color': alpha(theme.palette.divider, 0.2),
    '--epr-search-input-border-radius': '30px',
    '--epr-search-input-padding': '8px 16px',
    '--epr-emoji-size': '24px',
    '--epr-emoji-gap': '8px',
    border: 'none',
    boxShadow: 'none',
    height: 350,
  },
}));

function ChatRoom({ userData, onLogout }) {
  const theme = useTheme();
  const { username, eventId } = userData;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const { socket, joinEvent, leaveEvent, sendMessage, setTyping } = useSocket();

  useEffect(() => {
    if (socket) {
      // Join event when component mounts
      joinEvent(username, eventId);

      // Set up event listeners
      socket.on('userJoined', handleUserJoined);
      socket.on('userLeft', handleUserLeft);
      socket.on('newMessage', handleNewMessage);
      socket.on('eventHistory', handleEventHistory);
      socket.on('userTyping', handleUserTyping);

      // Clean up on unmount
      return () => {
        socket.off('userJoined', handleUserJoined);
        socket.off('userLeft', handleUserLeft);
        socket.off('newMessage', handleNewMessage);
        socket.off('eventHistory', handleEventHistory);
        socket.off('userTyping', handleUserTyping);
        leaveEvent();
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserJoined = (data) => {
    setParticipants(data.participants);
    
    // Add system message
    const systemMessage = {
      id: `system_${Date.now()}`,
      text: `${data.user} joined the event`,
      timestamp: data.timestamp,
      isSystem: true,
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleUserLeft = (data) => {
    setParticipants(data.participants);
    
    // Remove user from typing users
    setTypingUsers((prev) => prev.filter((user) => user !== data.user));
    
    // Add system message
    const systemMessage = {
      id: `system_${Date.now()}`,
      text: `${data.user} left the event`,
      timestamp: data.timestamp,
      isSystem: true,
    };
    
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleNewMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    
    // Remove user from typing users when they send a message
    if (typingUsers.includes(message.username)) {
      setTypingUsers((prev) => prev.filter((user) => user !== message.username));
    }
  };

  const handleEventHistory = (history) => {
    setMessages(history.messages);
    setParticipants(history.participants);
  };

  const handleUserTyping = (data) => {
    if (data.isTyping) {
      // Add user to typing users if not already there
      setTypingUsers((prev) => 
        prev.includes(data.username) ? prev : [...prev, data.username]
      );
    } else {
      // Remove user from typing users
      setTypingUsers((prev) => 
        prev.filter((user) => user !== data.username)
      );
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleInputFocus = () => {
    setTyping(true);
  };

  const handleInputBlur = () => {
    setTyping(false);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleLogout = () => {
    leaveEvent();
    onLogout();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderTypingIndicator = () => {
    const typingUsersExceptSelf = typingUsers.filter((user) => user !== username);
    
    if (typingUsersExceptSelf.length === 0) {
      return null;
    }
    
    let text = '';
    if (typingUsersExceptSelf.length === 1) {
      text = `${typingUsersExceptSelf[0]} is typing`;
    } else if (typingUsersExceptSelf.length === 2) {
      text = `${typingUsersExceptSelf[0]} and ${typingUsersExceptSelf[1]} are typing`;
    } else {
      text = `${typingUsersExceptSelf.length} people are typing`;
    }
    
    return (
      <Fade in={typingUsersExceptSelf.length > 0}>
        <TypingIndicator>
          {text}
          <TypingDots><span></span></TypingDots>
        </TypingIndicator>
      </Fade>
    );
  };

  // Generate a consistent color based on username
  const getUserColor = (username) => {
    const colorHash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `hsl(${colorHash % 360}, 70%, 60%)`;
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    const cursorPosition = document.getElementById('message-input').selectionStart;
    const textBeforeCursor = message.slice(0, cursorPosition);
    const textAfterCursor = message.slice(cursorPosition);
    
    setMessage(textBeforeCursor + emoji + textAfterCursor);
    
    // Focus back on the input after selecting an emoji
    setTimeout(() => {
      const input = document.getElementById('message-input');
      input.focus();
      input.selectionStart = cursorPosition + emoji.length;
      input.selectionEnd = cursorPosition + emoji.length;
    }, 10);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setEmojiPickerOpen(false);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <StyledAppBar position="static" elevation={0} sx={{ mb: 2 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Live Event Chatroom
            </Typography>
          </Box>
          <Tooltip title="Leave Event">
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </StyledAppBar>
      
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <ChatContainer elevation={0}>
              <ChatHeader>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      mr: 1.5, 
                      bgcolor: getUserColor(eventId),
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    {eventId.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="medium">
                      {eventId}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        {participants.length} participant{participants.length !== 1 ? 's' : ''}
                      </Typography>
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          backgroundColor: 'text.secondary',
                          mx: 1,
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        Joined as <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 'medium' }}>{username}</Box>
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: getUserColor(username),
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </StyledBadge>
              </ChatHeader>
              
              <MessagesContainer>
                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    message={msg}
                    currentUsername={username}
                    isSystem={msg.isSystem}
                  />
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>
              
              {renderTypingIndicator()}
              
              <ChatInputContainer>
                <form onSubmit={handleSendMessage}>
                  <TextField
                    id="message-input"
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Add emoji">
                            <IconButton 
                              ref={emojiButtonRef}
                              size="small" 
                              color={emojiPickerOpen ? "primary" : "inherit"}
                              onClick={toggleEmojiPicker}
                              sx={{ 
                                mr: 0.5,
                                backgroundColor: emojiPickerOpen ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                transition: 'all 0.2s ease',
                                transform: emojiPickerOpen ? 'scale(1.1)' : 'scale(1)',
                              }}
                            >
                              <EmojiEmotionsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Attach file">
                            <IconButton size="small" color="primary" sx={{ mr: 0.5 }}>
                              <AttachFileIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Zoom in={message.trim().length > 0}>
                            <IconButton
                              type="submit"
                              color="primary"
                              disabled={!message.trim()}
                              sx={{
                                backgroundColor: message.trim() ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                                transition: 'all 0.2s ease-in-out',
                              }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Zoom>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 30,
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.background.default, 0.7),
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                        },
                      },
                    }}
                  />
                </form>
                
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Popper
                    open={emojiPickerOpen}
                    anchorEl={emojiButtonRef.current}
                    placement="top-start"
                    transition
                    disablePortal
                    modifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ]}
                  >
                    {({ TransitionProps }) => (
                      <Fade {...TransitionProps} timeout={200}>
                        <EmojiPickerContainer>
                          <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            searchPlaceHolder="Search emoji..."
                            width="100%"
                            height="350px"
                            previewConfig={{ showPreview: false }}
                            skinTonesDisabled
                            theme={theme.palette.mode}
                          />
                        </EmojiPickerContainer>
                      </Fade>
                    )}
                  </Popper>
                </ClickAwayListener>
              </ChatInputContainer>
            </ChatContainer>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <ParticipantsList
              participants={participants}
              currentUsername={username}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ChatRoom; 
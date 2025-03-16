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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import { useSocket } from '../contexts/SocketContext';
import Message from './Message';
import ParticipantsList from './ParticipantsList';

const ChatContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  height: 'calc(100vh - 100px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const TypingIndicator = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  height: '1rem',
  margin: theme.spacing(0.5, 0),
}));

function ChatRoom({ userData, onLogout }) {
  const { username, eventId } = userData;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
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
    
    if (typingUsersExceptSelf.length === 1) {
      return `${typingUsersExceptSelf[0]} is typing...`;
    }
    
    if (typingUsersExceptSelf.length === 2) {
      return `${typingUsersExceptSelf[0]} and ${typingUsersExceptSelf[1]} are typing...`;
    }
    
    return `${typingUsersExceptSelf.length} people are typing...`;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Live Event Chatroom
            </Typography>
          </Box>
          <Tooltip title="Leave Event">
            <IconButton edge="end" color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <ChatContainer elevation={0}>
              <ChatHeader>
                <Box>
                  <Typography variant="h6" fontWeight="medium">
                    Event: {eventId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Joined as {username}
                  </Typography>
                </Box>
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
              
              <TypingIndicator>
                {renderTypingIndicator()}
              </TypingIndicator>
              
              <ChatInputContainer>
                <form onSubmit={handleSendMessage}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            color="primary"
                            disabled={!message.trim()}
                          >
                            <SendIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
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
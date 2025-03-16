import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Fade,
  Avatar,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import MessageIcon from '@mui/icons-material/Message';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSocket } from '../contexts/SocketContext';
import { keyframes } from '@mui/system';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  animation: `${fadeIn} 0.5s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  position: 'relative',
  overflow: 'hidden',
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

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const Logo = styled(ChatIcon)(({ theme }) => ({
  fontSize: 48,
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
  animation: `${pulse} 2s infinite ease-in-out`,
}));

const EventItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'translateX(5px)',
  },
  cursor: 'pointer',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const GlowingButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

function LoginScreen({ onLogin }) {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [eventId, setEventId] = useState('');
  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isConnected, getActiveEvents } = useSocket();

  useEffect(() => {
    if (isConnected) {
      fetchActiveEvents();
    }
  }, [isConnected]);

  const fetchActiveEvents = () => {
    setLoading(true);
    getActiveEvents((events) => {
      setActiveEvents(events);
      setLoading(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && eventId.trim()) {
      onLogin(username.trim(), eventId.trim());
    }
  };

  const handleEventSelect = (event) => {
    setEventId(event.id);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.dark, 0.15)} 0%, transparent 70%)`,
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
              <LogoContainer>
                <Logo />
                <Box>
                  <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
                    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Live Event Chatroom
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with others in real-time
                  </Typography>
                </Box>
              </LogoContainer>
              <Typography variant="body1" color="text.secondary" align="center" mb={4}>
                Join a live event and chat with other participants in real-time.
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <Box component="span" mr={1} display="flex" alignItems="center">
                        <StyledAvatar sx={{ width: 24, height: 24 }}>
                          {username.charAt(0).toUpperCase() || 'U'}
                        </StyledAvatar>
                      </Box>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Event ID"
                  variant="outlined"
                  margin="normal"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  required
                  helperText="Enter an existing event ID or create a new one"
                />
                <GlowingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    height: 48,
                    background: 'linear-gradient(45deg, #4f46e5 30%, #6366f1 90%)',
                  }}
                  disabled={!username.trim() || !eventId.trim()}
                >
                  Join Event
                </GlowingButton>
              </form>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Active Events
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchActiveEvents}
                  startIcon={<RefreshIcon />}
                  sx={{ borderRadius: 20 }}
                >
                  Refresh
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                  <CircularProgress size={40} thickness={4} />
                </Box>
              ) : (
                <Fade in={!loading}>
                  <List sx={{ maxHeight: 300, overflow: 'auto', pr: 1 }}>
                    {activeEvents.length > 0 ? (
                      activeEvents.map((event, index) => (
                        <EventItem
                          key={event.id}
                          onClick={() => handleEventSelect(event)}
                          selected={eventId === event.id}
                          sx={{
                            animation: `${fadeIn} ${0.3 + index * 0.1}s ease-out`,
                          }}
                        >
                          <Box mr={2}>
                            <Avatar
                              sx={{
                                bgcolor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              {event.id.charAt(0).toUpperCase()}
                            </Avatar>
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight={eventId === event.id ? 'bold' : 'normal'}>
                                {event.id}
                              </Typography>
                            }
                            secondary={
                              <Box display="flex" alignItems="center" mt={0.5}>
                                <Chip
                                  size="small"
                                  icon={<GroupIcon sx={{ fontSize: 14 }} />}
                                  label={`${event.participantCount} ${event.participantCount === 1 ? 'user' : 'users'}`}
                                  sx={{ mr: 1, height: 24 }}
                                />
                                <Chip
                                  size="small"
                                  icon={<MessageIcon sx={{ fontSize: 14 }} />}
                                  label={`${event.messageCount} ${event.messageCount === 1 ? 'message' : 'messages'}`}
                                  sx={{ height: 24 }}
                                />
                              </Box>
                            }
                          />
                        </EventItem>
                      ))
                    ) : (
                      <Box textAlign="center" py={4}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          No active events found.
                        </Typography>
                        <Typography variant="body2" color="primary">
                          Create a new one by entering an Event ID!
                        </Typography>
                      </Box>
                    )}
                  </List>
                </Fade>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LoginScreen; 
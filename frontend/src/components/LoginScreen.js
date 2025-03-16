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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import { useSocket } from '../contexts/SocketContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
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
}));

const EventItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: 'rgba(144, 202, 249, 0.08)',
  },
  cursor: 'pointer',
}));

function LoginScreen({ onLogin }) {
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
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
              <LogoContainer>
                <Logo />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Live Event Chatroom
                </Typography>
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!username.trim() || !eventId.trim()}
                >
                  Join Event
                </Button>
              </form>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={6}>
              <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                Active Events
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={fetchActiveEvents}
                sx={{ mb: 2 }}
              >
                Refresh
              </Button>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <Fade in={!loading}>
                  <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {activeEvents.length > 0 ? (
                      activeEvents.map((event) => (
                        <EventItem
                          key={event.id}
                          onClick={() => handleEventSelect(event)}
                          selected={eventId === event.id}
                        >
                          <ListItemText
                            primary={event.id}
                            secondary={`${event.participantCount} participants • ${event.messageCount} messages`}
                          />
                        </EventItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No active events found. Create a new one!
                      </Typography>
                    )}
                  </List>
                </Fade>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default LoginScreen; 
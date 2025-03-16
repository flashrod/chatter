import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  Badge,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { keyframes } from '@mui/system';

// Animation for participant appearance
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ParticipantsContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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

const ParticipantsHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ParticipantsListContainer = styled(List)(({ theme }) => ({
  overflow: 'auto',
  padding: theme.spacing(1),
  flex: 1,
}));

const ParticipantItem = styled(ListItem)(({ theme, iscurrentuser }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(0.5),
  backgroundColor: iscurrentuser === 'true' 
    ? alpha(theme.palette.primary.main, 0.08) 
    : 'transparent',
  transition: 'all 0.2s ease-in-out',
  animation: `${fadeIn} 0.3s ease-out`,
  '&:hover': {
    backgroundColor: iscurrentuser === 'true'
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.background.default, 0.5),
    transform: 'translateX(5px)',
  },
}));

const ParticipantAvatar = styled(Avatar)(({ theme, iscurrentuser }) => ({
  backgroundColor: iscurrentuser === 'true' 
    ? theme.palette.primary.main 
    : theme.palette.grey[700],
  boxShadow: `0 0 0 2px ${alpha(
    iscurrentuser === 'true' ? theme.palette.primary.main : theme.palette.background.paper, 
    0.2
  )}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
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

function ParticipantsList({ participants, currentUsername }) {
  const theme = useTheme();
  
  // Generate a consistent color based on username
  const getUserColor = (username) => {
    const colorHash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `hsl(${colorHash % 360}, 70%, 60%)`;
  };

  return (
    <ParticipantsContainer elevation={0}>
      <ParticipantsHeader>
        <Box display="flex" alignItems="center">
          <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight="medium">
            Participants
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: '0.875rem',
          }}
        >
          {participants.length}
        </Box>
      </ParticipantsHeader>
      <Divider />
      <ParticipantsListContainer>
        {participants.map((participant, index) => {
          const isCurrentUser = participant === currentUsername;
          const initial = participant.charAt(0).toUpperCase();
          const avatarColor = getUserColor(participant);
          
          return (
            <Tooltip
              key={index}
              title={isCurrentUser ? "You" : participant}
              placement="left"
            >
              <ParticipantItem
                iscurrentuser={isCurrentUser.toString()}
                disablePadding
                sx={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <ListItemAvatar>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                  >
                    <ParticipantAvatar 
                      iscurrentuser={isCurrentUser.toString()}
                      sx={{ bgcolor: avatarColor }}
                    >
                      {initial}
                    </ParticipantAvatar>
                  </StyledBadge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="body1"
                        fontWeight={isCurrentUser ? 'bold' : 'medium'}
                        sx={{
                          color: isCurrentUser ? theme.palette.primary.main : theme.palette.text.primary,
                        }}
                      >
                        {isCurrentUser ? `${participant} (You)` : participant}
                      </Typography>
                      {isCurrentUser && (
                        <Box
                          component="span"
                          sx={{
                            ml: 1,
                            fontSize: '0.75rem',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            borderRadius: 4,
                            px: 1,
                            py: 0.25,
                          }}
                        >
                          You
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ParticipantItem>
            </Tooltip>
          );
        })}
      </ParticipantsListContainer>
    </ParticipantsContainer>
  );
}

export default ParticipantsList; 
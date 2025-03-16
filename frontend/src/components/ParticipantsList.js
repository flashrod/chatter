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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';

const ParticipantsContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const ParticipantsHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ParticipantsListContainer = styled(List)(({ theme }) => ({
  overflow: 'auto',
  padding: theme.spacing(1),
  flex: 1,
}));

const ParticipantItem = styled(ListItem)(({ theme, iscurrentuser }) => ({
  borderRadius: 8,
  marginBottom: theme.spacing(0.5),
  backgroundColor: iscurrentuser === 'true' ? 'rgba(144, 202, 249, 0.08)' : 'transparent',
}));

const ParticipantAvatar = styled(Avatar)(({ theme, iscurrentuser }) => ({
  backgroundColor: iscurrentuser === 'true' ? theme.palette.primary.main : theme.palette.grey[700],
}));

function ParticipantsList({ participants, currentUsername }) {
  return (
    <ParticipantsContainer elevation={0}>
      <ParticipantsHeader>
        <Typography variant="h6" fontWeight="medium">
          Participants ({participants.length})
        </Typography>
      </ParticipantsHeader>
      <Divider />
      <ParticipantsListContainer>
        {participants.map((participant, index) => {
          const isCurrentUser = participant === currentUsername;
          return (
            <ParticipantItem
              key={index}
              iscurrentuser={isCurrentUser.toString()}
              disablePadding
            >
              <ListItemAvatar>
                <ParticipantAvatar iscurrentuser={isCurrentUser.toString()}>
                  <PersonIcon />
                </ParticipantAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    fontWeight={isCurrentUser ? 'medium' : 'normal'}
                  >
                    {isCurrentUser ? `${participant} (You)` : participant}
                  </Typography>
                }
              />
            </ParticipantItem>
          );
        })}
      </ParticipantsListContainer>
    </ParticipantsContainer>
  );
}

export default ParticipantsList; 
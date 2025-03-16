# Live Event Chatroom Frontend

A modern, dark-themed React frontend for the Live Event Chatroom Platform.

## Features

- Clean, minimalist dark mode UI using Material-UI
- Real-time communication with Socket.IO
- Responsive design for all device sizes
- User-friendly interface with intuitive controls
- Typing indicators
- Participant list with avatars
- System messages for user join/leave events

## Project Structure

```
frontend/
├── public/                # Static files
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── ChatRoom.js    # Main chat interface
│   │   ├── LoginScreen.js # Login screen
│   │   ├── Message.js     # Message component
│   │   └── ParticipantsList.js # Participants list
│   ├── contexts/          # React contexts
│   │   └── SocketContext.js # Socket.IO context
│   ├── App.js             # Main App component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md              # Documentation
```

## Installation

1. Navigate to the frontend directory
2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Make sure the backend server is running
2. Start the frontend development server:

```bash
npm start
```

3. Open your browser to http://localhost:3000

## Building for Production

To create a production build:

```bash
npm run build
```

This will create a `build` directory with optimized production files.

## Technologies Used

- React 18
- Material-UI (MUI)
- Socket.IO Client
- Styled Components

## Socket.IO Integration

The frontend uses a custom SocketContext to manage the Socket.IO connection:

```jsx
import { useSocket } from "../contexts/SocketContext";

function MyComponent() {
  const {
    socket,
    isConnected,
    joinEvent,
    leaveEvent,
    sendMessage,
    setTyping,
    getActiveEvents,
  } = useSocket();

  // Use these functions to interact with the Socket.IO connection
}
```

## UI Components

### LoginScreen

The login screen allows users to:

- Enter a username
- Enter or select an event ID
- View active events
- Join an event

### ChatRoom

The main chat interface includes:

- Real-time message display
- Message input with send button
- Typing indicators
- Participant list
- Event information
- Logout button

### Message

Displays individual messages with:

- Username
- Timestamp
- Message content
- Different styling for own messages vs. others
- Special styling for system messages

### ParticipantsList

Displays the list of participants with:

- Username
- Avatar
- Special styling for the current user

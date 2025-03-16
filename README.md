# CHATTER

A real-time communication platform for live events, allowing users to join event sessions, send messages, and interact with other participants in real time.

## Features

- Real-time communication using Socket.IO
- Event management (join/leave events)
- Message broadcasting to event participants
- Participant status updates
- Typing indicators
- REST API for event data
- Modern React frontend with dark mode UI

## Project Structure

```
.
├── backend/                # Backend server code
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   ├── socket/             # Socket.IO handlers
│   ├── utils/              # Utility functions and classes
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   ├── README.md           # Backend documentation
│   └── server.js           # Main server file
│
└── frontend/               # React frontend
    ├── public/             # Static files
    ├── src/                # Source code
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── App.js          # Main App component
    │   ├── index.js        # Entry point
    │   └── index.css       # Global styles
    ├── package.json        # Frontend dependencies
    └── README.md           # Frontend documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

3. Open your browser to http://localhost:3000

## Usage

1. Enter a username and event ID on the login screen
2. Start chatting with other participants in the same event
3. View the list of participants in the sidebar
4. See typing indicators when others are typing
5. Leave the event using the logout button

## API Documentation

### REST API

- `GET /api/events` - Get all active events
- `GET /api/events/:id` - Get event details by ID
- `POST /api/events` - Create a new event (placeholder)

### Socket.IO Events

#### Client to Server

- `joinEvent` - Join an event with username and eventId
- `sendMessage` - Send a message to an event
- `leaveEvent` - Leave the current event
- `typing` - Indicate that the user is typing
- `getActiveEvents` - Request a list of active events

#### Server to Client

- `userJoined` - A new user joined the event
- `newMessage` - A new message was sent to the event
- `userLeft` - A user left the event
- `userTyping` - A user is typing
- `eventHistory` - Event history (messages and participants)

## Screenshots

![Login Screen](https://example.com/login-screen.png)
![Chat Room](https://example.com/chat-room.png)

## Technologies Used

### Backend

- Node.js
- Express
- Socket.IO
- Moment.js

### Frontend

- React
- Material-UI
- Socket.IO Client
- Styled Components

## Scalability Considerations

The backend is designed with scalability in mind:

- Modular architecture for easy maintenance and extension
- Efficient event and user management
- Socket.IO rooms for optimized message broadcasting
- In-memory data storage (can be replaced with a database for persistence)

For production deployment, consider:

- Using a process manager like PM2
- Implementing a Redis adapter for Socket.IO to support horizontal scaling
- Adding a database for persistent storage
- Setting up load balancing for high availability



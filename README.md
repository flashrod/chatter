# Live Event Chatroom Platform

A real-time communication platform for live events, allowing users to join event sessions, send messages, and interact with other participants in real time.

## Features

- Real-time communication using Socket.IO
- Event management (join/leave events)
- Message broadcasting to event participants
- Participant status updates
- Typing indicators
- REST API for event data
- Simple HTML/JavaScript frontend example

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
└── frontend/               # Frontend example
    ├── index.html          # Simple HTML/JS example
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

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Open the frontend example:

```bash
# Simply open frontend/index.html in your browser
```

## Usage

1. Open the frontend example in your browser
2. Enter a username and event ID
3. Start chatting with other participants in the same event

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

## License

This project is licensed under the MIT License.

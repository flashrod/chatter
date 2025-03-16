# Live Event Chatroom Backend

A real-time backend for a Live Event Chatroom Platform using Socket.IO and Express.

## Features

- Real-time communication using Socket.IO
- Event management (join/leave events)
- Message broadcasting to event participants
- Participant status updates
- Typing indicators
- REST API for event data

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Events

- `GET /api/events` - Get all active events
- `GET /api/events/:id` - Get event details by ID
- `POST /api/events` - Create a new event (placeholder)

## Socket.IO Events

### Client to Server

- `joinEvent` - Join an event with username and eventId
- `sendMessage` - Send a message to an event
- `leaveEvent` - Leave the current event
- `typing` - Indicate that the user is typing
- `getActiveEvents` - Request a list of active events

### Server to Client

- `userJoined` - A new user joined the event
- `newMessage` - A new message was sent to the event
- `userLeft` - A user left the event
- `userTyping` - A user is typing
- `eventHistory` - Event history (messages and participants)

## Project Structure

```
backend/
├── middleware/       # Express middleware
├── routes/           # API routes
├── socket/           # Socket.IO handlers
├── utils/            # Utility functions and classes
├── .env              # Environment variables
├── package.json      # Project dependencies
├── README.md         # Project documentation
└── server.js         # Main server file
```

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

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import socket handler
const { initializeSocketHandlers } = require('./socket/socketHandler');

// Import routes
const eventRoutes = require('./routes/eventRoutes');

// Import middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/events', eventRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Live Event Chatroom Backend is running');
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 
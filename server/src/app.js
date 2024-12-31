const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import socket.io

// Load environment variables from .env file
dotenv.config();

const connectDB = require('../config/db'); // MongoDB connection
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const userRoutes = require('./routes/userRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const monitorAuctions = require('./utils/auctionMonitor');




// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Restrict CORS in production
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Logger

// Connect to MongoDB
connectDB();

// Default route
app.get('/', (req, res) => {
    res.send('Online Auction System API is running.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
    },
});

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected');

    // Event: Join an auction room
    socket.on('joinAuction', (auctionId) => {
        socket.join(auctionId);
        console.log(`User joined auction room: ${auctionId}`);
    });

    // Event: Leave an auction room
    socket.on('leaveAuction', (auctionId) => {
        socket.leave(auctionId);
        console.log(`User left auction room: ${auctionId}`);
    });

    // Event: Bid placed in auction
    socket.on('placeBid', ({ auctionId, bid }) => {
        io.to(auctionId).emit('bidUpdate', { auctionId, bid });
        console.log(`Bid update for auction ${auctionId}: ${bid}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Error handling for Socket.IO
io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
});

// Make `io` accessible globally
app.set('io', io);


monitorAuctions(io);
// Server configuration
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, server };

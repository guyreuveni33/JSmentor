require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectToDatabase } = require('./db/db');
const setupSocketHandlers = require('./socket/socketHandlers');
const setupRoutes = require('./routes/routes');

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'https://mentor-code-space.vercel.app'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

connectToDatabase();

const io = socketIo(server, {
    cors: corsOptions
});

setupRoutes(app);
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const CodeBlock = require('./models/codeBlock');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

const io = socketIo(server, {
    cors: corsOptions
});
// Endpoint to get code blocks
app.get('/codeblocks', async (req, res) => {
    console.log('Fetching code blocks from the database...');
    try {
        const codeBlocks = await CodeBlock.find();
        console.log(`Found ${codeBlocks.length} code blocks`);
        res.json(codeBlocks);
    } catch (error) {
        console.error('Error fetching code blocks:', error.message);
        res.status(500).send('Server error');
    }
});

// Manage socket connections and rooms
let rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', async ({ codeBlockId }) => {
        console.log(`Client ${socket.id} is trying to join room: ${codeBlockId}`);

        if (!rooms[codeBlockId]) {
            rooms[codeBlockId] = { mentor: socket.id, students: [] };
            console.log(`Room ${codeBlockId} created. Client ${socket.id} is the mentor.`);

            const codeBlock = await CodeBlock.findById(codeBlockId);
            socket.emit('codeBlockData', { code: codeBlock.code, role: 'mentor' });
        } else {
            rooms[codeBlockId].students.push(socket.id);
            console.log(`Client ${socket.id} joined as a student in room ${codeBlockId}. Total students: ${rooms[codeBlockId].students.length}`);

            const codeBlock = await CodeBlock.findById(codeBlockId);
            socket.emit('codeBlockData', { code: codeBlock.code, role: 'student' });
        }

        socket.join(codeBlockId);
        io.to(codeBlockId).emit('studentsCount', rooms[codeBlockId].students.length);
    });

    socket.on('codeChange', (newCode) => {
        console.log(`Code change event received from client ${socket.id}: ${newCode}`);

        const room = Object.keys(rooms).find(room =>
            rooms[room].mentor === socket.id || rooms[room].students.includes(socket.id)
        );

        if (room) {
            console.log(`Processing code change for room ${room}`);
            CodeBlock.findById(room).then(codeBlock => {
                if (newCode.trim() === codeBlock.solution.trim()) {
                    console.log('Code matches the solution, sending success message...');
                    io.to(room).emit('solutionMatched', true);
                } else {
                    console.log('Code does not match the solution, broadcasting update...');
                    socket.to(room).emit('updateCode', newCode);
                }
            }).catch((err) => {
                console.error('Error fetching code block for room:', err.message);
            });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);

        Object.keys(rooms).forEach(codeBlockId => {
            if (rooms[codeBlockId].mentor === socket.id) {
                console.log(`Mentor ${socket.id} left room ${codeBlockId}. Resetting room.`);
                io.to(codeBlockId).emit('mentorLeft');
                delete rooms[codeBlockId];
            } else if (rooms[codeBlockId].students.includes(socket.id)) {
                rooms[codeBlockId].students = rooms[codeBlockId].students.filter(id => id !== socket.id);
                console.log(`Student ${socket.id} left room ${codeBlockId}. Remaining students: ${rooms[codeBlockId].students.length}`);
                io.to(codeBlockId).emit('studentsCount', rooms[codeBlockId].students.length);
            }
        });
    });
});

// Start server on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

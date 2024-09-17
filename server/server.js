const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const CodeBlock = require('./models/codeBlock');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

mongoose.connect('mongodb://localhost:27017/codeblocksdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.get('/codeblocks', async (req, res) => {
    try {
        const codeBlocks = await CodeBlock.find();
        res.json(codeBlocks);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

let rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', async ({ codeBlockId }) => {
        if (!rooms[codeBlockId]) {
            rooms[codeBlockId] = { mentor: socket.id, students: [] };
            const codeBlock = await CodeBlock.findById(codeBlockId);
            socket.emit('codeBlockData', { code: codeBlock.code, role: 'mentor' });
        } else {
            rooms[codeBlockId].students.push(socket.id);
            const codeBlock = await CodeBlock.findById(codeBlockId);
            socket.emit('codeBlockData', { code: codeBlock.code, role: 'student' });
        }
        socket.join(codeBlockId);

        // Broadcast the updated student count to all clients in the room
        io.to(codeBlockId).emit('studentsCount', rooms[codeBlockId].students.length);
    });

    socket.on('codeChange', (newCode) => {
        const room = Object.keys(rooms).find(room =>
            rooms[room].mentor === socket.id || rooms[room].students.includes(socket.id)
        );
        if (room) {
            CodeBlock.findById(room).then(codeBlock => {
                if (newCode.trim() === codeBlock.solution.trim()) {
                    io.to(room).emit('solutionMatched', true);
                } else {
                    socket.to(room).emit('updateCode', newCode);
                }
            });
        }
    });

    socket.on('disconnect', () => {
        Object.keys(rooms).forEach(codeBlockId => {
            if (rooms[codeBlockId].mentor === socket.id) {
                io.to(codeBlockId).emit('mentorLeft');
                delete rooms[codeBlockId];
            } else if (rooms[codeBlockId].students.includes(socket.id)) {
                rooms[codeBlockId].students = rooms[codeBlockId].students.filter(id => id !== socket.id);
                // Broadcast the updated student count after a student disconnects
                io.to(codeBlockId).emit('studentsCount', rooms[codeBlockId].students.length);
            }
        });
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
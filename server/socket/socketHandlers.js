const CodeBlock = require('../models/codeBlock');

let rooms = {};

const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('joinRoom', async ({ codeBlockId }) => {
            console.log(`Client ${socket.id} is trying to join room: ${codeBlockId}`);

            if (!rooms[codeBlockId]) {
                rooms[codeBlockId] = { mentor: socket.id, students: [], currentCode: '' };
                console.log(`Room ${codeBlockId} created. Client ${socket.id} is the mentor.`);

                const codeBlock = await CodeBlock.findById(codeBlockId);
                rooms[codeBlockId].currentCode = codeBlock.code;
                socket.emit('codeBlockData', { code: codeBlock.code, role: 'mentor' });
            } else {
                rooms[codeBlockId].students.push(socket.id);
                console.log(`Client ${socket.id} joined as a student in room ${codeBlockId}. Total students: ${rooms[codeBlockId].students.length}`);

                socket.emit('codeBlockData', { code: rooms[codeBlockId].currentCode, role: 'student' });
            }

            socket.join(codeBlockId);
            io.to(codeBlockId).emit('studentsCount', rooms[codeBlockId].students.length);
        });

        socket.on('codeChange', (newCode) => {
            console.log(`Code change event received from client ${socket.id}`);

            const room = Object.keys(rooms).find(room =>
                rooms[room].mentor === socket.id || rooms[room].students.includes(socket.id)
            );

            if (room) {
                console.log(`Processing code change for room ${room}`);

                rooms[room].currentCode = newCode;
                io.to(room).emit('updateCode', newCode);

                CodeBlock.findById(room).then(codeBlock => {
                    if (!codeBlock || typeof codeBlock.solution !== 'string') {
                        console.error('CodeBlock not found or solution is not a string');
                        return;
                    }

                    function normalizeCode(code) {
                        return code.replace(/\s+/g, '').toLowerCase();
                    }

                    const normalizedNewCode = normalizeCode(newCode);
                    const normalizedSolution = normalizeCode(codeBlock.solution);

                    if (normalizedNewCode === normalizedSolution) {
                        console.log('Code matches the solution, sending success message...');
                        io.to(room).emit('solutionMatched', true);
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
};

module.exports = setupSocketHandlers;
import { io } from 'socket.io-client';

// Create a singleton instance of the socket
const socket = io('http://localhost:5000', {
    autoConnect: false // Prevents automatic connection
});

export default socket;

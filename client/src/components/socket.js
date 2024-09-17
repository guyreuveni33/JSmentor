// socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Initialize socket connection

export default socket; // Export the socket instance

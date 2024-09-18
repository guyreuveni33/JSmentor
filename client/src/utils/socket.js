import io from 'socket.io-client';

export const initializeSocket = (codeBlockId, setCode, setRole, setStudentsCount, setSolutionMatched, setShowMentorLeaveModal, navigate, setCodeState) => {
    const socket = io('https://mentorcodespace-production.up.railway.app/');

    socket.on('connect', () => {
        socket.emit('joinRoom', { codeBlockId });
    });

    socket.on('connect_error', () => {
        setCodeState('Failed to connect to the server');
    });
    //this is the event that is emitted when a new client connects to the server
    socket.on('codeBlockData', (data) => {
        setCode(data.code);
        setRole(data.role);
    });
    //this event is emitted when the code is updated by students
    socket.on('updateCode', (newCode) => {
        setCode(newCode);
    });
    //this event is emitted when the number of students in the room changes by leaving or joining
    socket.on('studentsCount', (count) => {
        setStudentsCount(count);
    });

    socket.on('solutionMatched', () => {
        setSolutionMatched(true);
    });

    socket.on('mentorLeft', () => {
        setShowMentorLeaveModal(true);
        setCode('');
        setTimeout(() => {
            setShowMentorLeaveModal(false);
            navigate('/');
        }, 5000);
    });

    return socket;
};

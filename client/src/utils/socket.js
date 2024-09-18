import io from 'socket.io-client';

export const initializeSocket = (codeBlockId, setCode, setRole, setStudentsCount, setSolutionMatched, setShowMentorLeaveModal, navigate, setCodeState) => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
        socket.emit('joinRoom', { codeBlockId });
    });

    socket.on('connect_error', () => {
        setCodeState('Failed to connect to the server');
    });

    socket.on('codeBlockData', (data) => {
        setCode(data.code);
        setRole(data.role);
    });

    socket.on('updateCode', (newCode) => {
        setCode(newCode);
    });

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

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import EditorWrapper from './components/EditorWrapper';
import MentorLeaveModal from './components/MentorLeaveModal';
import { initializeSocket } from './utils/socket';
import './styles/CodeBlock.css'; // Import styles for CodeBlock component

const CodeBlock = () => {
    const { codeBlockId } = useParams();
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [solutionMatched, setSolutionMatched] = useState(false);
    const [error, setError] = useState(null);
    const [showBubble, setShowBubble] = useState(false);
    const [studentsCount, setStudentsCount] = useState(0);
    const [showMentorLeaveModal, setShowMentorLeaveModal] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const timeoutRef = useRef(null);
    // Initialize the socket connection
    useEffect(() => {
        const socket = initializeSocket(
            codeBlockId,
            setCode,
            setRole,
            setStudentsCount,
            setSolutionMatched,
            setShowMentorLeaveModal,
            navigate,
            setError
        );
        socketRef.current = socket;

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            socket.disconnect();
        };
    }, [codeBlockId, navigate]);

    const emitCodeChange = (newCode) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (socketRef.current) {
                socketRef.current.emit('codeChange', newCode);
            }
        }, 300);
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (role === 'student') {
            emitCodeChange(newCode);
        }
    };
    //this prevents the mentor from clicking on the editor text and showing the tooltip
    const handleMentorClick = (e) => {
        if (role === 'mentor') {
            e.preventDefault();
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 2000);
        }
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    const getWelcomeMessage = (role) => {
        return role === 'mentor'
            ? "Welcome to the Mentor Dashboard. Your guidance shapes the learning journey."
            : "Welcome to the Student Workspace. Dive in, experiment, and enhance your coding skills!";
    };

    return (
        <div className="codeblock-wrapper">
            <div className="codeblock-container">
                <Header role={role} studentsCount={studentsCount} />
                <div className="welcome-message">{getWelcomeMessage(role)}</div>
                {solutionMatched && <div className="smiley">🎉 Solution Verified! 😃</div>}
                <EditorWrapper
                    codeBlockId={codeBlockId}
                    code={code}
                    handleCodeChange={handleCodeChange}
                    role={role}
                    showBubble={showBubble}
                    handleMentorClick={handleMentorClick}
                />
                <button onClick={() => navigate('/')} className="return-button">
                    Return to Challenge Selection
                </button>
            </div>
            <MentorLeaveModal show={showMentorLeaveModal} />
        </div>
    );
};

export default CodeBlock;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './CodeBlock.css';

const CodeBlock = () => {
    const { codeBlockId } = useParams();
    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [solutionMatched, setSolutionMatched] = useState(false);
    const [socket, setSocket] = useState(null);
    const [error, setError] = useState(null);
    const [showBubble, setShowBubble] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [studentsCount, setStudentsCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            newSocket.emit('joinRoom', { codeBlockId });
        });

        newSocket.on('connect_error', (err) => {
            setError('Failed to connect to the server');
        });

        newSocket.on('codeBlockData', (data) => {
            setCode(data.code);
            setRole(data.role);
            if (data.role === 'mentor') {
                setWelcomeMessage('Welcome Mentor! Your expertise will guide the students. Enjoy observing their progress.');
            } else {
                setWelcomeMessage('Welcome Student! Feel free to experiment and learn. We believe in your potential!');
            }
        });

        newSocket.on('updateCode', (newCode) => {
            setCode(newCode);
        });

        newSocket.on('studentsCount', (count) => {
            setStudentsCount(count);
        });

        newSocket.on('solutionMatched', () => {
            setSolutionMatched(true);
        });

        newSocket.on('mentorLeft', () => {
            alert('The mentor has left the room.');
            setRole('student');
            navigate('/');
        });

        return () => {
            newSocket.disconnect();
        };
    }, [codeBlockId, navigate]);

    const handleMentorClick = (e) => {
        if (role === 'mentor') {
            e.preventDefault();
            setShowBubble(true);
            setTimeout(() => setShowBubble(false), 2000);
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeChange', newCode);
    };

    const handleReturnToList = () => {
        navigate('/'); // Navigate back to the lobby (root path or change accordingly)
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="codeblock-wrapper">
            <h1 className="title">{role === 'mentor' ? 'Mentor View' : 'Student View'}</h1>
            <p className="codeblock-id">Code Block ID: {codeBlockId}</p>
            <div className="codeblock-container">
                <p className="welcome-message">{welcomeMessage}</p>
                <p className="role">Role: {role || 'Connecting...'}</p>
                <p className="students-count">Students in Room: {studentsCount}</p>
                {solutionMatched && <div className="smiley">😃</div>}
                <div className="editor-wrapper" onClick={role === 'mentor' ? handleMentorClick : undefined}>
                    <Editor
                        value={code}
                        onValueChange={role === 'student' ? handleCodeChange : () => {}}
                        highlight={code => highlight(code, languages.js)}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 14,
                        }}
                        className={`code-editor ${role === 'mentor' ? 'read-only' : ''}`}
                        readOnly={role === 'mentor'}
                    />
                    <div className={`bubble-tooltip ${showBubble ? 'show' : ''}`}>
                        As a mentor, you can only observe the code!
                    </div>
                </div>
                {/* Add the Return to Code Block List button */}
                <button onClick={handleReturnToList} className="return-button">
                    Return to Code Block List
                </button>
            </div>
        </div>
    );
};

export default CodeBlock;

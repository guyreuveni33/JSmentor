import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CodeBlockList.css';

const CodeBlockList = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://mentorcodespace-production.up.railway.app/codeblocks')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then((data) => setCodeBlocks(data))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    return (
        <div className="code-block-container">
            <h1 className="title">Choose Your Code Block</h1>
            <div className="code-block-list">
                {codeBlocks.length === 0 ? (
                    <p className="no-blocks">No code blocks available</p>
                ) : (
                    <ul>
                        {codeBlocks.map((block) => (
                            <li key={block._id} className="code-block-item">
                                <Link to={`/codeblock/${block._id}`} className="code-block-link">
                                    <span className="code-block-name">{block.name}</span>
                                    <span className="arrow">→</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CodeBlockList;
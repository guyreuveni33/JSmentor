import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './CodeBlockList.css'; // Import the CSS file for styling

const CodeBlockList = () => {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the code blocks from the server
        fetch('http://localhost:5000/codeblocks')
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

    return (<div>

            <h1>Choose Your Code Block</h1>
            <div className="code-block-list">
                {codeBlocks.length === 0 ? (
                    <p>No code blocks available</p>
                ) : (
                    <ul>
                        {codeBlocks.map((block) => (
                            <li key={block._id} className="code-block-item">
                                <Link to={`/codeblock/${block._id}`}>{block.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CodeBlockList;

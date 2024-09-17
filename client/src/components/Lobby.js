import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Lobby() {
    const [codeBlocks, setCodeBlocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/codeblocks')
            .then((res) => res.json())
            .then((data) => setCodeBlocks(data))
            .catch((err) => console.error('Failed to fetch code blocks:', err));
    }, []);

    const handleBlockClick = (blockId) => {
        navigate(`/codeblock/${blockId}`);
    };

    return (
        <div>
            <h1>Choose Code Block</h1>
            <ul>
                {codeBlocks.map((block) => (
                    <li key={block._id} onClick={() => handleBlockClick(block._id)}>
                        {block.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Lobby;

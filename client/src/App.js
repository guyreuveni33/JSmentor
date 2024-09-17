import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeBlockList from './components/CodeBlockList'; // Component for listing code blocks
import CodeBlock from './components/CodeBlock'; // Component for the actual code block page

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route for chaaoosing a code block */}
                    <Route path="/" element={<CodeBlockList />} />

                    {/* Route for the actual code block page */}
                    <Route path="/codeblock/:codeBlockId" element={<CodeBlock />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

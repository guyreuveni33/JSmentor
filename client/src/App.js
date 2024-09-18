import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeBlockList from './components/CodeBlockList';
import CodeBlock from './CodeBlock';
import './styles/global.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Route for choosing a code block */}
                    <Route path="/" element={<CodeBlockList />} />
                    {/* Route for the actual code block page */}
                    <Route path="/codeblock/:codeBlockId" element={<CodeBlock />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

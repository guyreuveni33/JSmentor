import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './EditorWrapper.css';

const EditorWrapper = ({ codeBlockId, code, handleCodeChange, role, showBubble, handleMentorClick }) => (
    <div className="editor-wrapper" onClick={role === 'mentor' ? handleMentorClick : undefined}>
        <Editor
            key={codeBlockId}
            value={code}
            onValueChange={handleCodeChange}
            highlight={code => highlight(code, languages.js)}
            padding={20}
            style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
            }}
            className={`code-editor ${role === 'mentor' ? 'read-only' : ''}`}
            readOnly={role === 'mentor'}
        />
        <div className={`bubble-tooltip ${showBubble ? 'show' : ''}`}>
            Observation mode active. Code modification disabled.
        </div>
    </div>
);

export default EditorWrapper;
